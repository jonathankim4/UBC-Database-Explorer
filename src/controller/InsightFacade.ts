/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";


import Log from "../Util";
import {queryParser} from "restify";
import forEach = require("core-js/fn/array/for-each");
import {writeFile} from "fs";
import {accessSync} from "fs";
import apply = Reflect.apply;
import of = require("core-js/fn/array/of");
import concat = require("core-js/fn/array/concat");
import {isNullOrUndefined} from "util";
import {isBoolean} from "util";

const http = require("http");
const parse5 = require("parse5");
const fs = require("fs");
const jz = require("jszip");

export default class InsightFacade implements IInsightFacade {
    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    // addDataset Response codes:
    // * 201: the operation was successful and the id already existed (was added in
    // * this session or was previously cached).
    // * 204: the operation was successful and the id was new (not added in this
    // * session or was previously cached).
    // * 400: the operation failed. The body should contain {"error": "my text"}
    // * to explain what went wrong.

    // TODO add response codes to D2 addDataset

    // TODO Arsenic: Should be able to add datasets independently.
    // TODO Bromine: Should not be able to perform query when dataset has not been added.
    // TODO Cesium: Should be able to perform query when dataset has been added.
    // TODO Cobalt: Should be able to add datasets independently.
    // TODO Copper: Should be able to remove datasets independently.
    // TODO Cinnamon: Should not be able to perform query when dataset has been removed.
    // TODO Edison: Should still be able to perform query when the removed dataset has different id.
    // TODO Gold: Should be able to remove datasets independently.
    // TODO Glavin: Should not be able to perform query when dataset has been removed.

addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject){
            let promiseArray: any[] = [];
            let datasetFile = id +  ".json";

            let alreadyExisted: any = false;
            if (fs.existsSync(datasetFile)){
                alreadyExisted = true;
            }

            if (id == "courses"){
                // console.log(content);
                jz.loadAsync(content, {base64: true})
                    .then(function (zip: any){
                        let courseFiles = zip["files"];
                        let numberOfFiles = Object.keys(zip.files).length;
                        if (numberOfFiles <= 1){
                            return reject({code: 400, body: {"error": "dataset was not added, contains no real data"}});
                        }

                        for (let courseFile in courseFiles){
                            if (courseFile == 'courses/'){
                                continue;
                            }
                            if (!zip.file(courseFile.toString())){
                                continue;
                            }
                            // console.log(zip.file(courseFile.toString()))
                            let promise = zip.file(courseFile.toString()).async("string")
                                .then(function (promisedCourseData: any){
                                    return Promise.resolve(promisedCourseData);
                                })
                                .catch(function (err : any){
                                    console.log("error in .async catch block: ", err);
                                    return reject({code: 400, body: {"error": "dataset was not added"}})
                                });
                            promiseArray.push(promise);
                        }
                        Promise.all(promiseArray)
                            .then(function(courseData: any){
                                let i = 0;

                                fs.writeFileSync(datasetFile,'');
                                fs.appendFileSync(datasetFile, '[');

                                for (let courseFile in courseFiles){
                                    if (courseFile == 'courses/'){
                                        continue;
                                    }

                                    let courseDataToAdd = courseData[i];
                                    let separator = " , ";
                                    if (promiseArray.length - 1 == i){
                                        separator = "]";
                                    }
                                    let dataToWrite = courseDataToAdd + separator;

                                    fs.appendFileSync(datasetFile, dataToWrite);
                                    i++;
                                }
                                if (alreadyExisted){
                                    return fulfill({code: 201, body: {"success": "dataset overwritten"}})
                                }
                                else{
                                    return fulfill({code: 204, body: {"success": "dataset added"}})
                                }
                            })
                            .catch(function(err: any){
                                console.log("error in Promise.all(promiseArray) catch block: " , err)
                                return reject({code: 400, body: {"error": "dataset was not added"}});
                            })
                    }).catch(function(err: any){
                    console.log("error in jz.loadAsync: " , err);
                    return reject({code: 400, body: {"error": "dataset was not added"}})
                });
            }
            else if (id == "rooms"){
                jz.loadAsync(content, {base64: true})
                    .then(function(roomsZip: any) {
                        // files to read are the files that contain data, the 'index.htm' file and the 'AAC', 'ACEN', ... files
                        let filesToRead: any[] = [];
                        let allZipFiles = Object.keys(roomsZip.files);
                        // regular expression to pick out the files that we want
                        let re: RegExp = /(index.htm)|(\/[A-Z]+)/g;
                        // loop through all the files in rooms.zip and select the ones we want to read
                        for (let roomFile of allZipFiles){
                            let fileToRead = roomFile.toString().match(re);
                            // filesToRead that are null are the ones the regex did not select as a match
                            // so do not add those to the filesToRead array.
                            if (fileToRead != null){
                                filesToRead.push(fileToRead[0]);
                            }
                        }
                        // upper directory for 'AAC', 'ACEN' , ... files
                        // will have to modify the upper directory for the 'index.htm' file
                        let upperDir = "campus/discover/buildings-and-classrooms";

                        for (let roomFile of filesToRead){
                            // modify the upper directory for the 'index.htm' file
                            if (roomFile.toString() == "index.htm"){
                                upperDir = "";
                            }
                            let file = roomsZip.file(upperDir + roomFile);
                            // for each of the files we want to read, we make a promise for their data
                            let promise = file.async("string")
                                .then(function (promisedCourseData: any){
                                    return Promise.resolve(promisedCourseData);
                                })
                                .catch(function (err : any){
                                    console.log("error in roomsZip.file().async catch block: ", err);
                                    return reject({code: 400, body: {"error": "dataset was not added, failed in .async"}})
                                });
                            promiseArray.push(promise);
                        }

                        // once we have all promises then we can add them to a data structure
                        Promise.all(promiseArray)
                            .then(function(htmArray: any){
                                InsightFacade.writeJsonFile(htmArray, filesToRead.slice(0,filesToRead.length-1))
                                    .then(function(buildingObjectArray: any){
                                        fs.writeFileSync('rooms.json', JSON.stringify(buildingObjectArray))
                                        if (alreadyExisted){
                                            return fulfill({code: 201, body: {"success": "dataset overwritten"}})
                                        }
                                        else{
                                            return fulfill({code: 204, body: {"success": "dataset added"}})
                                        }
                                    })
                                    .catch(function (err: any) {
                                        console.log("error in InsightFacade.writeJsonFile catch block: " , err);
                                        return reject({code: 400, body: {"error": "dataset was not added"}})
                                    });
                            })
                            .catch(function(err: any){
                                console.log("error in Promise.all catch block: ", err);
                                return reject({code: 400, body: {"error": "dataset was not added"}})
                            });
                    })
                    .catch(function(err: any){
                        console.log("error in jz.loadAsync catch block: " , err);
                        return reject({code: 400, body: {"error": "dataset was not added"}})
                    });
            }
            else{
                return reject({code: 400, body: {"error": "dataset was not added, bad id"}});
            }
        })
    }

    // findNode recursively searches for a the data specified by the id value
    // returns an array of the data
    static findNode(id: any, currentNode: any, valArray: any[]): any {
        let hyperLinkElement = false;
        let href = false;
        let tag:any;

        if (id == 'rooms_shortname') tag = "views-field views-field-field-building-code";
        if (id == 'rooms_address')   tag = "views-field views-field-field-building-address";
        if (id == 'rooms_seats')     tag = "views-field views-field-field-room-capacity";
        if (id == 'rooms_furniture') tag = "views-field views-field-field-room-furniture";
        if (id == 'rooms_type')      tag = "views-field views-field-field-room-type";

        if (id == 'rooms_number'){
            tag = "views-field views-field-field-room-number";
            hyperLinkElement = true;
        }
        if (id == 'rooms_fullname'){
            tag = "views-field views-field-title";
            hyperLinkElement = true;
        }
        if (id == 'rooms_href') {
            tag = "views-field views-field-field-room-number";
            href = true;
        }

        if ('attrs' in currentNode){
            for (let j = 0; j < currentNode['attrs'].length; j++){
                let value = currentNode['attrs'][j]['value'];
                if (value.trim() == tag){
                    let val = currentNode["childNodes"][0]['value'].trim();

                    if (val == 'Code' || val == 'Address' || val == 'Building'
                        || val == 'Room' || val == 'Capacity' || val == 'Furniture type'
                        || val == 'Room type') continue;

                    if (hyperLinkElement){
                        val = currentNode["childNodes"][1]['childNodes'][0]['value'];
                    }
                    if (href){
                        val = currentNode['childNodes'][1]["attrs"][0]['value'];
                    }

                    valArray.push(val);
                }
            }
        }
        if ('childNodes' in currentNode){
            for (let i = 0; i < Object.keys(currentNode['childNodes']).length; i++){
                let childNode = currentNode['childNodes'][i];
                InsightFacade.findNode(id, childNode, valArray);
            }
        }
        return valArray;
    }

    // writeJsonFile builds a
    static writeJsonFile(htmArray: any[], buildings: any[]): Promise<any>{
        return new Promise(function(resolve, reject){
            let buildingObjectArray: any[] = [];
            // parse index.htm which is located at the end of the array
            let indexJson = parse5.parse(htmArray.slice(-1)[0]);

            // tags from index.htm
            let rooms_shortname = "rooms_shortname";
            let rooms_fullname  = "rooms_fullname";
            let rooms_address   = "rooms_address";

            // arrays from index.htm
            let rooms_shortname_array:  any[] = [];
            let rooms_address_array:    any[] = [];
            let rooms_fullname_array:   any[] = [];

            // get data from index.htm and put it in arrays
            rooms_shortname_array   = InsightFacade.findNode(rooms_shortname,   indexJson, rooms_shortname_array);
            rooms_address_array     = InsightFacade.findNode(rooms_address,     indexJson, rooms_address_array);
            rooms_fullname_array    = InsightFacade.findNode(rooms_fullname,    indexJson, rooms_fullname_array);

            let requestPromises: any[] = [];
            let responsePromises: any[] = [];

            for (let address of rooms_address_array) {
                requestPromises.push(InsightFacade.getRequestPromise(address))
            }

            Promise.all(requestPromises)
                .then(function (requests: any) {
                    for (let request of requests) {
                        responsePromises.push(InsightFacade.getResponsePromise(request))
                    }
                    Promise.all(responsePromises)
                        .then(function (rooms_latlon_array: any) {
                            // for each of the buildings listed in index.htm, create an object {rooms_shortname, rooms_fullname, rooms_address}
                            // and store those objects in an array
                            let indexData: any[] = [];
                            for (let k in rooms_shortname_array){
                                let rooms_fullname  = rooms_fullname_array[k];
                                let rooms_address   = rooms_address_array[k];
                                let rooms_shortname = rooms_shortname_array[k];
                                // let rooms_lat       = rooms_lat_array[k];
                                // let rooms_lon       = rooms_lon_array[k];
                                let rooms_lat = JSON.parse(rooms_latlon_array[k])['lat'];
                                let rooms_lon = JSON.parse(rooms_latlon_array[k])['lon'];
                                //indexData.push({rooms_shortname, rooms_fullname, rooms_address})
                                indexData.push({rooms_shortname, rooms_fullname, rooms_address, rooms_lat, rooms_lon})
                            }

                            // htmArray is a list of the htm for all files, including the ones we do not want (MAUD, NIT), so
                            // findInValidBuildings will find the indices of the files that we don't want and return an array of those indices
                            let invalidBuildingIndices = InsightFacade.findInvalidBuildingIndices(rooms_shortname_array, buildings);

                            // for each of the htm files, check if it is an htm file to a valid building
                            for (let i = 0; i < Object.keys(htmArray).length-1; i++){
                                let skip = false;
                                for (let j = 0; j < invalidBuildingIndices.length; j++){
                                    if (i == invalidBuildingIndices[j]){
                                        skip = true;
                                    }
                                }
                                // if i is equal to a index that is not valid, then continue to the next iteration of the loop
                                if (skip) continue;

                                // for valid building i, get a json representation of building i's htm and get its shortname ID
                                let jsonFile = parse5.parse(htmArray[i]);
                                let buildingID = buildings[i].replace("/","");

                                // make an object with building i's shortname and building i's json
                                let buildingIDandJson = {buildingID, jsonFile};

                                let result = InsightFacade.createRoomArray(buildingIDandJson, indexData)
                                let buildingObject = {result, "rank": 0};

                                buildingObjectArray.push(buildingObject);
                            }
                            resolve(buildingObjectArray);
                        })
                        .catch(function (err: any) {
                            // console.log("error in Promise.all(responsePromises) catch block");
                            return reject({code: 400, body: {"error": "dataset was not added"}})
                        })
                })
                .catch(function (err: any) {
                    // console.log("error in Promise.all(requestPromises) catch block");
                    return reject({code: 400, body: {"error": "dataset was not added"}})
                });
        })
    }

    // createRoomArray will create an array of room json objects for a given building
    static createRoomArray(buildingIDandJson: any, indexData: any[]){
        // we will store all roomObjects created in the for loop in roomObjects
        let roomObjects: any[] = [];
        // buildingID is the shortname for a building e.g. ACU
        let buildingID  = buildingIDandJson.buildingID;
        // jsonFile is the json data for the building
        let jsonFile    = buildingIDandJson.jsonFile;

        let rooms_number =      "rooms_number";
        let rooms_seats =       "rooms_seats";
        let rooms_furniture =   "rooms_furniture";
        let rooms_type =        "rooms_type";
        let rooms_href =        "rooms_href";

        let rooms_number_array:     any[] = [];
        let rooms_seats_array:      any[] = [];
        let rooms_furniture_array:  any[] = [];
        let rooms_type_array:       any[] = [];
        let rooms_href_array:       any[] = [];

        InsightFacade.findNode(rooms_number,    jsonFile, rooms_number_array);
        InsightFacade.findNode(rooms_seats,     jsonFile, rooms_seats_array);
        InsightFacade.findNode(rooms_furniture, jsonFile, rooms_furniture_array);
        InsightFacade.findNode(rooms_type,      jsonFile, rooms_type_array);
        InsightFacade.findNode(rooms_href,      jsonFile, rooms_href_array);

        let numberOfRooms = rooms_number_array.length;

        // indexBuildingData is the element of indexData that is relevant to the current building
        let indexBuildingData:any;
        for (let j = 0; j < indexData.length; j ++){
            if (indexData[j].rooms_shortname == buildingID){
                indexBuildingData = indexData[j]
            }
        }

        // iterating through all rooms in a building, create a roomObject for each one
        for (let i = 0; i < numberOfRooms; i++){
            roomObjects.push(InsightFacade.createRoomObject(indexBuildingData, rooms_number_array[i], rooms_seats_array[i], rooms_furniture_array[i], rooms_type_array[i], rooms_href_array[i]))
        }
        return roomObjects;
    }

    // creates a room from information given by indexData and buildingIDandJSON
    static createRoomObject(indexBuildingData: any, rooms_number: any, rooms_seats: any, rooms_furniture: any, rooms_type: any, rooms_href: any){
        let rooms_fullname  = indexBuildingData.rooms_fullname;
        let rooms_shortname = indexBuildingData.rooms_shortname;
        let rooms_address   = indexBuildingData.rooms_address;
        let rooms_lat       = indexBuildingData.rooms_lat;
        let rooms_lon       = indexBuildingData.rooms_lon;
        let rooms_name      = rooms_shortname + "_" + rooms_number;
        rooms_seats     = parseInt(rooms_seats);
        //  rooms_number    = passed in as argument
        //  rooms_furniture = passed in as argument
        //  rooms_type      = passed in as argument
        //  rooms_href      = passed in as argument

        // return the roomObject
        return {
            rooms_fullname,
            rooms_shortname,
            rooms_address,
            rooms_lat,
            rooms_lon,
            rooms_name,
            rooms_seats,
            rooms_number,
            rooms_furniture,
            rooms_type,
            rooms_href
        };
    }

    // returns a promise for the request of the lat lon
    static getRequestPromise(address: any){
        return new Promise(function(resolve, reject){
            http.get("http://skaha.cs.ubc.ca:11316/api/v1/team58/"+address, function(response: any) {
                if (response.statusCode == 200){
                    resolve(response)
                }
                else{
                    reject({code: 400, body: {"error": "dataset was not added, error in retrieving lat/lon"}})
                }
            })
        })
    }

    // returns a promise for the response (the body) of the lat lon
    static getResponsePromise(request: any){
        return new Promise(function(resolve, reject){
            request.on('data', function(chunk: any){
                resolve(chunk.toString());
            })
        })
    }

    //finds the indices of the files that we don't want and return an array of those indices
    static findInvalidBuildingIndices(buildingsToInclude: any[], buildings: any[]){
        let invalidBuidlingIndices: any[] = [];
        for (let i in buildings){
            let match = false;
            for (let j in buildingsToInclude){
                if (buildings[i].replace("/","") == buildingsToInclude[j]){
                    match = true
                }
            }
            if (!match){
                invalidBuidlingIndices.push(i);
            }
        }
        return invalidBuidlingIndices;
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            let datasetFile = id+ ".json";

            if (!fs.existsSync(datasetFile)){
                return reject ({code: 404, body: {message: "no dataset to remove"}})
            }
            else
            {
                fs.unlinkSync(datasetFile);
                return fulfill({code: 204, body: {message: "dataset removed"}})
            }

        })
    }


    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return new Promise <InsightResponse>(function (fulfill, reject) {
            //let id = "courses.json";                         // get the path id and dataset from /courses file represented in json array and store in a variable
            //let dataSet = InsightFacade.getDataset(id);                 // get the actual dataset

            let missingIds:any[] = [];
            let queryString = JSON.stringify(query)     //turning the query ito string
            let queryDataSet:any[] = []                 // store the query dataSet and find "courses_" up to here
            let dataMatch = /"[a-zA-Z0-9]+_/g           //finding the pattern of the "<id>_
            let match = dataMatch.exec(queryString)     //checking if it matches

            while (match != null){                          //finding allthe occurences of the pattern above
                let idStr = match[0].substring(1, match[0].length-1)
                queryDataSet.push(idStr)
                match = dataMatch.exec(queryString)

                //push the matched one ito the array
                //match the query with the actual list
            }

            //  two boolean values to check that query has valid keys
            // reject when courses and rooms are being queries
            let coursesFound:boolean = false
            let roomsFound:boolean = false

            // if Transformations are defined then get the group
            if(query.TRANSFORMATIONS !== undefined){
                let group = query.TRANSFORMATIONS.GROUP
                                                // cannot be empty group
                if(group.length == 0){
                    return reject({code: 400, body: {"error": "Group must have more than 1 key"}})
                }

                for(let i in group){                                //check each group key to make sure it is a valid key
                    if(!InsightFacade.isValidKey(group[i])){
                        return reject({code: 400, body: {"error": "Group can only contain dataKeys with _"}})
                    }
                }

                let apply = query.TRANSFORMATIONS.APPLY                 // get the APPLY
                let customKey:any           // maxSeats, skurrskurr
                let token:any               // { AVG: 'rooms_shortname' }{ MAX: 'rooms_seats' }
                let whichToken:any          // MAX
                let actualKey:any           // rooms_seats etvc..

                for(let z in apply){
                    try {
                        let currKey = apply[z]
                        customKey = Object.keys(currKey)[0];
                        token = currKey[customKey]
                        whichToken = Object.keys(token)[0]
                        actualKey = token[whichToken]
                    } catch (err) {
                        return reject({code: 400, body: {"error": err.message}})}
                    if(customKey.includes("_")){
                        return reject({code: 400, body: {"error": "Invalid APPLY string that contains _, please remove"}})}
                    else {
                        continue}
                }
            }

            for (let id in queryDataSet){                   //let idStr = id.substring(1, id.length-1)
                if (!fs.existsSync(queryDataSet[id] + '.json')){          // check to see if files there
                    missingIds.push(queryDataSet[id])                     // if not push the missing ID
                }
                // reject when courses and rooms are being queries
                if(queryDataSet[id] == "courses"){coursesFound = true}
                if(queryDataSet[id] == "rooms"){roomsFound = true}
                if(coursesFound && roomsFound){
                    return reject({code: 400, body: {"error": "Query has two keys for different datasets"}})
                }
                if(missingIds.length >0){
                    Log.info("right before 424 message in insightfacade")
                    let response: InsightResponse = {
                        code: 424,                      // 424 in case of id not exist
                        body: {"missing": missingIds}
                    }
                    return reject(response)
                }
            }
            try {
                let options: any = query["OPTIONS"];                         // this is for error handling
                let columns: Array<any> = options["COLUMNS"];                // more error handling
                // check to see if query is in a valid format, specifically if the string FORM is invalid, or
                // the columns are empty, meaning no courses_dept, courses_instru.....,
                // it also checks the TABLE string is valid as well, it must equal "TABLE"
                if (!InsightFacade.isValidQuery(query))                             {return reject({code: 400, body: {"error": "Invalid Form"}})}
                if (columns.length == 0)                                             {return reject({code: 400, body: {"error": "Columns are empty Form"}})}
                if (options["FORM"] !== "TABLE" || options["FORM"] === undefined)   {return reject({code: 400, body: {"error": "Invalid Form"}})}

                let id = columns[0];                                        // get all the columns
                let dir: any;                                               // get all the directories
                let dataSet: any;                                           // current working dataset

                try {
                    if (id.substring(0, 2) == "co") {                       // part to analyze which dataset to use
                        dir = "courses.json"
                        dataSet = InsightFacade.getDataset(dir);
                    } else if (id.substring(0, 2) == "ro") {
                        dir = "rooms.json"
                        dataSet = InsightFacade.getDataset(dir);
                    }

                }catch (err) {
                    return reject({code: 424, body: {"error": err.message}})
                }

                try {
                    let response: InsightResponse;          // keep track of the responses
                    let finalResult:any[] =[]               // keep track of final result whatever it may be
                    let order = options["ORDER"]            // get ORDER option if it exists

                    //TODO D3 IMPLEMENTATION
                    // query has empty WHERE or it has FILTER options. If WHERE {} make the dataset just return the full thing and then apply other things to it

                    if(Object.keys(query.WHERE).length === 0){                                      // WHERE CLAUSE IS EMPTY {}
                        let allData = InsightFacade.reduceData(dataSet)                             // JUST GET FULL DATA
                        finalResult = allData
                    }
                    if(Object.keys(query.WHERE).length > 0){                                        // WHERE CLAUSE HAS FILTERS BRAH
                        finalResult = InsightFacade.queryFilter(dataSet, query);                    // APPLY FILTERS
                    }
                    // after we have obtained the data we want to apply either an TRANSFORMATION or a ORDER or BOTH, first apply transformation THEN apply ORDER
                    if (query.TRANSFORMATIONS !== undefined) {                // CHECK TO SEE IF TRANSFORMATION IS DEFINED
                        finalResult = InsightFacade.handleGroup(finalResult, query)
                    }
                    if(query.TRANSFORMATIONS == undefined){
                        finalResult = InsightFacade.projectColumns(finalResult, query.OPTIONS.COLUMNS);
                    }
                    // if the query option is an OBJECT then we know we will have a DIRECTION and KEYS to specify which ordering we want
                    if(typeof order === "object"){
                        let orderedResult = InsightFacade.handleOrder(finalResult, query)
                        response = {               // try to get the table ready.
                            code: 200,
                            body: {render: 'TABLE', result: orderedResult},
                        };// fulfill without ORDER
                        return fulfill(response)
                    }

                    if (typeof order === "undefined") {
                        response = {               // try to get the table ready.
                            code: 200,
                            body: {render: 'TABLE', result: finalResult},
                        };// fulfill without ORDER

                        return fulfill(response)
                    } else {
                        if (!columns.includes(order)) {
                            return reject({code: 400, body: {"error": "Columns are not matching the Order"}})
                        }

                        if (typeof order === "string") {
                            let finalResultSorted = finalResult.sort(InsightFacade.columnOrder(order));
                            response = {               // try to get the table ready.
                                code: 200,
                                body: {render: 'TABLE', result: finalResultSorted},                  // fulfill with ORDER
                            };
                            return fulfill(response);
                        }
                        else {
                            return reject({code: 400, body: {"error": "Something went wrong with the query"}})
                        }
                    }
                } catch (err) {
                    return reject({code: 400, body: {"error": err.message}})
                }
            } catch (err) {
                return reject({code: 400, body: {"error": err.message}})
            }
        })
    }

    // HANDLE THE APPLY PORTION OF QUERY FUNCTION
    static handleApply(data: any[], query: QueryRequest): any {
        let apply = query.TRANSFORMATIONS.APPLY                 // get the APPLY
        let columns = query.OPTIONS.COLUMNS
        let customKey:any           // maxSeats, skurrskurr
        let token:any               // { AVG: 'rooms_shortname' }{ MAX: 'rooms_seats' }
        let whichToken:any          // MAX
        let actualKey:any           // rooms_seats etvc..
        let finalData:any[]=[]      // store the final data
        let applyKeys:any[]=[]      // get all the applykeys

        // this goes through the apply section of the query
        for(let z in apply){            // see above to reference what this does
            let currKey = apply[z]
            customKey = Object.keys(currKey)[0];
            // check to see if the APPLY[KEY1{KEYTOKEN}, KEY1{KEYTOKEN}, KEY2{KEYTOKEN}] is a duplicate
            if(applyKeys.includes(customKey)) {throw new Error("Duplicate key for the APPLY keys")};
            applyKeys.push(customKey)
        }

        // go through columns section of the query
        for(let j in columns){
            // INVALID QUERY check to see if the columns is either a valid number key || a valid string key || an applykey
            if(InsightFacade.isValidKeyNumber(columns[j]) || InsightFacade.isValidKeyString(columns[j])){continue};
            if(!applyKeys.includes(columns[j])){throw new Error("Columns are not matching the APPLYkey")
            }else {
                continue
            }
        }

        // TODO maybe refactor here for later deliverable to increase line coverage
        for(let i in apply){
            let currKey = apply[i]
            customKey = Object.keys(currKey)[0];
            token = currKey[customKey]
            whichToken = Object.keys(token)[0]
            actualKey = token[whichToken]

            // INVALID QUERY CHECKS to see if APPLYTOKEN is valid or the value for APPLYTOKEN key is valid
            if(!InsightFacade.isValidApplyToken(whichToken)){throw new Error("Invalid APPLYTOKEN must be either AVG, MIN, MAX, SUM or, COUNT")}
            if(!InsightFacade.isValidKey(actualKey)){throw new Error("Invalid data key for APPLYTOKEN")}

            // Handle all APPLY except COUNT functions and check to see if its a valid numeric KEY
            if(InsightFacade.isValidNumberApplyToken(whichToken)){
                if(!InsightFacade.isValidKeyNumber(actualKey)){throw new Error("Invalid APPLYTOKEN for numeric fields only")}
                if(whichToken == "MAX") {finalData = InsightFacade.handleMax(data, customKey, actualKey)};      // handle max
                if(whichToken == "MIN") {finalData = InsightFacade.handleMin(data, customKey, actualKey)};      // handle min
                if(whichToken == "SUM") {finalData = InsightFacade.handleSum(data, customKey, actualKey)};      // handle sum
                if(whichToken == "AVG") {finalData = InsightFacade.handleAvg(data, customKey, actualKey)};      // handle avg
            }
            // Handle all APPLY COUNT function and check to see if its a valid numeric KEY or string KEY
            if(InsightFacade.isValidKeyNumber(actualKey) || InsightFacade.isValidKeyString(actualKey)){
                if(whichToken == "COUNT"){finalData = InsightFacade.handleCount(data, customKey, actualKey)}    // handle count
            }
            else {
                throw new Error("Key is invalid in ApplyToken")
            }
        }
        // return finaldata containing the end product of WHERE AND TRANSFORMATION
        return finalData
    }

    // HANDLE THE MAX APPLY PORTION OF QUERY FUNCTION
    static handleMax(data: any[], customKey:any, key:any): any {
        let temp:any[] =[]                  // stores the data of the temp
        key = InsightFacade.getKey(key)     // get the key for courses since courses_avg is = AVG

        for(let i in data){
            let currData = data[i]                  // data will contain [[GROUP1],[GROUP2],[GROUP3]...ETC]
            let currLength = currData.length        // get the length of current group which is [GROUP1].length
            let max = Number                        // store MAX number
            for(let j in currData) {                // so [GROUP1] ==> [OBJ1, OBJ2, OBJ3, OBJ4....ETC] containing actual data
                let currGroup = currData[j]         // GRAB OBJ1
                let count = Number(j)               // keep track of count

                if(currLength == 1){                // if GROUP is of length one then replace the MAX value with it
                    max = currGroup[key]            // customkey will be the applykey so like maxSeats or skurrskurr etc..
                    currGroup[customKey] = max      // make the object custom key right so {attrib1, attrib2, maxSeats: 120}
                    temp.push(currGroup)}            // push it to the storage unit

                if (count == 0) {                   // initialize the first MAX and move on to next one if there is one
                    max = currGroup[key]
                    continue}

                if(max < currGroup[key]){           // initialize the later MAX and move on to next one if there is one
                    max = currGroup[key]}

                if(count == currLength-1){          // once we are at the end of the of [GROUP1] array project the data
                    currGroup[customKey] = max
                    temp.push(currGroup)}}
        }
        return temp
    }

    // HANDLE THE MIN APPLY PORTION OF QUERY FUNCTION
    static handleMin(data: any[], customKey:any, key:any): any {
        let temp:any[] =[]                  // stores the data of the temp
        key = InsightFacade.getKey(key)     // get the key for courses since courses_avg is = AVG

        for(let i in data){
            let currData = data[i]                  // data will contain [[GROUP1],[GROUP2],[GROUP3]...ETC]
            let currLength = currData.length        // get the length of current group which is [GROUP1].length
            let min = Number                        // store MIN number
            for(let j in currData) {                // so [GROUP1] ==> [OBJ1, OBJ2, OBJ3, OBJ4....ETC] containing actual data
                let currGroup = currData[j]         // GRAB OBJ1
                let count = Number(j)               // keep track of count

                if(currLength == 1){                // if GROUP is of length one then replace the MIN value with it
                    min = currGroup[key]            // customkey will be the applykey so like maxSeats or skurrskurr etc..
                    currGroup[customKey] = min      // make the object custom key right so {attrib1, attrib2, maxSeats: 120}
                    temp.push(currGroup)}         // push it to the storage unit

                if (count == 0) {                   // initialize the first MIN and move on to next one if there is one
                    min = currGroup[key]
                    continue}

                if(min > currGroup[key]){           // initialize the later MIN and move on to next one if there is one
                    min = currGroup[key]}

                if(count == currLength-1){          // once we are at the end of the of [GROUP1] array project the data
                    currGroup[customKey] = min
                    temp.push(currGroup)}}
        }
        return temp
    }

    // HANDLE THE SUM APPLY PORTION OF QUERY FUNCTION see notes above to see how it works
    static handleSum(data: any[], customKey:any, key:any): any {
        let temp:any[] =[]
        key = InsightFacade.getKey(key)
        for(let i in data){
            let currData = data[i]
            let currLength = currData.length
            let sum = 0                         // only difference is we keep adding to an accumulator instead of replacing
            for(let j in currData){
                let currGroup = currData[j]     // so [GROUP1] ==> [OBJ1, OBJ2, OBJ3, OBJ4....ETC] containing actual data

                if(currLength == 1){            // case when the length of group is 1 just apply sum to the key
                    sum = currGroup[key]
                    currGroup[customKey] = sum
                    temp.push(currGroup)
                    continue}

                let count = Number(j)
                sum = sum + currGroup[key]      // here is only difference between this and AVG/MAX storing values
                if(count == currLength-1){
                    currGroup[customKey] = sum
                    temp.push(currGroup)}}
        }
        return temp
    }

    // HANDLE THE COUNT APPLY PORTION OF QUERY FUNCTION see notes above to see how it works
    static handleCount(data: any[], customKey:any, key:any): any {
        let temp:any[] =[]
        key = InsightFacade.getKey(key)
        for(let i in data){
            let currData = data[i]
            let currLength = currData.length
            let counter = 0
            let uniquekeys:any[] =[]                // everything is same as before except we will keep track of all unique keys we see
            for(let j in currData){
                let currGroup = currData[j]
                let count = Number(j)

                if(currLength == 1){                // length of group is 1 so just one unique key
                    counter = 1
                    currGroup[customKey] = counter
                    temp.push(currGroup)
                    continue}

                if (count == 0) {                   // initialize first count so we can get the unique key to work
                    uniquekeys.push(currGroup[key]) // for example we now have [KEY1] thats unique
                    counter = counter +1            // counter is +1 since its unique so far
                    continue}

                if(!uniquekeys.includes(currGroup[key])){       // next we see KEY2, not in uniquekeys, push so now [KEY1, KEY2]
                    uniquekeys.push(currGroup[key])             // push the key into array
                    counter = counter +1}                       // counter will be at 2 for this example

                if(count == currLength-1){                      // we dont do anything unless its unique so if we saw KEY1 again
                    currGroup[customKey] = counter              // we wouldnt hit here unless end of GROUP array
                    temp.push(currGroup)}}
        }
        return temp
    }

    // HANDLE THE COUNT APPLY PORTION OF QUERY FUNCTION see notes above to see how it works
    static handleAvg(data: any[], customKey:any, key:any): any {
        let temp:any[] =[]
        key = InsightFacade.getKey(key)
        for(let i in data){
            let currData = data[i]
            let currLength = currData.length
            let x = 0
            for(let j in currData){
                let currGroup = currData[j]

                if(currLength == 1){                // look at SUM same function essentially
                    let y = currGroup[key]
                    y = y * 10
                    y = Number(y.toFixed(0))
                    x = y + x
                    let avg = x / currLength
                    avg = avg / 10
                    let res  = Number(avg.toFixed(2))
                    currGroup[customKey] = res
                    temp.push(currGroup)
                    continue}

                let y = currGroup[key]
                y = y * 10
                y = Number(y.toFixed(0))
                x = y + x
                let count = Number(j)
                if(count == currLength-1){
                    let avg = x / currLength
                    avg = avg / 10
                    let res  = Number(avg.toFixed(2))
                    currGroup[customKey] = res
                    temp.push(currGroup)}}
        }
        return temp
    }

    // HANDLE THE GROUP PORTION OF QUERY FUNCTION
    static handleGroup(data: any[], query: QueryRequest): any {
        let group = query.TRANSFORMATIONS.GROUP                 // get the GROUP: [KEY1, KE2, ETC]
        let apply = query.TRANSFORMATIONS.APPLY                 // get the APPLY
        let columns = query.OPTIONS.COLUMNS                     // get the COLUMNS
        let isValidGroup: any[] = []


        for (let i in group) {                              // go through columns and groups to see if groups match columns
            for (let j in columns) {
                if (group[i] == columns[j]) {
                    isValidGroup.push(true)}}
        }
        if (apply.length === 0) {                           // this check only works for empty APPLY since columns can contain APPLY keys
            if (group.length !== columns.length || isValidGroup.length !== group.length) {
                throw new Error("GROUP in TRANSFORMATION does not match COLUMNS")}}

        let result: any[] = []
        let groupResult:any ={};
        let lastKeyResult:any = {};

        for(let i =0; i<data.length; i++) {                     // data contains the actual data
            let finalKey: string = ""                           // store then finalKey for each group and store all the unique comboes
            for (let j in group) {
                let count = Number(j)                           // need this to get the final group if more than one group
                let currentKey = InsightFacade.getKey(group[j]) // get the currentKey in the group
                finalKey = finalKey + data[i][currentKey]       // concat all the keys from unique occurances

                if (!groupResult[finalKey]) {                   // if the key is new, create the object with an empty array to store the objects
                    groupResult[finalKey] = [];
                }
                groupResult[finalKey].push(data[i])             // create the hashmap with all the keys associated
                if(count == group.length-1){
                    if (!lastKeyResult[finalKey]) {
                        lastKeyResult[finalKey] = [];
                    }
                    lastKeyResult[finalKey].push(data[i])}}     // project only the needed data afterwards
        }


        for (let key in lastKeyResult){         // get the actual data from the hashmap in the form of an array
            let tempGroup: Array<any>;
            tempGroup = lastKeyResult[key]
            result.push(tempGroup)
        }

        let results : any[] = [];               // store results
        if (apply.length === 0)                 // if applyLength is empty, only need to get the first unique occurance for each group
        {
            for(let i = 0; i < result.length; ++i){
                for (let j = 0 ; j < result[i].length; ++j)
                {
                    results.push(result[i][j]);
                    break;
                }
            }

        } else {                    // handle apply if it exists and is valid
            let finalApply = InsightFacade.handleApply(result, query)
            let final = InsightFacade.projectColumns(finalApply, query.OPTIONS.COLUMNS)
            return final

        }


        let final = InsightFacade.projectColumns(results, group)


        return final

    }

    // handle the ORDER portion of the query
    // we are passing in the data after it has filters applied to it
    static handleOrder(data: any[], query: QueryRequest): any {

        let keys = query.OPTIONS.ORDER.keys     // get keys from keys: [ 'skurr skurr' ]
        let columns = query.OPTIONS.COLUMNS     // get keys from COLUMNS: [ 'rooms_furniture', 'rooms_seats', 'rooms_shortname' ]

        for(let i in keys){
            if(columns.includes(keys[i])){
                continue
            }
            else{
                throw new Error("Order key needs to be included in columns")        // valid COLUMN order CHECK
            }
        }
        if (query.OPTIONS.ORDER.dir == "DOWN") {let final = data.sort(InsightFacade.mutipleKeySortDown(keys));return final;}
        if (query.OPTIONS.ORDER.dir == "UP") {let final = data.sort(InsightFacade.mutipleKeySortUp(keys));return final;
        } else{throw new Error("Order direction not valid")}        // DIRECTION check
    }

    // HANDLE WHEN DIRECTION IS UP
    static mutipleKeySortUp(keys:any[]) {
        return function (a:any, b:any) {
            let i =0
            let result = 0
            let keysLen = keys.length
            while(result === 0 && i < keysLen){
                result = InsightFacade.columnOrder(keys[i])(a, b);
                i++}
            return result}
    }
    // HANDLE WHEN DIRECTION IS DOWN
    static mutipleKeySortDown(keys:any[]) {
        return function (a:any, b:any) {
            let i =0
            let result = 0
            let keysLen = keys.length
            while(result === 0 && i < keysLen){
                result = InsightFacade.columnOrderDown(keys[i])(a, b);
                i++}
            return result}}
    // HANDLE WHEN DIRECTION IS DESCENDING
    static columnOrderDown(key:string) {
        return function (a:any, b:any) {
            a = (a[key])
            b = (b[key])
            if (a > b) {return -1}
            if (a < b) {return 1}
            return 0}}
    // HANDLE WHEN DIRECTION IS ASCENDING
    static columnOrder(key:string) {
        return function (a:any, b:any) {
            a = (a[key])
            b = (b[key])
            if (a < b) {return -1}
            if (a > b) {return 1}
            return 0}}

    // TODO this stuff below is all D1 and D2, although not fully done, basically finished other than a couple of tests
    static queryFilter(data: any[], query: QueryRequest): any {
        let tempData = InsightFacade.reduceData(data)                               // instead of having a nested object, we will reduce it to only the file as each object
        let resultData = InsightFacade.queryFilterOperator(query.WHERE, tempData);  // call the query filter dude
        return resultData
    }

    static queryFilterLogic(key: any, data: any): any{
        let whichKey = Object.keys(key)[0];     //key == { AND: [ { LT: [Object] }, { IS: [Object] } ] }
                                                //whichkey  == { LT: [Object] }
                                                // want to pass in { LT: [Object] }

        if(!InsightFacade.isValidComparisonKey(whichKey)){
            throw new Error("Invalid key field or LOGIC field");
        }
        let keyArray:any=[];
        for (let i in key) {                    // this returns this    [ { LT: { courses_avg: 85 }, { IS: { courses_dept: 'anat' } } ]
            let currentKey = key[i];            // for key1, key2, key3, push it all into an array
            try {
                if (currentKey.length == 0){        // if { AND: []} empty AND/OR operator
                    throw new Error
                }
            }
            catch (err)
            {
                throw err
            }
            for (let j in currentKey) {                 // push the actual key
                keyArray.push(currentKey[j])            //[ { IS: { courses_dept: 'bota' } },{ IS: { courses_dept: 'anat' } } ]
            }                                           // { IS: { courses_instructor: 'vogl, a wayne' } } want only this.
        }
        if(whichKey == "OR"){                               // whichever first key we see we deal with as indicated in whichKey
            return InsightFacade.combineOr(keyArray, data)      // HANDLE OR
        }
        else if(whichKey == "AND"){                                 // HANDLE AND
            return InsightFacade.combineAnd(keyArray, data)
        }
    }

    static queryFilterLogicNot(key: any, data: any): any{
        let whichKey = Object.keys(key)[0];     //key == { AND: [ { LT: [Object] }, { IS: [Object] } ] }
                                                //whichkey  == { LT: [Object] }
                                                // want to pass in { LT: [Object] }
        if(!InsightFacade.isValidComparisonKey(whichKey)){
            throw new Error("Invalid key field or LOGIC field")}

        let keyArray:any=[];
        for (let i in key) {                    // this returns this    [ { LT: { courses_avg: 85 }, { IS: { courses_dept: 'anat' } } ]
            let currentKey = key[i];            // for key1, key2, key3, push it all into an array
            try {
                if (currentKey.length == 0){        // if { AND: []} empty AND/OR operator
                    throw new Error
                }
            }
            catch (err){
                throw err
            }
            for (let j in currentKey) {                 // push the actual key
                keyArray.push(currentKey[j])            //[ { IS: { courses_dept: 'bota' } },{ IS: { courses_dept: 'anat' } } ]
            }                                           // { IS: { courses_instructor: 'vogl, a wayne' } } want only this.
        }
        if(whichKey == "OR"){                               // whichever first key we see we deal with as indicated in whichKey
            return InsightFacade.combineNotAnd(keyArray, data)      // HANDLE OR DEMORGANS
        }
        else if(whichKey == "AND"){                                 // HANDLE AND DEMORGANS
            return InsightFacade.combineNotOr(keyArray, data)
        }
    }

    // HANDLE AND
    static combineAnd(keys: any, data: any): any[] {
        let tempData = data;
        for(let k in keys){
            let firstKey = keys[k]
            let whichKey = Object.keys(firstKey)[0]

            if(!InsightFacade.isValidComparisonKey(whichKey)){
                throw new Error("Invalid key field or LOGIC field");
            }

            if(whichKey == "AND" || whichKey == "OR"){
                tempData = (InsightFacade.queryFilterLogic(keys[k], tempData))
            } else {
                tempData = (InsightFacade.queryFilterOperator(keys[k], tempData))

            }
        }
        return tempData
    }

    static combineNotAnd(keys: any, data: any): any[] {

        let tempData = data;

        for(let k in keys){
            let firstKey = keys[k]
            let whichKey = Object.keys(firstKey)[0]

            if(!InsightFacade.isValidComparisonKey(whichKey)){
                throw new Error("Invalid key field or LOGIC field");
            }

            if(whichKey == "AND" || whichKey == "OR"){
                tempData = (InsightFacade.queryFilterLogic(keys[k], tempData))
            } else {
                tempData = (InsightFacade.queryFilterOperatorNot(keys[k], tempData))

            }
        }
        return tempData
    }

    static combineOr(keys: any, data: any): any[] {
        let tempOR:any[] =[];
        let tempDataLogic:any[] =[];
        for(let i in keys) {
            let currKey = keys[i]
            let whichKey = Object.keys(currKey)[0]
            if(!InsightFacade.isValidComparisonKey(whichKey)){
                throw new Error("Invalid key field or LOGIC field");
            }
            if (whichKey == "AND" || whichKey == "OR") {
                let currentData = InsightFacade.queryFilterLogic(currKey, data)
                tempDataLogic = currentData.concat(tempDataLogic)

            } else {

                let currentData:any[] =[]
                if(tempOR.length < 1){
                    currentData = InsightFacade.queryFilterOperator(currKey, data)
                    tempOR = tempOR.concat(InsightFacade.combineOrHelper(currentData, []))
                    continue
                }
                currentData = InsightFacade.queryFilterOperator(currKey, data)
                tempOR = InsightFacade.combineOrHelper(currentData, tempOR)

            }
        }
        if(tempDataLogic.length > 1){
            tempOR = InsightFacade.combineOrHelper(tempOR, tempDataLogic)
        }
        return tempOR
    }

    static combineNotOr(keys: any, data: any): any[] {
        let tempOR:any[] =[];
        let tempDataLogic:any[] =[];

        for(let i in keys) {
            let currKey = keys[i]
            let whichKey = Object.keys(currKey)[0]
            if(!InsightFacade.isValidComparisonKey(whichKey)){
                throw new Error("Invalid key field or LOGIC field");
            }
            if (whichKey == "AND" || whichKey == "OR") {
                let currentData = InsightFacade.queryFilterLogic(currKey, data)
                tempDataLogic = currentData.concat(tempDataLogic)
            } else {
                let currentData:any[] =[]
                if(tempOR.length < 1){
                    currentData = InsightFacade.queryFilterOperatorNot(currKey, data)
                    tempOR = tempOR.concat(InsightFacade.combineOrHelper(currentData, []))
                    continue
                }
                currentData = InsightFacade.queryFilterOperatorNot(currKey, data)
                tempOR = InsightFacade.combineOrHelper(currentData, tempOR)
            }
        }
        if(tempDataLogic.length > 1){
            tempOR = InsightFacade.combineOrHelper(tempOR, tempDataLogic)
        }
        return tempOR
    }

    // reduce all the duplicates from array in short time using mergesort
    static combineOrHelper(seenData: any, data: any): any[] {
        seenData = seenData.concat(data)
        let sorted: any[] = []
        let whichdata = seenData[0]

        if(typeof whichdata === "undefined"){
            return sorted
        }

        if (typeof whichdata["Audit"] === "number") {
            sorted = seenData.sort(InsightFacade.columnOrder("id"));
            for (var i = 0; i < sorted.length - 1; i++) {
                if (sorted[i].id == sorted[i + 1].id) {
                    sorted.splice(i, 1)}}
            return sorted
        }

        if (typeof whichdata["rooms_name"] === "string") {
            sorted = seenData.sort(InsightFacade.columnOrder("rooms_name"));
            for (var i = 0; i < sorted.length - 1; i++) {
                if (sorted[i].rooms_name == sorted[i + 1].rooms_name) {
                    sorted.splice(i, 1)}}
            return sorted
        }
    }



    static queryFilterOperator(key: any, data: any): any[] {
        let whichKey = Object.keys(key)[0];         // since query.WHERE returns some ranch object ["GT"] we have to extract just GT which is
        let finalData:any[] = [];

        if(!InsightFacade.isValidComparisonKey(whichKey)){
            throw new Error("Invalid key field or LOGIC field");
        }
        if (whichKey == "AND" || whichKey == "OR") {
            let resultData = InsightFacade.queryFilterLogic(key, data);
            return resultData;
        }
        if(whichKey == "NOT"){
            return InsightFacade.queryFilterNot(key, data)
        }
        try {
            for(let i in data) {
                let currentObject = data[i]

                if (whichKey == "GT") {                                 // HANDLE GT
                    let keyGT = Object.keys(key.GT)[0];                 // the key so courses_avg, courses_dept, ....
                    let dataKeyGT = InsightFacade.getKey(keyGT);        // the key translated to our json format courses_avg = Avg, courses_dept = Subject
                    let keyValueGT = key.GT[keyGT];                     // { GT: { courses_avg: 76 } } ; keyValueGT = 76

                    if (!InsightFacade.isValidKeyNumber(keyGT)) {
                        throw new Error("Not Valid key");
                    }

                    if (typeof keyValueGT !== "number") {
                        throw new Error("Not Valid Number");
                    }


                    if (keyValueGT < currentObject[dataKeyGT]) {     // data[dataKeyGT] is whatever the value is at the data specified by dataKeyGT
                        if(currentObject == undefined){
                            continue
                        }
                        finalData.push(currentObject)
                    }
                }
                if (whichKey == "LT") {                                             // HANDLE LT
                    let keyLT = Object.keys(key.LT)[0];
                    let dataKeyLT = InsightFacade.getKey(keyLT);
                    let keyValueLT = key.LT[keyLT];

                    if (!InsightFacade.isValidKeyNumber(keyLT)) {
                        throw new Error("Not Valid key");
                    }

                    if (typeof keyValueLT !== "number") {
                        throw new Error("Not Valid Number");
                    }



                    if (keyValueLT > currentObject[dataKeyLT]) {
                        if(currentObject == undefined){
                            continue
                        }
                        finalData.push(currentObject)
                    }
                }
                if (whichKey == "EQ") {

                    let keyEQ = Object.keys(key.EQ)[0];
                    let dataKeyEQ = InsightFacade.getKey(keyEQ);
                    let keyValueEQ = key.EQ[keyEQ];

                    if (!InsightFacade.isValidKeyNumber(keyEQ)) {
                        throw new Error("Not Valid key");
                    }

                    if (typeof keyValueEQ !== "number") {
                        throw new Error("Not Valid Number");
                    }


                    if (keyValueEQ == currentObject[dataKeyEQ]) {
                        if(currentObject == undefined){
                            continue
                        }
                        finalData.push(currentObject)
                    }
                }
                if (whichKey == "IS") {
                    let stringObject = InsightFacade.queryFilterString(key, currentObject);

                    if(stringObject == undefined){
                        continue
                    }
                    finalData.push(stringObject)
                }
            }
        }
        catch(err){
            throw err;
        }
        return finalData;
    }

    static queryFilterNot(key: any, data: any): any[] {
        let notKey = key.NOT;
        let tempData:any[] =[];
        let whichKey = Object.keys(notKey)[0];

        if(!InsightFacade.isValidComparisonKey(whichKey)){
            throw new Error("Invalid key field or LOGIC field");
        }


        if(whichKey === "AND" || whichKey === "OR"){
            tempData = InsightFacade.queryFilterLogicNot(notKey, data)       // this is case with DEMORGANS to get NOT(AND (A,B)) = NOT(A) OR NOT(B)
            // NOT(OR(A,B)) = NOT(A) AND NOT(B)
            return tempData;
        }

        if(whichKey === "IS" || whichKey === "GT" || whichKey === "EQ" || whichKey === "LT"){
            tempData = InsightFacade.queryFilterOperatorNot(notKey, data)       // this is case with only one NOT
        }
        else {
            tempData = InsightFacade.queryFilterOperator(notKey.NOT, data)      // this is case with more than 1 NOT ; for ex, NOT, NOT, NOT
        }
        return tempData;
    }

    static queryFilterOperatorNot(key: any, data: any): any[] {
        let whichKey = Object.keys(key)[0];         // since query.WHERE returns some ranch object ["GT"] we have to extract just GT which is
        let finalData:any[] = [];
        if(!InsightFacade.isValidComparisonKey(whichKey)){
            throw new Error("Invalid key field or LOGIC field");
        }
        if (whichKey == "AND" || whichKey == "OR") {
            let resultData = InsightFacade.queryFilterLogic(key, data);
            return resultData;
        }
        if (whichKey == "NOT") {
            return InsightFacade.queryFilterNot(key, data)
        }
        try {

            for (let i in data) {           // so dataset[0] = { result: [], rank: 0 }
                let currentObject = data[i]

                if (whichKey == "GT") {                                 // HANDLE GT
                    let keyGT = Object.keys(key.GT)[0];                 // the key so courses_avg, courses_dept, ....
                    let dataKeyGT = InsightFacade.getKey(keyGT);        // the key translated to our json format courses_avg = Avg, courses_dept = Subject
                    let keyValueGT = key.GT[keyGT];                     // { GT: { courses_avg: 76 } } ; keyValueGT = 76

                    if (!InsightFacade.isValidKeyNumber(keyGT)) {
                        throw new Error("Not Valid key");
                    }

                    if (typeof keyValueGT !== "number") {
                        throw new Error("Not Valid Number");
                    }

                    if (keyValueGT >= currentObject[dataKeyGT]) {     // data[dataKeyGT] is whatever the value is at the data specified by dataKeyGT
                        if(currentObject == undefined){
                            continue
                        }
                        finalData.push(currentObject)
                    }
                }
                if (whichKey == "LT") {// HANDLE LT

                    let keyLT = Object.keys(key.LT)[0];
                    let dataKeyLT = InsightFacade.getKey(keyLT);
                    let keyValueLT = key.LT[keyLT];

                    if (!InsightFacade.isValidKeyNumber(keyLT)) {
                        throw new Error("Not Valid key");
                    }

                    if (typeof keyValueLT !== "number") {
                        throw new Error("Not Valid Number");
                    }


                    if (keyValueLT <= currentObject[dataKeyLT]) {
                        if(currentObject == undefined){
                            continue
                        }
                        finalData.push(currentObject)
                    }
                }
                if (whichKey == "EQ") {
                    let keyEQ = Object.keys(key.EQ)[0];
                    let dataKeyEQ = InsightFacade.getKey(keyEQ);
                    let keyValueEQ = key.EQ[keyEQ];

                    if (!InsightFacade.isValidKeyNumber(keyEQ)) {
                        throw new Error("Not Valid key");
                    }

                    if (typeof keyValueEQ !== "number") {
                        throw new Error("Not Valid Number");
                    }

                    if (keyValueEQ !== currentObject[dataKeyEQ]) {

                        if(currentObject == undefined){
                            continue
                        }
                        finalData.push(currentObject)
                    }
                }
                if (whichKey == "IS") {
                    let stringObject = InsightFacade.queryFilterStringNot(key, currentObject);
                    if(stringObject == undefined){
                        continue
                    }
                    finalData.push(stringObject)
                }

            }
        }
        catch(err){
            throw err;
        }
        return finalData;
    }

    static queryFilterStringNot(key: any, data: any): any {
        let whichKey = Object.keys(key)[0];
        if (whichKey == "IS") {
            let keyIS = Object.keys(key.IS)[0];
            let dataKeyIS = InsightFacade.getKey(keyIS);
            let keyValueIS = key.IS[keyIS];

            if(!InsightFacade.isValidKeyString(keyIS)){
                throw new Error("Not Valid key");
            }
            if (typeof keyValueIS !== "string") {
                throw new Error("Not Valid String");
            }

            if(data[dataKeyIS] == undefined){
                return;
            }

            if(keyValueIS.startsWith("*") && keyValueIS.endsWith("*")){     //{ IS: { courses_dept: '*an*' } }
                let stringMatch = keyValueIS.substring(1, keyValueIS.length-1);
                if(data[dataKeyIS].includes(stringMatch)) {
                    return;
                }
                return data
            }
            if(keyValueIS[keyValueIS.length -1] == "*" && !keyValueIS.startsWith("*")) {           //{ IS: { courses_dept: 'an*' } }
                let stringMatch = keyValueIS.substring(0, keyValueIS.length -1);
                if(data[dataKeyIS].startsWith(stringMatch)){
                    return
                }
                return data
            }
            if(keyValueIS[0] == "*"){                                   //{ IS: { courses_dept: '*an' } }
                let stringMatch = keyValueIS.substring(1, keyValueIS.length);
                if(data[dataKeyIS].endsWith(stringMatch)){
                    return;
                }
                return data
            }
            if (keyValueIS !== data[dataKeyIS]) {
                return data;
            }
        }
    }

    static queryFilterString(key: any, data: any): any {
        let whichKey = Object.keys(key)[0];
        if (whichKey == "IS") {
            let keyIS = Object.keys(key.IS)[0];
            let dataKeyIS = InsightFacade.getKey(keyIS);
            let keyValueIS = key.IS[keyIS];

            if(!InsightFacade.isValidKeyString(keyIS)){
                throw new Error("Not Valid key");
            }
            if (typeof keyValueIS !== "string") {
                throw new Error("Not Valid String");
            }

            if(data[dataKeyIS] == undefined){
                return;
            }

            if(keyValueIS.startsWith("*") && keyValueIS.endsWith("*")){     //{ IS: { courses_dept: '*an*' } }
                let stringMatch = keyValueIS.substring(1, keyValueIS.length-1);
                if(data[dataKeyIS].includes(stringMatch)) {
                    return data;
                }
            }

            if(keyValueIS[keyValueIS.length -1] == "*") {           //{ IS: { courses_dept: 'an*' } }
                let stringMatch = keyValueIS.substring(0, keyValueIS.length -1);
                if(data[dataKeyIS].startsWith(stringMatch)){
                    return data;
                }
            }
            if(keyValueIS[0] == "*"){                                   //{ IS: { courses_dept: '*an' } }
                let stringMatch = keyValueIS.substring(1, keyValueIS.length);
                if(data[dataKeyIS].endsWith(stringMatch)){
                    return data;
                }
            }
            if (keyValueIS == data[dataKeyIS]) {
                return data;
            }
        }
    }

    // once data is been dealt with do this to get the final product
    static projectColumns(data: any, projection: any): any[]{
        let colArray: any[] = [];
        let finalObjectArray: any[] = [];
        for (let j in projection) {
            let tempCol = projection[j];
            colArray.push(tempCol);
        }
        for(let i in data) {
            if(data[i] == undefined){
                continue;
            }
            try {
                let finalObject = {};
                let currentData = data[i];
                for (let z in colArray) {
                    let dataValue = InsightFacade.getKey(colArray[z]);
                    let tempObj: {};
                    if(colArray[z] != "courses_uuid") {
                        tempObj = {[colArray[z]]: currentData[dataValue]};
                        Object.assign(finalObject, tempObj);}
                    if(colArray[z] == "courses_uuid"){
                        let convertNum = currentData[dataValue]
                        tempObj = {[colArray[z]]: convertNum.toString()};
                        Object.assign(finalObject, tempObj);}}
                let tempFinal = finalObject;
                finalObjectArray.push(tempFinal);
            }catch (err) {
                throw new Error("undefined entries")
            }
        }
        return finalObjectArray;
    }

    // helper function for reducing the data
    static reduceData(data:any):any[] {
        let finalData:any[] = [];
        for (let i in data) {                       // so dataset[0] = { result: [], rank: 0 }
            let currentCourse = data[i];         // for exmaple set dataset[1] is = [ { tier_eighty_five: 1, tier_ninety: 1,Title: 'fnd bdy dsgn:bsc', Section: '001',...}]
            for (let j in currentCourse) {            // this contains the actual course information
                let currentSection = currentCourse[j];
                for (let k in currentSection) {
                    let currentObject = currentSection[k];
                    if(currentObject["Audit"] < 9000)
                    {
                        currentObject["Year"] = Number(currentObject["Year"]);
                        currentObject["courses_size"] = String(currentObject["Fail"] + currentObject["Pass"]);
                    }
                    if(currentObject["Section"] == "overall"){currentObject["Year"] = 1900}
                    finalData.push(currentObject)
                }
            }
        }
        return finalData
    }

    static isValidNumberApplyToken(key: any): boolean {
        if((   key === "AVG" || key === "SUM" || key === "MIN" ||  key === "MAX" )){return true}
        return false
    }

    static isValidComparisonKey(key: any): boolean {
        if((   key === "LT" || key === "EQ" || key === "AND" || key === "OR"  ||  key === "GT" ||  key === "NOT" || key === "IS")){return true}
        return false
    }

    static isValidApplyToken(key: any): boolean {
        if((   key === "AVG" || key === "SUM" || key === "MIN" || key === "COUNT"  ||  key === "MAX" )){return true
        }return false
    }

    static isValidKey(key: any): boolean {
        if((   key === "courses_avg" || key === "courses_pass" || key === "courses_fail"
            || key === "courses_audit"  ||  key === "courses_year" ||  key === "rooms_lat"
            ||  key === "rooms_lon"  ||  key === "rooms_seats" || key === "courses_dept"
            || key === "courses_id" || key === "courses_instructor" || key === "courses_size"
            || key === "courses_title" || key === "courses_uuid" || key === "rooms_fullname"
            || key === "rooms_shortname"   || key === "rooms_number"   || key === "rooms_name"
            || key === "rooms_address"   || key === "rooms_type"   || key === "rooms_furniture"
            || key === "rooms_href" )){
            return true
        }
        return false
    }

    static isValidKeyNumber(key: any): boolean {
        if((   key === "courses_avg" || key === "courses_pass" || key === "courses_fail"
            || key === "courses_audit"  ||  key === "courses_year" ||  key === "rooms_lat"
            ||  key === "rooms_lon"  ||  key === "rooms_seats" )){
            return true
        }
        return false
    }

    static isValidKeyString(key: any): boolean {
        if((key === "courses_dept" || key === "courses_id" || key === "courses_instructor"
            || key === "courses_title" || key === "courses_uuid" || key === "rooms_fullname" || key === "courses_size"
            || key === "rooms_shortname"   || key === "rooms_number"   || key === "rooms_name"
            || key === "rooms_address"   || key === "rooms_type"   || key === "rooms_furniture"
            || key === "rooms_href" )){
            return true
        }
        return false
    }

    static isValidQuery(query: QueryRequest): boolean {
        var reWHERE = /WHERE/;
        var reOPTIONS = /OPTIONS/;
        var reFORM = /FORM/;
        let queryString = JSON.stringify(query);
        if (!reWHERE.test(queryString) || !reOPTIONS.test(queryString) || !reFORM.test(queryString)) {
            return false
        }
        return true
    }

    // retrieve the actual key
    static getKey(key: string | string[]): string {
        var tempKey: string;
        if ("courses_year"== key) {tempKey = "Year";}
        else if ("courses_dept" == key) {tempKey = "Subject";}
        else if ("courses_id" == key) {tempKey = "Course";}
        else if ("courses_avg" == key) {tempKey = "Avg";}
        else if ("courses_instructor" == key) {tempKey = "Professor";}
        else if ("courses_title" == key) {tempKey = "Title";}
        else if ("courses_pass" == key) {tempKey = "Pass";}
        else if ("courses_fail" == key) {tempKey = "Fail";}
        else if ("courses_audit" == key) {tempKey = "Audit";}
        else if ("courses_uuid" == key) {tempKey = "id";}
        else {tempKey = key.toString();}
        return tempKey;
    }


    static getDataset(id: String) {
        let jsonObjectString = fs.readFileSync(id).toString();
        // turn datasetString into json array
        let dataset = JSON.parse(jsonObjectString);
        return dataset;
    }


}