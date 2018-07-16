/**
 * Created by Abdullah on 2017-01-17.
 */



import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, IInsightFacade} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import {QueryRequest} from "../src/controller/IInsightFacade";
import {error} from "util";
var fs = require("fs");


describe("InsightFacadeSpec", function () {

    var insightFacade: InsightFacade = null;

    // make sure all unit tests are independent on each other
    beforeEach(function () {
        insightFacade = new InsightFacade();
    });
    afterEach(function () {
        insightFacade = null;
    });

    ////////////////////////
    // D1 addDataset tests//
    ////////////////////////

    it("D1 addDataset: should be able to add id == 'courses' dataset", function(){

        let fs = require("fs");
        let id = "courses";


        let alreadyExisted: any = false;
        let dataset = __dirname.replace("test","") + id + ".json";
        if (fs.existsSync(dataset)){
            alreadyExisted = true;
        }

        let dir = __dirname + "/courses.zip";
        let coursesb64Data = fs.readFileSync(dir, {base64: true});

        return insightFacade.addDataset(id, coursesb64Data)
            .then(function (response: any){
                if (alreadyExisted){
                    //console.log(response);
                    expect(response.code).to.equal(201);
                }
                else{
                    // console.log(response);
                    expect(response.code).to.equal(204);
                }
            })
            .catch(function (result: any){
                //  console.log(result);
                expect.fail("dun goofed");
            });
    });

    it("D1 addDataset: should not be able to add id == 'courses' dataset from an empty content argument", function(){
        let fs = require("fs");
        let id = "courses";

        return insightFacade.addDataset(id, "")
            .then(function (response: any){
                //console.log(response);
                expect.fail("dun goofed");
            })
            .catch(function (response: any){
                //console.log(response);
                expect(response.code).to.equal(400);
            });
    });

    it("D1 addDataset: should not be able to add id == 'courses' dataset from an invalid content argument", function(){
        let id = "courses";

        return insightFacade.addDataset(id,"")
            .then(function (response: any){
                //console.log(response);
                expect.fail("dun goofed");
            })
            .catch(function (response: any){
                // console.log(response);
                expect(response.code).to.equal(400);
            });
    });

    // TODO comment out before final autotest
    it("D1 addDataset: should not be able to add id == 'courses' dataset from a zip that contains no real data", function(){
        let fs = require("fs");
        let id = "coursesEmpty";
        let dir = __dirname + "/coursesEmpty.zip";

        let b64Data = fs.readFileSync(dir, {base64: true});
        return insightFacade.addDataset(id, b64Data)
            .then(function (response: any) {
                // console.log(response);
                expect.fail("should not be here!")
            })
            .catch(function (response: any){
                //  console.log(response);
                expect(response.code).to.equal(400);
            });
    });

    ///////////////////////////
    // D1 removeDataset tests//
    ///////////////////////////


    it("D1 removeDataset: should be able to remove id == 'courses' dataset", function(){
        let fs = require("fs");
        let id = "courses";

        let alreadyExisted: any = false;
        let dataset = __dirname.replace("test","") + id + ".json";
        if (fs.existsSync(dataset)){
            alreadyExisted = true;
        }
        return insightFacade.removeDataset(id)
            .then(function(response: any){
                if (alreadyExisted){
                    // console.log(response);
                    expect(response.code).to.equal(204)
                }
                else
                {
                    // console.log(response);
                    expect(response.code).to.equal(404)
                }
            })
            .catch(function (response: any){
                // console.log(response);
                expect.fail("dun goofed");
            });
    });

    it("D1 removeDataset: should not be able to remove id == '' dataset", function(){
        let id = "";

        return insightFacade.removeDataset(id)
            .then(function(response: any){
                //  console.log(response);
                expect.fail("dun goofered")
            })
            .catch(function (response: any){
                //  console.log(response);
                expect(response.code).to.equal(404);
            });
    });

    it("D1 removeDataset: should not be able to remove id == nonsense dataset", function(){
        let id = "987.2's?'asds";

        return insightFacade.removeDataset(id)
            .then(function(response: any){
                //  console.log(response);
                expect.fail("dun goofered")
            })
            .catch(function (response: any){
                //  console.log(response);
                expect(response.code).to.equal(404);
            });
    });

    ////////////////////////
    // D2 addDataset tests//
    ////////////////////////

    it("D2 addDataset: should be able to add id == 'rooms' dataset", function(){
        let fs = require("fs");
        let id = "rooms";


        let alreadyExisted: any = false;
        let dataset = __dirname.replace("test","") + id + ".json";
        if (fs.existsSync(dataset)){
            alreadyExisted = true;
        }

        let dir = __dirname + "/rooms.zip";
        let b64Data = fs.readFileSync(dir, {base64: true});

        return insightFacade.addDataset(id, b64Data)
            .then(function (response: any){
                if (alreadyExisted){
                    //   console.log(response);
                    expect(response.code).to.equal(201);
                }
                else{
                    //   console.log(response);
                    expect(response.code).to.equal(204)
                }
            })
            .catch(function (result: any){
                // console.log(result);
                expect.fail("dun goofed");
            });
    });

    it("D2 addDataset: should not be able to add id == 'rooms' dataset from an empty content argument", function(){
        let fs = require("fs");
        let id = "rooms";

        return insightFacade.addDataset(id, "")
            .then(function (response: any){
                // console.log(response);
                expect.fail("dun goofed");
            })
            .catch(function (response: any){
                //   console.log(response);
                expect(response.code).to.equal(400);
            });
    });

    it("D2 addDataset: should not be able to add id == 'rooms' dataset from an invalid content argument", function(){
        let id = "rooms";

        return insightFacade.addDataset(id,"")
            .then(function (response: any){
                //console.log(response);
                expect.fail("dun goofed");
            })
            .catch(function (response: any){
                // console.log(response);
                expect(response.code).to.equal(400);
            });
    });

    // TODO comment out before final autotest
    it("D2 addDataset: should not be able to add id == 'rooms' dataset from a zip that contains no real data", function(){
        let fs = require("fs");
        let id = "rooms";
        let dir = __dirname + "/roomsEmpty.zip";

        let b64Data = fs.readFileSync(dir, {base64: true});
        return insightFacade.addDataset(id, b64Data)
            .then(function (response: any) {
                //console.log(response);
                expect.fail("should not be here!")
            })
            .catch(function (response: any){
                //  console.log(response);
                expect(response.code).to.equal(400);
            });
    });

    ///////////////////////////
    // D1 removeDataset tests//
    ///////////////////////////


    it("D2 removeDataset: should be able to remove id == 'rooms' dataset", function(){
        let fs = require("fs");
        let id = "rooms";


        this.timeout(15000);

        let b64Data = fs.readFileSync(__dirname + "/rooms.zip", {base64: true});

        insightFacade.addDataset(id, b64Data)

        let alreadyExisted: any = false;
        let dataset = __dirname.replace("test","") + id + ".json";
        if (fs.existsSync(dataset)){
            alreadyExisted = true;
        }
        return insightFacade.removeDataset(id)
            .then(function(response: any){
                if (alreadyExisted){
                    //  console.log(response);
                    expect(response.code).to.equal(204)
                }
                else
                {
                    //  console.log(response);
                    expect(response.code).to.equal(404)
                }
            })
            .catch(function (response: any){
                //  console.log(response);
                expect.fail("dun goofed");
            });
    });

    it("D2 removeDataset: should not be able to remove id == '' dataset", function(){
        let id = "";

        return insightFacade.removeDataset(id)
            .then(function(response: any){
                //   console.log(response);
                expect.fail("dun goofered")
            })
            .catch(function (response: any){
                // console.log(response);
                expect(response.code).to.equal(404);
            });
    });

    it("D2 removeDataset: should not be able to remove id == nonsense dataset", function(){
        let id = "987.2's?'asds";

        return insightFacade.removeDataset(id)
            .then(function(response: any){
                //    console.log(response);
                expect.fail("dun goofered")
            })
            .catch(function (response: any){
                //    console.log(response);
                expect(response.code).to.equal(404);
            });
    });

    it("PurpScurp: bomb ass dank should return 424 bruh.", function () {

        let fs = require("fs");
        let id = "courses";

        let alreadyExisted: any = false;
        let dataset = __dirname.replace("test","") + id + ".json";
        if (fs.existsSync(dataset)){
            alreadyExisted = true;
        }
        insightFacade.removeDataset(id)

        let query: QueryRequest =
            {
                "WHERE":{
                    "OR":[{},{}]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER":"courses_instructor",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
            expect(response.code == 424);
            expect(response.body == {"error": "Dat Datasert haz been cheezburgerd"});
        }).catch(function (err) {
            Log.test(err.message);
        })
    });

    it("D1 test addDataset so queries dont fail", function(){

        let fs = require("fs");
        let id = "courses";

        this.timeout(15000);

        let alreadyExisted: any = false;
        let dataset = id + ".json";
        if (fs.existsSync(dataset)){
            alreadyExisted = true;
        }

        let dir = __dirname + "/courses.zip";
        let b64Data = fs.readFileSync(dir, {base64: true});

        return insightFacade.addDataset(id, b64Data)
            .then(function (response: any){
                if (alreadyExisted){
                    console.log("dataset already existed\n");
                    console.log(response);
                    expect(response.code).to.equal(201);
                }
                else{
                    console.log("dataset is new\n");
                    console.log(response);
                    expect(response.code).to.equal(204)
                }
            })
            .catch(function (result: any){
                console.log(result);
                expect.fail("dun goofed");
            });
    });

    it("D2 test addDataset so queries dont fail", function(){
        let fs = require("fs");
        let id = "rooms";

        this.timeout(15000);

        let b64Data = fs.readFileSync(__dirname + "/rooms.zip", {base64: true});

        return insightFacade.addDataset(id, b64Data)
    });





    it("Firestorm: Should be able to find all sections in a dept not taught by a specific person.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "NOT": {
                                "IS": {
                                    "courses_instructor": "*elisa*"
                                }
                            }
                        },
                        {
                            "IS": {
                                "courses_dept": "cpsc"
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor",
                        "courses_uuid"
                    ],
                    "ORDER": {
                        "dir": "UP",
                        "keys": ["courses_instructor"]
                    },
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {
                    "render": "TABLE",
                    "result": [
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61128"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83542"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72413"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90593"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "63263"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1255"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1256"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43189"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46655"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46750"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62436"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83541"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61176"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49949"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49856"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52058"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "56854"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72478"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52057"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72477"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49947"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61087"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62487"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61178"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46748"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62486"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "25821"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62438"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62349"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1346"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "63247"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72415"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "67301"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90589"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1348"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83483"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46752"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72325"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62485"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72411"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49951"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61250"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61249"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83395"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "56870"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "56869"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62434"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52059"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61172"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1262"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52060"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "25807"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39874"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39875"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "50006"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43191"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46811"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46810"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43210"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52056"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46666"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52055"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1386"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1385"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62481"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49861"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51976"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51977"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51978"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51979"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51980"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49943"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "56856"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1381"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46744"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90649"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61180"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61092"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83538"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1344"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90587"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83479"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62440"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62355"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72470"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "63249"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72407"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "67303"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62479"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72417"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61242"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52118"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72330"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62432"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "75596"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52117"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61170"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83487"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52052"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83400"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52051"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49941"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "50002"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46742"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90515"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1340"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46806"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1270"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90585"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43195"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1379"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46668"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83477"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72405"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62430"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61168"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52050"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49869"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52049"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "56858"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72468"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49939"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62477"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46740"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1338"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61100"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90583"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83475"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72403"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90595"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62428"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62362"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61166"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "63251"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46757"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "67305"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52048"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52047"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49937"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49957"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72335"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46738"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52063"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1336"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52064"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83473"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83408"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62426"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49935"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90581"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1274"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83471"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "25811"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39878"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39879"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61240"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43197"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61187"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72399"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46677"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52116"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62447"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49872"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51987"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51988"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51989"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52115"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "56860"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62424"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "50000"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61103"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61162"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72423"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62365"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62366"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46804"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "63253"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90645"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "67307"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52044"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52043"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72342"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83534"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "75600"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49933"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72464"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83411"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83492"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46734"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90524"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62475"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1334"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90579"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83469"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1279"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61236"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "25813"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39880"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39881"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72397"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43199"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52111"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52110"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46800"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46681"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62422"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61160"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1377"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49876"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51990"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51991"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51992"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51993"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52042"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "56862"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52041"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49931"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90630"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61107"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46732"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "3402"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62469"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1332"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62371"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90577"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "63255"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83467"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "67309"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72395"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52097"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62420"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72346"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52096"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "75602"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61158"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52040"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52039"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83415"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46785"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83520"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72451"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90528"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49929"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1281"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62467"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49878"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61215"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61109"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46730"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62373"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83518"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83417"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1330"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1283"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90575"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49882"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90599"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62375"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83465"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83421"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72449"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1285"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72393"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46686"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62465"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49884"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90600"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61114"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61213"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62377"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52091"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72351"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52090"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83423"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62418"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1287"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61156"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46688"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1354"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49886"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51997"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51998"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52038"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61116"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52037"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62379"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49977"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72353"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49927"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83425"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46728"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90533"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1355"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1289"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1328"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46690"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90571"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49888"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "51999"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52000"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46779"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61118"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46759"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62381"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83461"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72355"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83512"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83427"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62463"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90535"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61209"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90618"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1292"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49958"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "25817"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39882"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39883"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83510"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43201"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49959"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72443"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46693"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72389"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61205"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49891"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52001"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52002"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52003"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52065"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "56864"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52085"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52084"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61121"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49973"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52066"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62384"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46775"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "63259"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62416"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "67311"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1365"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52067"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72358"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83508"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "75604"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61188"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62461"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83430"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61154"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61203"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90538"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61189"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1295"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62448"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "3394"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52034"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "25819"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39884"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "39885"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52033"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43203"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52032"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49925"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46696"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49971"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62449"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49894"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52004"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52005"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52006"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72425"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46726"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61124"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62387"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "67313"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1357"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1324"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72361"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46761"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "75606"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90566"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49961"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83433"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83458"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1363"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90541"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52068"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1297"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72386"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46698"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72439"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49896"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52007"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52008"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62459"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61126"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52069"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62389"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62413"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72363"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61149"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83435"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61191"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90543"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52031"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1299"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61201"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "3396"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52030"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46700"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49920"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49898"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52009"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52010"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52081"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46721"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52080"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62391"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62451"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72365"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1321"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83437"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90564"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90545"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83456"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72384"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1302"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62411"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43205"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72427"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61147"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46703"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52029"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49967"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49901"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52011"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52012"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52013"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52028"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "56866"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90608"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49917"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61131"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46719"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "3398"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62394"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83494"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "63261"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1319"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90602"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72368"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90562"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "75608"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83454"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46763"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83440"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72382"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83500"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90548"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "67317"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72431"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1305"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62409"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61145"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46706"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62457"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61193"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49904"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52014"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52015"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52016"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52073"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52027"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61134"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52026"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52072"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62397"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46767"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52025"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72371"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49915"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90606"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83443"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46717"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83498"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90551"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "43207"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1317"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1308"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62453"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62455"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46709"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90559"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83451"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49907"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52017"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52018"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52019"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "75610"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72429"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61137"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72379"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "67315"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62400"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62406"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83496"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72374"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90604"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61142"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83446"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46765"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52024"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90554"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52023"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1310"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52022"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46711"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49912"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49909"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52020"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52021"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61195"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "61139"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "46714"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "62402"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "49963"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "72376"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "1314"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83448"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52070"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "90556"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "52071"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "",
                            "courses_uuid": "83485"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "90578"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "1301"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "46702"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "49899"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "1331"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "3401"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "62393"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "90552"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "83445"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "46731"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "49930"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "72372"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "62399"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "62398"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "61136"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "61159"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "49906"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "62421"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "1306"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "83438"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "72396"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "83468"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "1333"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "46733"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "90523"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "acton, donald",
                            "courses_uuid": "90580"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "aiello, william",
                            "courses_uuid": "1252"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "aiello, william",
                            "courses_uuid": "49905"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "aiello, william",
                            "courses_uuid": "61135"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "aiello, william",
                            "courses_uuid": "83444"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "aiello, william",
                            "courses_uuid": "62344"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "83406"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "83432"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "90514"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "90512"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "75595"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "72331"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "49868"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "25806"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "49867"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "67300"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "62347"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "43194"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "83431"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "56853"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "83407"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "75605"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "72359"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "49852"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "49893"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "46695"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "46694"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "43202"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "46758"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "25818"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "allen, meghan",
                            "courses_uuid": "1250"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ascher, uri michael",
                            "courses_uuid": "72354"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ascher, uri michael",
                            "courses_uuid": "49887"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ascher, uri michael",
                            "courses_uuid": "62378"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ascher, uri michael",
                            "courses_uuid": "61115"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ascher, uri michael",
                            "courses_uuid": "46687"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ascher, uri michael",
                            "courses_uuid": "1286"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ascher, uri michael;greif, chen",
                            "courses_uuid": "90532"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ascher, uri michael;greif, chen",
                            "courses_uuid": "49885"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "awad, ahmed",
                            "courses_uuid": "62401"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "90511"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "72377"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "62392"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "72378"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "61130"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "1282"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "49910"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "62374"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "49911"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "1261"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "90582"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "83449"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "61089"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "1260"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "1300"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "90557"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "90558"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "61140"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "62351"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "62353"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "62354"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "72327"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "83439"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "49857"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "1311"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "83397"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "83398"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "83399"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "72366"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "belleville, patrice",
                            "courses_uuid": "63260"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "berg, celina",
                            "courses_uuid": "62348"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "berg, celina",
                            "courses_uuid": "62343"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "beschastnikh, ivan",
                            "courses_uuid": "49865"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "beschastnikh, ivan",
                            "courses_uuid": "62468"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "beschastnikh, ivan",
                            "courses_uuid": "62423"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "bessmeltsev, mikhail",
                            "courses_uuid": "62395"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "booth, kellogg",
                            "courses_uuid": "90648"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "bridson, robert",
                            "courses_uuid": "61133"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "bridson, robert",
                            "courses_uuid": "46704"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "49940"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "46766"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "90561"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "83499"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "62431"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "83452"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "49913"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "90607"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "43206"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "1339"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "62456"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "46716"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "61194"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carenini, giuseppe",
                            "courses_uuid": "72430"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "72321"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "1266"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "72332"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "67304"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "72333"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "72334"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "1253"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "49866"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "63250"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "83404"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "83392"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "72324"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "62361"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "49854"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "62358"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "62360"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "carter, paul martin",
                            "courses_uuid": "62359"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "62454"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "72380"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "1316"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "46741"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "49914"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "90586"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "83497"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "67316"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "61144"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "conati, cristina",
                            "courses_uuid": "62408"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "cooper, kendra",
                            "courses_uuid": "1276"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "cooper, kendra",
                            "courses_uuid": "1259"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "darwish, mohammad mostafa",
                            "courses_uuid": "72341"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "dawson, jessica",
                            "courses_uuid": "1320"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "dawson, jessica",
                            "courses_uuid": "1378"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "dawson, jessica",
                            "courses_uuid": "62435"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "dawson, jessica",
                            "courses_uuid": "62437"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "dawson, jessica;maclean, karon",
                            "courses_uuid": "49919"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "de freitas, joao",
                            "courses_uuid": "83455"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "de freitas, joao",
                            "courses_uuid": "72463"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "de freitas, joao",
                            "courses_uuid": "61235"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "de freitas, joao",
                            "courses_uuid": "46718"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "de freitas, joao",
                            "courses_uuid": "61146"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "de freitas, joao",
                            "courses_uuid": "83533"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "de volder, kris",
                            "courses_uuid": "46729"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "de volder, kris",
                            "courses_uuid": "90576"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "de volder, kris",
                            "courses_uuid": "46697"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "doucet, arnaud",
                            "courses_uuid": "90644"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "doucet, arnaud",
                            "courses_uuid": "72383"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "dulat, margaret",
                            "courses_uuid": "56855"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "dulat, margaret",
                            "courses_uuid": "46665"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "dunfield, joshua",
                            "courses_uuid": "62388"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "1309"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "83447"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "56861"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "49897"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "83434"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "46699"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "1298"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "72364"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "83436"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "56857"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "49908"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "67302"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "90544"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "46710"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "90555"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "72323"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "72320"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "90592"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "eiselt, kurt",
                            "courses_uuid": "63246"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ernst, neil",
                            "courses_uuid": "83464"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ernst, neil",
                            "courses_uuid": "61123"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ernst, neil",
                            "courses_uuid": "61122"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "83412"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "62368"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "61104"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "72343"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "72426"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "49873"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "46712"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "46760"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "61190"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "62427"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "62450"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "evans, william",
                            "courses_uuid": "83493"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "61098"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "1271"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "56865"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "62364"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "62363"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "83405"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "90546"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "61101"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "61099"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "49871"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "46676"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "46701"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "25810"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "75607"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "1273"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "43204"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "feeley, michael",
                            "courses_uuid": "1272"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "62429"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "61192"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "46739"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "62452"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "90603"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "61167"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "46762"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "1337"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "72428"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "72404"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "49960"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "friedman, joel",
                            "courses_uuid": "90584"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "fritz, thomas",
                            "courses_uuid": "72360"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "gao, xi",
                            "courses_uuid": "62352"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "49970"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "83507"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "49851"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "83391"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "62419"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "49855"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "62460"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "61202"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "1362"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "garcia, ronald",
                            "courses_uuid": "1251"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "gelbart, michael",
                            "courses_uuid": "62380"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "goldberg, murray",
                            "courses_uuid": "46675"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greenstreet, mark",
                            "courses_uuid": "72448"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greenstreet, mark",
                            "courses_uuid": "62425"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greenstreet, mark",
                            "courses_uuid": "49934"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greenstreet, mark",
                            "courses_uuid": "83472"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greenstreet, mark",
                            "courses_uuid": "83509"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greenstreet, mark",
                            "courses_uuid": "62464"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greif, chen",
                            "courses_uuid": "61082"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greif, chen",
                            "courses_uuid": "1288"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greif, chen",
                            "courses_uuid": "83424"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greif, chen",
                            "courses_uuid": "46689"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "greif, chen",
                            "courses_uuid": "61086"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "harvey, nicholas",
                            "courses_uuid": "83476"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "harvey, nicholas",
                            "courses_uuid": "49938"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "harvey, nicholas",
                            "courses_uuid": "67308"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "harvey, nicholas",
                            "courses_uuid": "83495"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "heidrich, wolfgang",
                            "courses_uuid": "90549"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "heidrich, wolfgang",
                            "courses_uuid": "72370"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "holmes, reid",
                            "courses_uuid": "3393"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "holmes, reid",
                            "courses_uuid": "62417"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "holmes, reid",
                            "courses_uuid": "62458"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hoos, holger",
                            "courses_uuid": "61179"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hoos, holger",
                            "courses_uuid": "62439"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hoos, holger",
                            "courses_uuid": "90594"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "61105"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "62367"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "83413"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "83414"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "72345"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "49874"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "1364"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "1277"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "90617"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "62370"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "72442"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "61204"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hu, alan",
                            "courses_uuid": "49972"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "72373"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "72394"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "83403"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "1307"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "62356"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "90542"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "61096"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "49928"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "1329"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "49881"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "83420"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "83466"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutchinson, norman",
                            "courses_uuid": "61157"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "hutter, frank",
                            "courses_uuid": "72381"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "khosravi, hassan",
                            "courses_uuid": "67310"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "khosravi, hassan",
                            "courses_uuid": "62372"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "khosravi, hassan",
                            "courses_uuid": "1280"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "khosravi, hassan",
                            "courses_uuid": "1278"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "72322"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "62346"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "61084"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "1254"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "83389"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "49850"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "63245"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "43188"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "1248"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "62342"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "46653"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "72319"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "46654"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "61083"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kiczales, gregor",
                            "courses_uuid": "1249"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kirkpatrick, bonnie;manuch, jan",
                            "courses_uuid": "83486"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kirkpatrick, david",
                            "courses_uuid": "1356"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kirkpatrick, david",
                            "courses_uuid": "90601"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kirkpatrick, david",
                            "courses_uuid": "83474"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kirkpatrick, david",
                            "courses_uuid": "72402"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kirkpatrick, david",
                            "courses_uuid": "61165"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kirkpatrick, david",
                            "courses_uuid": "49936"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kirkpatrick, david",
                            "courses_uuid": "46737"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kirkpatrick, david",
                            "courses_uuid": "1335"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "72388"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "72422"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "72387"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "1322"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "1323"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "46724"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "90526"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "46679"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "61152"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "49877"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "61108"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "46756"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "83416"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "49924"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "90569"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "46691"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "83460"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "61186"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "knorr, edwin max",
                            "courses_uuid": "46725"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "kotthoff, lars",
                            "courses_uuid": "62369"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "krasic, charles",
                            "courses_uuid": "90629"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "krasic, charles",
                            "courses_uuid": "46707"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "krasic, charles",
                            "courses_uuid": "90553"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "lakshmanan, laks",
                            "courses_uuid": "61153"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "lakshmanan, laks",
                            "courses_uuid": "83429"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "lakshmanan, laks",
                            "courses_uuid": "62383"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "lakshmanan, laks",
                            "courses_uuid": "83459"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "lakshmanan, laks",
                            "courses_uuid": "49890"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "lakshmanan, laks",
                            "courses_uuid": "1291"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "lakshmanan, laks",
                            "courses_uuid": "90570"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "leyton-brown, kevin",
                            "courses_uuid": "61175"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "leyton-brown, kevin",
                            "courses_uuid": "83484"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "leyton-brown, kevin",
                            "courses_uuid": "49946"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "leyton-brown, kevin",
                            "courses_uuid": "46715"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "leyton-brown, kevin",
                            "courses_uuid": "90560"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "leyton-brown, kevin",
                            "courses_uuid": "1345"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "little, james joseph",
                            "courses_uuid": "49942"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "little, james joseph",
                            "courses_uuid": "62345"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "little, james joseph",
                            "courses_uuid": "83393"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "little, james joseph",
                            "courses_uuid": "46743"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "little, james joseph",
                            "courses_uuid": "49853"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "little, james joseph",
                            "courses_uuid": "61085"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "little, james joseph",
                            "courses_uuid": "1315"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "luk, joseph",
                            "courses_uuid": "63262"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "luk, joseph",
                            "courses_uuid": "25820"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "luk, joseph",
                            "courses_uuid": "72412"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mackworth, alan",
                            "courses_uuid": "46764"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mackworth, alan",
                            "courses_uuid": "90605"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mackworth, alan",
                            "courses_uuid": "61143"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mackworth, alan",
                            "courses_uuid": "83453"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "62476"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "50001"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "72467"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "83457"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "72385"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "62412"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "61148"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "49918"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "46720"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "83537"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "72469"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "62478"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "61241"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "46803"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "49999"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "maclean, karon",
                            "courses_uuid": "61239"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "malka, lior",
                            "courses_uuid": "75609"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "manuch, jan",
                            "courses_uuid": "49950"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "manuch, jan",
                            "courses_uuid": "62405"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "manuch, jan",
                            "courses_uuid": "62404"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "manuch, jan",
                            "courses_uuid": "62403"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "manuch, jan",
                            "courses_uuid": "1347"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mcgrenere, joanna",
                            "courses_uuid": "61081"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mcgrenere, joanna",
                            "courses_uuid": "49948"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mcgrenere, joanna",
                            "courses_uuid": "46749"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mcgrenere, joanna",
                            "courses_uuid": "46805"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mcgrenere, joanna",
                            "courses_uuid": "83390"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mcgrenere, joanna",
                            "courses_uuid": "83394"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mcgrenere, joanna",
                            "courses_uuid": "61177"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mcgrenere, joanna",
                            "courses_uuid": "72414"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "meyer, irmtraud margret",
                            "courses_uuid": "61141"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "meyer, irmtraud margret",
                            "courses_uuid": "72416"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "meyer, irmtraud margret",
                            "courses_uuid": "46751"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "meyer, irmtraud margret",
                            "courses_uuid": "83450"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "61208"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "61117"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "83426"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "83511"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "90534"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "1284"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "46685"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "49883"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "46774"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "mitchell, ian",
                            "courses_uuid": "62462"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "munzner, tamara",
                            "courses_uuid": "62480"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "munzner, tamara",
                            "courses_uuid": "1380"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "munzner, tamara",
                            "courses_uuid": "62396"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "munzner, tamara",
                            "courses_uuid": "90550"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "munzner, tamara",
                            "courses_uuid": "61102"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "munzner, tamara",
                            "courses_uuid": "83409"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "munzner, tamara",
                            "courses_uuid": "46705"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "munzner, tamara",
                            "courses_uuid": "72340"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "munzner, tamara",
                            "courses_uuid": "83442"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "murphy, gail",
                            "courses_uuid": "61095"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "murphy, gail",
                            "courses_uuid": "1267"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "murphy, gail",
                            "courses_uuid": "61097"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "murphy, gail",
                            "courses_uuid": "46667"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "murphy, gail",
                            "courses_uuid": "49864"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "murphy, kevin",
                            "courses_uuid": "46799"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "murphy, kevin",
                            "courses_uuid": "90563"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "murphy-hill, emerson",
                            "courses_uuid": "46727"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ng, raymond tak-yan",
                            "courses_uuid": "49916"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ng, raymond tak-yan",
                            "courses_uuid": "75603"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ng, raymond tak-yan",
                            "courses_uuid": "25816"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ng, raymond tak-yan",
                            "courses_uuid": "1318"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "ng, raymond tak-yan",
                            "courses_uuid": "62382"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "pai, dinesh",
                            "courses_uuid": "49903"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "pai, dinesh",
                            "courses_uuid": "1304"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "palyart-lamarche, marc",
                            "courses_uuid": "1293"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "62466"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "72450"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "61214"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "61169"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "72406"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "83519"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "83478"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "62407"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "49962"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "poole, david",
                            "courses_uuid": "3395"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "pottinger, rachel",
                            "courses_uuid": "46692"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "pottinger, rachel",
                            "courses_uuid": "61120"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "pottinger, rachel",
                            "courses_uuid": "63258"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "pottinger, rachel",
                            "courses_uuid": "49889"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "rees, tyrone",
                            "courses_uuid": "72352"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "sagaii, sara mahboubeh",
                            "courses_uuid": "62390"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "schmidt, mark",
                            "courses_uuid": "3397"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "schmidt, mark",
                            "courses_uuid": "62474"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "schmidt, mark",
                            "courses_uuid": "1376"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "schmidt, mark",
                            "courses_uuid": "62410"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "schroeder, jonatan",
                            "courses_uuid": "67314"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "sheffer, alla",
                            "courses_uuid": "83441"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "sheffer, alla",
                            "courses_uuid": "49902"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "sheffer, alla",
                            "courses_uuid": "90527"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "sheffer, alla",
                            "courses_uuid": "61132"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "shepherd, david",
                            "courses_uuid": "90540"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "shepherd, david",
                            "courses_uuid": "90539"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tompkins, david a d",
                            "courses_uuid": "63248"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "63252"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "83491"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "62415"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "56863"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "1257"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "61119"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "83422"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "72350"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "1258"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "62376"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "61113"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "49859"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "72356"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "72357"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "49860"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "83428"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "90536"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "90537"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "62414"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "62446"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "61090"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "61091"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "62350"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "1290"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "49956"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "49923"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "83396"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "49870"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "56859"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "43200"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "67306"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "75599"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "83410"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "90522"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "49900"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tsiknis, georgios",
                            "courses_uuid": "61129"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "tung, frederick",
                            "courses_uuid": "62433"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "van de panne, michiel",
                            "courses_uuid": "1303"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "van de panne, michiel",
                            "courses_uuid": "72369"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "61127"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "90525"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "75601"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "72326"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "25812"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "46680"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "46663"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "63254"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "72375"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "43198"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "61138"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "voll, kimberly",
                            "courses_uuid": "46747"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "vuong, son",
                            "courses_uuid": "46708"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "vuong, son",
                            "courses_uuid": "46784"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wagner, alan",
                            "courses_uuid": "72398"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wagner, alan",
                            "courses_uuid": "61212"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wagner, alan",
                            "courses_uuid": "46778"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wagner, alan",
                            "courses_uuid": "83517"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wagner, alan",
                            "courses_uuid": "49976"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wagner, alan",
                            "courses_uuid": "83470"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wagner, alan",
                            "courses_uuid": "61161"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wagner, alan",
                            "courses_uuid": "49932"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "warfield, andrew",
                            "courses_uuid": "43196"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "warfield, andrew",
                            "courses_uuid": "72367"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wohlstadter, eric",
                            "courses_uuid": "49966"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wohlstadter, eric",
                            "courses_uuid": "72438"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wohlstadter, eric",
                            "courses_uuid": "61200"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wohlstadter, eric",
                            "courses_uuid": "72392"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wohlstadter, eric",
                            "courses_uuid": "90574"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wohlstadter, eric",
                            "courses_uuid": "49892"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wohlstadter, eric",
                            "courses_uuid": "61155"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "72424"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "72329"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "46678"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "61125"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "90513"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "1275"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "49895"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "1296"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "90565"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "61088"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "49875"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "46713"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "61106"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "49858"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "72328"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "1313"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "46662"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "43190"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "1312"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "72344"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "62341"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "72362"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "wolfman, steven",
                            "courses_uuid": "90547"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "woodham, robert",
                            "courses_uuid": "90588"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "woodham, robert",
                            "courses_uuid": "72410"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "woodham, robert",
                            "courses_uuid": "83482"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "woodham, robert",
                            "courses_uuid": "61171"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "woodham, robert",
                            "courses_uuid": "1343"
                        },
                        {
                            "courses_dept": "cpsc",
                            "courses_instructor": "woodham, robert",
                            "courses_uuid": "46664"
                        }
                    ]
                })
        }).catch(function (err) {
            expect.fail();
        });
    });





    //Tests for QueryRequest Interface

    // it("Deepmind: Should be able to find sections ind a dept with average between 70 and 80.", function () {
    //
    //     let query: QueryRequest =
    //         {
    //             "WHERE":{
    //                 "AND":[
    //                     {
    //                         "LT": {
    //                             "courses_avg": 97
    //                         }
    //                     },
    //                     {
    //                         "GT": {
    //                             "courses_avg": 96
    //                         }
    //                     }
    //                 ]
    //             },
    //             "OPTIONS":{
    //                 "COLUMNS":[
    //                     "courses_dept",
    //                     "courses_avg"
    //                 ],
    //                 "ORDER":"courses_avg",
    //                 "FORM":"TABLE"
    //             }
    //         }
    //     return insightFacade.performQuery(query).then(function (response: InsightResponse) {
    //         expect(response.code == 200);
    //         expect(response.body).to.deep.equal(
    //             { render: 'TABLE',
    //                 result:
    //                     [ { courses_dept: 'epse', courses_avg: 96.03 },
    //                         { courses_dept: 'epse', courses_avg: 96.03 },
    //                         { courses_dept: 'kin', courses_avg: 96.06 },
    //                         { courses_dept: 'kin', courses_avg: 96.06 },
    //                         { courses_dept: 'sowk', courses_avg: 96.09 },
    //                         { courses_dept: 'libr', courses_avg: 96.1 },
    //                         { courses_dept: 'libr', courses_avg: 96.1 },
    //                         { courses_dept: 'adhe', courses_avg: 96.11 },
    //                         { courses_dept: 'sowk', courses_avg: 96.15 },
    //                         { courses_dept: 'sowk', courses_avg: 96.15 },
    //                         { courses_dept: 'cnps', courses_avg: 96.16 },
    //                         { courses_dept: 'epse', courses_avg: 96.21 },
    //                         { courses_dept: 'epse', courses_avg: 96.21 },
    //                         { courses_dept: 'epse', courses_avg: 96.21 },
    //                         { courses_dept: 'epse', courses_avg: 96.23 },
    //                         { courses_dept: 'epse', courses_avg: 96.24 },
    //                         { courses_dept: 'math', courses_avg: 96.25 },
    //                         { courses_dept: 'mtrl', courses_avg: 96.25 },
    //                         { courses_dept: 'math', courses_avg: 96.25 },
    //                         { courses_dept: 'mtrl', courses_avg: 96.25 },
    //                         { courses_dept: 'civl', courses_avg: 96.27 },
    //                         { courses_dept: 'civl', courses_avg: 96.27 },
    //                         { courses_dept: 'epse', courses_avg: 96.33 },
    //                         { courses_dept: 'math', courses_avg: 96.33 },
    //                         { courses_dept: 'cnps', courses_avg: 96.33 },
    //                         { courses_dept: 'epse', courses_avg: 96.33 },
    //                         { courses_dept: 'frst', courses_avg: 96.36 },
    //                         { courses_dept: 'frst', courses_avg: 96.36 },
    //                         { courses_dept: 'fipr', courses_avg: 96.4 },
    //                         { courses_dept: 'fipr', courses_avg: 96.4 },
    //                         { courses_dept: 'math', courses_avg: 96.44 },
    //                         { courses_dept: 'math', courses_avg: 96.44 },
    //                         { courses_dept: 'edst', courses_avg: 96.46 },
    //                         { courses_dept: 'edst', courses_avg: 96.46 },
    //                         { courses_dept: 'plan', courses_avg: 96.47 },
    //                         { courses_dept: 'plan', courses_avg: 96.47 },
    //                         { courses_dept: 'etec', courses_avg: 96.47 },
    //                         { courses_dept: 'etec', courses_avg: 96.47 },
    //                         { courses_dept: 'musc', courses_avg: 96.5 },
    //                         { courses_dept: 'midw', courses_avg: 96.5 },
    //                         { courses_dept: 'midw', courses_avg: 96.5 },
    //                         { courses_dept: 'musc', courses_avg: 96.5 },
    //                         { courses_dept: 'mine', courses_avg: 96.59 },
    //                         { courses_dept: 'nurs', courses_avg: 96.64 },
    //                         { courses_dept: 'nurs', courses_avg: 96.64 },
    //                         { courses_dept: 'nurs', courses_avg: 96.73 },
    //                         { courses_dept: 'nurs', courses_avg: 96.73 },
    //                         { courses_dept: 'spph', courses_avg: 96.8 },
    //                         { courses_dept: 'spph', courses_avg: 96.8 },
    //                         { courses_dept: 'math', courses_avg: 96.83 },
    //                         { courses_dept: 'math', courses_avg: 96.83 },
    //                         { courses_dept: 'epse', courses_avg: 96.9 },
    //                         { courses_dept: 'epse', courses_avg: 96.9 },
    //                         { courses_dept: 'audi', courses_avg: 96.9 },
    //                         { courses_dept: 'audi', courses_avg: 96.9 },
    //                         { courses_dept: 'arst', courses_avg: 96.94 },
    //                         { courses_dept: 'arst', courses_avg: 96.94 },
    //                         { courses_dept: 'spph', courses_avg: 96.96 } ]});
    //     }).catch(function (err) {
    //         Log.test(err.message);
    //         expect.fail();
    //     });
    // });


    it("MadMax: Handle double double double double negation.", function () {
        let query: QueryRequest =
            {
                "WHERE": {
                    "NOT": {
                        "NOT": {
                            "NOT": {
                                "NOT": {
                                    "IS": {
                                        "courses_dept": "zool"
                                    }
                                }
                            }
                        }
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                { render: 'TABLE',
                    result:
                        [ { courses_dept: 'zool', courses_avg: 83.67, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 85, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 85, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 86.25, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 86.25, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 86.8, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 87, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 87.14, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 87.2, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 87.7, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 87.75, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 88.08, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 88.67, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 88.75, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 88.88, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 89, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 89, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 89.17, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 89.27, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 89.45, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 89.45, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 89.5, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 89.5, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 89.56, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 89.56, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 89.57, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 90.2, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 90.45, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 90.45, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 91.67, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 91.67, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 92, courses_id: '549' },
                            { courses_dept: 'zool', courses_avg: 92.1, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 92.1, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 92.71, courses_id: '503' },
                            { courses_dept: 'zool', courses_avg: 92.71, courses_id: '503' } ]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });


    it("Joe Rogan: Invalid key should result in 400", function () {
        let query: any =
            {
                "WHERE":{
                    "GT":{
                        "courses_instructor":97
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_dept",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Bromine: should not be able to query without a dataset", function () {
        let query: any =
            {
                "WHERE":{
                    "GT":{
                        "courses_instructor":97
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_dept",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
            expect(response.code == 424);
            expect(response.body == {"missing": ["courses"]});
        }).catch(function (err) {
            Log.test(err.message);
        })
    });



    it("Cesium: should be able to query with a dataset", function () {

        let query: any =
            {
                "WHERE":{
                    "GT":{
                        "courses_avg":97
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_dept",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                { render: 'TABLE',
                    result:
                        [ { courses_dept: 'cnps', courses_avg: 99.19 },
                            { courses_dept: 'cnps', courses_avg: 97.47 },
                            { courses_dept: 'cnps', courses_avg: 97.47 },
                            { courses_dept: 'crwr', courses_avg: 98 },
                            { courses_dept: 'crwr', courses_avg: 98 },
                            { courses_dept: 'educ', courses_avg: 97.5 },
                            { courses_dept: 'eece', courses_avg: 98.75 },
                            { courses_dept: 'eece', courses_avg: 98.75 },
                            { courses_dept: 'epse', courses_avg: 98.08 },
                            { courses_dept: 'epse', courses_avg: 98.7 },
                            { courses_dept: 'epse', courses_avg: 98.36 },
                            { courses_dept: 'epse', courses_avg: 97.29 },
                            { courses_dept: 'epse', courses_avg: 97.29 },
                            { courses_dept: 'epse', courses_avg: 98.8 },
                            { courses_dept: 'epse', courses_avg: 97.41 },
                            { courses_dept: 'epse', courses_avg: 98.58 },
                            { courses_dept: 'epse', courses_avg: 98.58 },
                            { courses_dept: 'epse', courses_avg: 98.76 },
                            { courses_dept: 'epse', courses_avg: 98.76 },
                            { courses_dept: 'epse', courses_avg: 98.45 },
                            { courses_dept: 'epse', courses_avg: 98.45 },
                            { courses_dept: 'epse', courses_avg: 97.78 },
                            { courses_dept: 'epse', courses_avg: 97.41 },
                            { courses_dept: 'epse', courses_avg: 97.69 },
                            { courses_dept: 'epse', courses_avg: 97.09 },
                            { courses_dept: 'epse', courses_avg: 97.09 },
                            { courses_dept: 'epse', courses_avg: 97.67 },
                            { courses_dept: 'math', courses_avg: 97.25 },
                            { courses_dept: 'math', courses_avg: 99.78 },
                            { courses_dept: 'math', courses_avg: 99.78 },
                            { courses_dept: 'math', courses_avg: 97.48 },
                            { courses_dept: 'math', courses_avg: 97.48 },
                            { courses_dept: 'math', courses_avg: 97.09 },
                            { courses_dept: 'math', courses_avg: 97.09 },
                            { courses_dept: 'math', courses_avg: 97.25 },
                            { courses_dept: 'nurs', courses_avg: 98.71 },
                            { courses_dept: 'nurs', courses_avg: 98.71 },
                            { courses_dept: 'nurs', courses_avg: 98.21 },
                            { courses_dept: 'nurs', courses_avg: 98.21 },
                            { courses_dept: 'nurs', courses_avg: 97.53 },
                            { courses_dept: 'nurs', courses_avg: 97.53 },
                            { courses_dept: 'nurs', courses_avg: 98.5 },
                            { courses_dept: 'nurs', courses_avg: 98.5 },
                            { courses_dept: 'nurs', courses_avg: 98.58 },
                            { courses_dept: 'nurs', courses_avg: 98.58 },
                            { courses_dept: 'nurs', courses_avg: 97.33 },
                            { courses_dept: 'nurs', courses_avg: 97.33 },
                            { courses_dept: 'spph', courses_avg: 98.98 },
                            { courses_dept: 'spph', courses_avg: 98.98 } ]
                });
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    })

    it("Joe Rogan Sequel: Invalid key should result in 400", function () {
        let query: any =
            {
                "WHERE":{
                    "OR":[
                        {
                            "AND":[
                                {
                                    "GT":{
                                        "courses_avg":"1234"
                                    }
                                },
                                {
                                    "IS":{
                                        "courses_dept":"adhe"
                                    }
                                }
                            ]
                        },
                        {
                            "EQ":{
                                "courses_avg":95
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_id",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });


    it("Chappelle the Sequel: Should be able to find all instructurs in a dept with a partial name.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "OR":[
                        {
                            "AND":[
                                {
                                    "IS":{
                                        "courses_title": "abstr linear a*"
                                    }
                                },
                                {
                                    "IS":{
                                        "courses_dept":"math"
                                    }
                                }
                            ]
                        },
                        {
                            "OR":[
                                {
                                    "IS":{
                                        "courses_title": "*nc hmn ant h&*"
                                    }
                                },
                                {
                                    "IS":{
                                        "courses_dept":"anat*"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_uuid",
                        "courses_title"
                    ],
                    "FORM":"TABLE",
                    "ORDER":"courses_uuid",
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {
                    "render": "TABLE",
                    "result": [ { courses_dept: 'anat',
                        courses_uuid: '12690',
                        courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '12691',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '12692',
                            courses_title: 'fnd bdy dsgn:bsc' },
                        { courses_dept: 'anat',
                            courses_uuid: '12693',
                            courses_title: 'fnd bdy dsgn:bsc' },
                        { courses_dept: 'anat',
                            courses_uuid: '15154',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '15155',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '15156',
                            courses_title: 'fnd bdy dsgn:bsc' },
                        { courses_dept: 'anat',
                            courses_uuid: '15157',
                            courses_title: 'fnd bdy dsgn:bsc' },
                        { courses_dept: 'anat',
                            courses_uuid: '1845',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '1846',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '1847',
                            courses_title: 'fnd bdy dsgn:bsc' },
                        { courses_dept: 'anat',
                            courses_uuid: '1848',
                            courses_title: 'fnd bdy dsgn:bsc' },
                        { courses_dept: 'anat',
                            courses_uuid: '18516',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '18517',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '18518',
                            courses_title: 'fnc hmn ant musc' },
                        { courses_dept: 'anat',
                            courses_uuid: '18519',
                            courses_title: 'fnc hmn ant musc' },
                        { courses_dept: 'math',
                            courses_uuid: '27372',
                            courses_title: 'abstr linear alg' },
                        { courses_dept: 'math',
                            courses_uuid: '27373',
                            courses_title: 'abstr linear alg' },
                        { courses_dept: 'math',
                            courses_uuid: '29888',
                            courses_title: 'abstr linear alg' },
                        { courses_dept: 'math',
                            courses_uuid: '29889',
                            courses_title: 'abstr linear alg' },
                        { courses_dept: 'anat',
                            courses_uuid: '32850',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '32851',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '32976',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '32977',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'math',
                            courses_uuid: '34114',
                            courses_title: 'abstr linear alg' },
                        { courses_dept: 'math',
                            courses_uuid: '34115',
                            courses_title: 'abstr linear alg' },
                        { courses_dept: 'anat',
                            courses_uuid: '76157',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '76158',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '81126',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '81127',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'math',
                            courses_uuid: '90123',
                            courses_title: 'abstr linear alg' },
                        { courses_dept: 'math',
                            courses_uuid: '90124',
                            courses_title: 'abstr linear alg' },
                        { courses_dept: 'anat',
                            courses_uuid: '90347',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '90348',
                            courses_title: 'gross anat limbs' },
                        { courses_dept: 'anat',
                            courses_uuid: '90349',
                            courses_title: 'fnc hmn ant h&n' },
                        { courses_dept: 'anat',
                            courses_uuid: '90350',
                            courses_title: 'fnc hmn ant h&n' },
                        { courses_dept: 'anat',
                            courses_uuid: '90351',
                            courses_title: 'fnc hmn ant musc' },
                        { courses_dept: 'anat',
                            courses_uuid: '90352',
                            courses_title: 'fnc hmn ant musc' } ]
                });
        }).catch(function (err) {
            expect.fail();
        });
    })



    it("Fireball: Should be able to find all courses in a dept with a partial name.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "NOT": {
                                "IS": {
                                    "courses_dept": "*c"
                                }
                            }
                        },
                        {
                            "NOT": {
                                "IS": {
                                    "courses_instructor": ""
                                }
                            }
                        },
                        {
                            "NOT": {
                                "IS": {
                                    "courses_instructor": "a*"
                                }
                            }
                        },
                        {
                            "NOT": {
                                "GT": {
                                    "courses_avg": 52
                                }
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor",
                        "courses_uuid",
                        "courses_avg"
                    ],
                    "ORDER": {
                        "dir": "UP",
                        "keys": ["courses_instructor"]
                    },
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"courses_dept":"fopr","courses_instructor":"bendickson, dennis","courses_uuid":"84769","courses_avg":4.5},{"courses_dept":"chem","courses_instructor":"bussiere, guillaume;monga, vishakha;rogers, christine;stoodley, robin","courses_uuid":"89306","courses_avg":42.5},{"courses_dept":"lled","courses_instructor":"ferreira, alfredo","courses_uuid":"12066","courses_avg":49.73},{"courses_dept":"hist","courses_instructor":"gossen, david","courses_uuid":"17600","courses_avg":46.33},{"courses_dept":"hist","courses_instructor":"gossen, david","courses_uuid":"14376","courses_avg":49.15},{"courses_dept":"hist","courses_instructor":"gossen, david","courses_uuid":"14375","courses_avg":34},{"courses_dept":"lled","courses_instructor":"gradin, christopher","courses_uuid":"51788","courses_avg":51.14},{"courses_dept":"chbe","courses_instructor":"gyenge, elod lajos","courses_uuid":"12988","courses_avg":42},{"courses_dept":"math","courses_instructor":"lo, quin wai joseph","courses_uuid":"5169","courses_avg":51.49},{"courses_dept":"comm","courses_instructor":"rajwani, aziz","courses_uuid":"7762","courses_avg":51.43},{"courses_dept":"lled","courses_instructor":"shaw, amber","courses_uuid":"12074","courses_avg":52},{"courses_dept":"lled","courses_instructor":"shaw, amber","courses_uuid":"12069","courses_avg":49.86},{"courses_dept":"lled","courses_instructor":"shaw, amber","courses_uuid":"92655","courses_avg":47.82},{"courses_dept":"lled","courses_instructor":"shaw, amber","courses_uuid":"92651","courses_avg":47.29},{"courses_dept":"comm","courses_instructor":"sinclair, scott","courses_uuid":"7761","courses_avg":46.71},{"courses_dept":"lled","courses_instructor":"walsh marr, jennifer","courses_uuid":"92653","courses_avg":51.13},{"courses_dept":"lled","courses_instructor":"walsh marr, jennifer","courses_uuid":"12062","courses_avg":48.9},{"courses_dept":"frst","courses_instructor":"watts, susan","courses_uuid":"51393","courses_avg":46.59},{"courses_dept":"frst","courses_instructor":"watts, susan","courses_uuid":"89544","courses_avg":49.14}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });



    it("Glavin: Check that non-integer numbers work.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "LT":{
                        "courses_avg":12.24
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_instructor"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                { render: 'TABLE',
                    result:
                        [ { courses_dept: 'frst', courses_avg: 0, courses_instructor: '' },
                            { courses_dept: 'lfs', courses_avg: 0, courses_instructor: '' },
                            { courses_dept: 'lfs', courses_avg: 0, courses_instructor: '' },
                            { courses_dept: 'wood', courses_avg: 1, courses_instructor: '' },
                            { courses_dept: 'busi', courses_avg: 4, courses_instructor: '' },
                            { courses_dept: 'busi', courses_avg: 4, courses_instructor: '' },
                            { courses_dept: 'fopr', courses_avg: 4.5, courses_instructor: 'bendickson, dennis' } ]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("Kraft Punk: Contradictory query is valid results in nothing", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "NOT": {
                                "IS": {
                                    "courses_id": "420"
                                }
                            }
                        },
                        {
                            "IS": {
                                "courses_id": "420"
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_id"
                    ],
                    "ORDER":"courses_id",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                { render: 'TABLE',
                    result:
                        []});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });


    it("Lorax: Empty AND should result in 400.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER":"courses_instructor",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
            expect(response.code == 400);
            expect(response.body == {"error": "Query is not valid"});
        }).catch(function (err) {
            Log.test(err.message);
        })
    });


    it("Malibu: Empty OR should result in 400.", function () {

        let query: QueryRequest =
            {
                "WHERE":{
                    "OR":[{},{}]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER":"courses_instructor",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
            expect(response.code == 400);
            expect(response.body == {"error": "Query is not valid"});
        }).catch(function (err) {
            Log.test(err.message);
        })
    });

    it("Malibu the Sequel: Empty nested AND should result in 400.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "OR":[
                        {
                            "AND":[]
                        },
                        {
                            "EQ":{
                                "courses_avg":95
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_id",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
            expect(response.code == 400);
            expect(response.body == {"error": "Query is not valid"});
        }).catch(function (err) {
            Log.test(err.message);
        })
    });

    it("SR-71 the BlackBird: Empty nested OR should result in 400.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "OR":[]
                        },
                        {
                            "EQ":{
                                "courses_avg":95
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_id",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
            expect(response.code == 400);
            expect(response.body == {"error": "Query is not valid"});
        }).catch(function (err) {
            Log.test(err.message);
        })
    });

    it("21 the Savage: Complex query with AND, EQ, and GT.", function () {
        let query: QueryRequest =
            {
                "WHERE": {
                    "AND": [
                        {
                            "EQ": {
                                "courses_fail": 0
                            }
                        },
                        {
                            "GT": {
                                "courses_avg": 97
                            }
                        },

                    ],
                },
                "OPTIONS":{
                    "COLUMNS":[],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
            expect(response.code == 400);
            expect(response.body == {"error": "Query is not valid"});
        }).catch(function (err) {
            Log.test(err.message);
        })
    });


    it("Colusa: Test for NOT LT NOT EQ NOT GT and LT", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "OR":[
                        {
                            "AND":[
                                {
                                    "NOT": {
                                        "LT": {
                                            "courses_avg": 98
                                        }
                                    }
                                },
                                {
                                    "NOT": {
                                        "EQ": {
                                            "courses_avg": 97
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            "OR":[
                                {
                                    "NOT": {
                                        "GT": {
                                            "courses_avg": 15
                                        }
                                    }
                                },
                                {

                                    "LT": {
                                        "courses_avg": 17
                                    }

                                }
                            ]
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_uuid",
                        "courses_avg"
                    ],
                    "FORM":"TABLE",
                    "ORDER":"courses_uuid",
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"courses_dept":"eece","courses_uuid":"10235","courses_avg":98.75},{"courses_dept":"eece","courses_uuid":"10236","courses_avg":98.75},{"courses_dept":"nurs","courses_uuid":"15343","courses_avg":98.71},{"courses_dept":"nurs","courses_uuid":"15344","courses_avg":98.71},{"courses_dept":"busi","courses_uuid":"16427","courses_avg":4},{"courses_dept":"busi","courses_uuid":"16428","courses_avg":4},{"courses_dept":"cnps","courses_uuid":"26777","courses_avg":99.19},{"courses_dept":"epse","courses_uuid":"29255","courses_avg":98.58},{"courses_dept":"epse","courses_uuid":"29256","courses_avg":98.58},{"courses_dept":"epse","courses_uuid":"33779","courses_avg":98.08},{"courses_dept":"epse","courses_uuid":"33780","courses_avg":98.7},{"courses_dept":"epse","courses_uuid":"33781","courses_avg":98.36},{"courses_dept":"epse","courses_uuid":"44816","courses_avg":98.76},{"courses_dept":"epse","courses_uuid":"44817","courses_avg":98.76},{"courses_dept":"crwr","courses_uuid":"46405","courses_avg":98},{"courses_dept":"crwr","courses_uuid":"46412","courses_avg":98},{"courses_dept":"epse","courses_uuid":"49677","courses_avg":98.45},{"courses_dept":"epse","courses_uuid":"49678","courses_avg":98.45},{"courses_dept":"wood","courses_uuid":"49835","courses_avg":1},{"courses_dept":"math","courses_uuid":"5373","courses_avg":99.78},{"courses_dept":"math","courses_uuid":"5374","courses_avg":99.78},{"courses_dept":"lfs","courses_uuid":"56402","courses_avg":0},{"courses_dept":"lfs","courses_uuid":"56403","courses_avg":0},{"courses_dept":"epse","courses_uuid":"6320","courses_avg":98.8},{"courses_dept":"spph","courses_uuid":"65069","courses_avg":98.98},{"courses_dept":"spph","courses_uuid":"65070","courses_avg":98.98},{"courses_dept":"nurs","courses_uuid":"73638","courses_avg":98.21},{"courses_dept":"nurs","courses_uuid":"73639","courses_avg":98.21},{"courses_dept":"fopr","courses_uuid":"84769","courses_avg":4.5},{"courses_dept":"nurs","courses_uuid":"88151","courses_avg":98.5},{"courses_dept":"nurs","courses_uuid":"88152","courses_avg":98.5},{"courses_dept":"frst","courses_uuid":"89536","courses_avg":0},{"courses_dept":"nurs","courses_uuid":"96250","courses_avg":98.58},{"courses_dept":"nurs","courses_uuid":"96251","courses_avg":98.58}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("Bongo: Should be able to find sections with lots of auditors.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "GT":{
                        "courses_audit":20
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_audit"
                    ],
                    "ORDER":"courses_audit",
                    "FORM":"TABLE"
                }
            };
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                { render: 'TABLE',
                    result:
                        [ { courses_dept: 'cpsc', courses_audit: 21 },
                            { courses_dept: 'rhsc', courses_audit: 21 },
                            { courses_dept: 'rhsc', courses_audit: 23 } ]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });


    it("Step Brothers: Should be able to find courses in a certain year", function () {
        let query: QueryRequest =
            {
                "WHERE": {
                    "AND": [
                        {
                            "IS": {
                                "courses_instructor": "agharebparast, farshid"
                            }
                        },
                        {
                            "GT": {
                                "courses_year": 2011
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_instructor",
                        "courses_year"
                    ],
                    "ORDER":"courses_year",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                { render: 'TABLE',
                    result:
                        [ { courses_instructor: 'agharebparast, farshid',
                            courses_year: 2012 },
                            { courses_instructor: 'agharebparast, farshid',
                                courses_year: 2013 },
                            { courses_instructor: 'agharebparast, farshid',
                                courses_year: 2013 },
                            { courses_instructor: 'agharebparast, farshid',
                                courses_year: 2014 },
                            { courses_instructor: 'agharebparast, farshid',
                                courses_year: 2015 },
                            { courses_instructor: 'agharebparast, farshid',
                                courses_year: 2015 } ]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    // Tests for InsightFacade.performQuery()


    it("invalid query: query format", function () {
        let query: any = {"hamburglar": "harambe"};
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });


    it("invalid query: WHERE is missing", function () {
        let query: any =
            {
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("invalid query: OPTIONS is missing", function () {
        let query: any =
            {
                "WHERE":{
                    "GT":{
                        "courses_avg":97
                    }
                }
            };
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("invalid query: FORM is missing from OPTIONS", function () {
        let query: any =
            {
                "WHERE":{
                    "GT":{
                        "courses_avg":97
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                    // "FORM":"TABLE"
                }
            };
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("invalid query: ORDER does not match any of the COLUMNS is missing from OPTIONS", function () {
        let query: any =
            {
                "WHERE":{
                    "GT":{
                        "courses_avg":97
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_instructor",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("invalid query Sequel: columns are not correct does not match any of the COLUMNS is missing from OPTIONS", function () {
        let query: any =
            {
                "WHERE":{
                    "GT":{
                        "courses_avg":97
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_instruct",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Liberation: Invalid IS should result in 400.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "IS":{
                                "courses_dept": 85
                            }
                        },
                        {
                            "IS":{
                                "courses_instructor":"a*"
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER":"courses_instructor",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Laguna: Invalid GT with invalid number but valid key should result in 400.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "OR":[
                        {
                            "GT":{
                                "courses_avg":"bota"
                            }
                        },
                        {
                            "IS":{
                                "courses_dept":"anat"
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Laguna the Sequel: Invalid GT with valid number but invalid key should result in 400.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "OR":[
                        {
                            "GT":{
                                "courses_dept":75
                            }
                        },
                        {
                            "IS":{
                                "courses_dept":"anat"
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Kwyjibo: Invalid LT should result in 400 / Kryptonite: Invalid EQ should result in 400.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "EQ":{
                                "courses_avg":65
                            }
                        },
                        {
                            "LT":{
                                "courses_dept":"anat"
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Kwyjibo the Sequel: Invalid LT with NOT operator should result in 400 / Kryptonite: Invalid EQ should result in 400.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "NOT": {
                                "EQ": {
                                    "courses_dept": 56
                                }
                            }
                        },
                        {
                            "IS": {
                                "courses_avg": "anat"
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER":"courses_instructor",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Zoolander the Sequel: Query with mutiple dataset filters not allowed", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "NOT": {
                                "EQ": {
                                    "courses_dept": 56
                                }
                            }
                        },
                        {
                            "IS": {
                                "rooms_name": "anat"
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER":"courses_instructor",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Kwyjibo the Prequel: Invalid LT with very many NOT operator should result in 400 / Kryptonite: Invalid EQ should result in 400.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "NOT": {
                                "NOT": {
                                    "NOT": {
                                        "EQ": {
                                            "courses_instructor": 56
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "IS": {
                                "courses_avg": "anat"
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER":"courses_instructor",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });


    it("valid query but missing dataset(s)", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "GT":{
                        "courses_avg":97
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 424);
            expect(response.body == {"missing": ["id1", "id2"]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        })
    });


    it("should not be able to remove a dataset with an empty path", function(){
        let fs = require("fs");
        let id = "";

        let alreadyExisted: any = false;
        let dataset = id + ".json";
        if (fs.existsSync(dataset)){
            alreadyExisted = true;
        }
        return insightFacade.removeDataset(id)
            .then(function(response: any){
                if (alreadyExisted){
                    //console.log(response);
                    expect.fail("dun goofered")
                }
                else
                {
                    //console.log(response);
                    expect.fail("dun goofered")
                }
            })
            .catch(function (response: any){
                // console.log(response);
                expect(response.code).to.equal(404);
            });
    });

    it("should not be able to remove a dataset with an invalid path", function(){
        let fs = require("fs");
        let id = "987.2's?'asds";

        let alreadyExisted: any = false;
        let dataset = id + ".json";
        if (fs.existsSync(dataset)){
            alreadyExisted = true;
        }
        return insightFacade.removeDataset(id)
            .then(function(response: any){
                if (alreadyExisted){
                    // console.log(response);
                    expect.fail("dun goofered")
                }
                else
                {
                    //console.log(response);
                    expect.fail("dun goofered")
                }
            })
            .catch(function (response: any){
                //console.log(response);
                expect(response.code).to.equal(404);
            });
    });




    it("Rob Schiender is a pencil: should not perform query when dataset not added", function () {
        let query: any =
            {
                "WHERE":{
                    "IS":{
                        "rooms_shortname": "DM*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_shortname",
                        "rooms_fullname"
                    ],
                    "ORDER":"rooms_shortname",
                    "FORM":"TABLE"
                }
            };
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 424);
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        })
    });

    it("Rob Schiender THE SEQUEL is a stapler: query within bounding box", function (done) {
        var test = new InsightFacade();
        let simpleQuery: any =
            {
                "WHERE":{
                    "NOT":{
                        "OR":[
                            {
                                "LT":{
                                    "rooms_lat":49.27106
                                }
                            },
                            {
                                "GT":{
                                    "rooms_lon":-123.24809
                                }
                            }
                        ]
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_lat",
                        "rooms_lon",
                        "rooms_name"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["rooms_lat", "rooms_lon",  "rooms_name" ]
                    },
                    "FORM":"TABLE"
                }
            }
        let expected = {"render":"TABLE","result":[{"rooms_lat":49.27106,"rooms_lon":-123.25042,"rooms_name":"IONA_633"},{"rooms_lat":49.27106,"rooms_lon":-123.25042,"rooms_name":"IONA_301"}]}
        test.performQuery(simpleQuery)
            .then(function (result: any) {
                expect(result.code).to.equal(200);
                expect(result.body).deep.equal(expected)
                done()
            })
            .catch(function (err) {
                done(err)
            })
    })

    it("Two Feet Trap Nation: query within bounding box", function (done) {
        var test = new InsightFacade();
        let simpleQuery: any =
            {
                "WHERE":{
                    "NOT":{
                        "AND":[
                            {
                                "GT":{
                                    "rooms_lat":49.2612
                                }
                            },
                            {
                                "LT":{
                                    "rooms_lat":49.26129
                                }
                            },
                            {
                                "LT":{
                                    "rooms_lon":-123.2480
                                }
                            },
                            {
                                "GT":{
                                    "rooms_lon":-123.24809
                                }
                            }
                        ]
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_lat",
                        "rooms_lon",
                        "rooms_name"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["rooms_lat", "rooms_lon",  "rooms_name" ]
                    },
                    "FORM":"TABLE"
                }
            }
        let expected = {"render":"TABLE","result":[{"rooms_lat":49.27106,"rooms_lon":-123.25042,"rooms_name":"IONA_633"},{"rooms_lat":49.27106,"rooms_lon":-123.25042,"rooms_name":"IONA_301"},{"rooms_lat":49.2699,"rooms_lon":-123.25318,"rooms_name":"ALRD_B101"},{"rooms_lat":49.2699,"rooms_lon":-123.25318,"rooms_name":"ALRD_121"},{"rooms_lat":49.2699,"rooms_lon":-123.25318,"rooms_name":"ALRD_113"},{"rooms_lat":49.2699,"rooms_lon":-123.25318,"rooms_name":"ALRD_112"},{"rooms_lat":49.2699,"rooms_lon":-123.25318,"rooms_name":"ALRD_105"},{"rooms_lat":49.26958,"rooms_lon":-123.25741,"rooms_name":"ANSO_207"},{"rooms_lat":49.26958,"rooms_lon":-123.25741,"rooms_name":"ANSO_205"},{"rooms_lat":49.26958,"rooms_lon":-123.25741,"rooms_name":"ANSO_203"},{"rooms_lat":49.26958,"rooms_lon":-123.25741,"rooms_name":"ANSO_202"},{"rooms_lat":49.26867,"rooms_lon":-123.25692,"rooms_name":"UCLL_109"},{"rooms_lat":49.26867,"rooms_lon":-123.25692,"rooms_name":"UCLL_107"},{"rooms_lat":49.26867,"rooms_lon":-123.25692,"rooms_name":"UCLL_103"},{"rooms_lat":49.26867,"rooms_lon":-123.25692,"rooms_name":"UCLL_101"},{"rooms_lat":49.26862,"rooms_lon":-123.25237,"rooms_name":"BRKX_2367"},{"rooms_lat":49.26862,"rooms_lon":-123.25237,"rooms_name":"BRKX_2365"},{"rooms_lat":49.2683,"rooms_lon":-123.24894,"rooms_name":"SRC_220C"},{"rooms_lat":49.2683,"rooms_lon":-123.24894,"rooms_name":"SRC_220B"},{"rooms_lat":49.2683,"rooms_lon":-123.24894,"rooms_name":"SRC_220A"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D325"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D323"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D322"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D319"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D317"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D316"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D315"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D314"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D313"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D312"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D307"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D306"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D304"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D301"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D229"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D228"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D222"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D221"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D219"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D218"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D217"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D216"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D214"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D213"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D209"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D207"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D205"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D204"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_D201"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B319"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B318"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B316"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B315"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B313"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B312"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B310"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B309"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B308"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B307"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B306"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B304"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B303"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B302"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B219"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B218"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B216"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B215"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B213"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B211"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B210"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B209"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B208"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B142"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_B141"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_A203"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_A202"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_A201"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_A104"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_A103"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_A102"},{"rooms_lat":49.26826,"rooms_lon":-123.25468,"rooms_name":"BUCH_A101"},{"rooms_lat":49.26767,"rooms_lon":-123.25583,"rooms_name":"LASR_5C"},{"rooms_lat":49.26767,"rooms_lon":-123.25583,"rooms_name":"LASR_211"},{"rooms_lat":49.26767,"rooms_lon":-123.25583,"rooms_name":"LASR_107"},{"rooms_lat":49.26767,"rooms_lon":-123.25583,"rooms_name":"LASR_105"},{"rooms_lat":49.26767,"rooms_lon":-123.25583,"rooms_name":"LASR_104"},{"rooms_lat":49.26767,"rooms_lon":-123.25583,"rooms_name":"LASR_102"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_461"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_460"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_266"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_265"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_264"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_263"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_261"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_195"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_194"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_193"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_192"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_191"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_185"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_182"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_158"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_157"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_156"},{"rooms_lat":49.26766,"rooms_lon":-123.2521,"rooms_name":"IBLC_155"},{"rooms_lat":49.2666,"rooms_lon":-123.25655,"rooms_name":"AUDX_157"},{"rooms_lat":49.2666,"rooms_lon":-123.25655,"rooms_name":"AUDX_142"},{"rooms_lat":49.266463,"rooms_lon":-123.255534,"rooms_name":"MATH_225"},{"rooms_lat":49.266463,"rooms_lon":-123.255534,"rooms_name":"MATH_204"},{"rooms_lat":49.266463,"rooms_lon":-123.255534,"rooms_name":"MATH_203"},{"rooms_lat":49.266463,"rooms_lon":-123.255534,"rooms_name":"MATH_202"},{"rooms_lat":49.266463,"rooms_lon":-123.255534,"rooms_name":"MATH_105"},{"rooms_lat":49.266463,"rooms_lon":-123.255534,"rooms_name":"MATH_104"},{"rooms_lat":49.266463,"rooms_lon":-123.255534,"rooms_name":"MATH_102"},{"rooms_lat":49.266463,"rooms_lon":-123.255534,"rooms_name":"MATH_100"},{"rooms_lat":49.2663,"rooms_lon":-123.2466,"rooms_name":"MGYM_208"},{"rooms_lat":49.2663,"rooms_lon":-123.2466,"rooms_name":"MGYM_206"},{"rooms_lat":49.26627,"rooms_lon":-123.25374,"rooms_name":"HENN_304"},{"rooms_lat":49.26627,"rooms_lon":-123.25374,"rooms_name":"HENN_302"},{"rooms_lat":49.26627,"rooms_lon":-123.25374,"rooms_name":"HENN_301"},{"rooms_lat":49.26627,"rooms_lon":-123.25374,"rooms_name":"HENN_202"},{"rooms_lat":49.26627,"rooms_lon":-123.25374,"rooms_name":"HENN_201"},{"rooms_lat":49.26627,"rooms_lon":-123.25374,"rooms_name":"HENN_200"},{"rooms_lat":49.2661,"rooms_lon":-123.25165,"rooms_name":"HEBB_13"},{"rooms_lat":49.2661,"rooms_lon":-123.25165,"rooms_name":"HEBB_12"},{"rooms_lat":49.2661,"rooms_lon":-123.25165,"rooms_name":"HEBB_100"},{"rooms_lat":49.2661,"rooms_lon":-123.25165,"rooms_name":"HEBB_10"},{"rooms_lat":49.266089,"rooms_lon":-123.254816,"rooms_name":"MATX_1100"},{"rooms_lat":49.26605,"rooms_lon":-123.25623,"rooms_name":"GEOG_242"},{"rooms_lat":49.26605,"rooms_lon":-123.25623,"rooms_name":"GEOG_214"},{"rooms_lat":49.26605,"rooms_lon":-123.25623,"rooms_name":"GEOG_212"},{"rooms_lat":49.26605,"rooms_lon":-123.25623,"rooms_name":"GEOG_201"},{"rooms_lat":49.26605,"rooms_lon":-123.25623,"rooms_name":"GEOG_200"},{"rooms_lat":49.26605,"rooms_lon":-123.25623,"rooms_name":"GEOG_147"},{"rooms_lat":49.26605,"rooms_lon":-123.25623,"rooms_name":"GEOG_101"},{"rooms_lat":49.26605,"rooms_lon":-123.25623,"rooms_name":"GEOG_100"},{"rooms_lat":49.2659,"rooms_lon":-123.25308,"rooms_name":"CHEM_D300"},{"rooms_lat":49.2659,"rooms_lon":-123.25308,"rooms_name":"CHEM_D200"},{"rooms_lat":49.2659,"rooms_lon":-123.25308,"rooms_name":"CHEM_C126"},{"rooms_lat":49.2659,"rooms_lon":-123.25308,"rooms_name":"CHEM_C124"},{"rooms_lat":49.2659,"rooms_lon":-123.25308,"rooms_name":"CHEM_B250"},{"rooms_lat":49.2659,"rooms_lon":-123.25308,"rooms_name":"CHEM_B150"},{"rooms_lat":49.26545,"rooms_lon":-123.25533,"rooms_name":"LSK_462"},{"rooms_lat":49.26545,"rooms_lon":-123.25533,"rooms_name":"LSK_460"},{"rooms_lat":49.26545,"rooms_lon":-123.25533,"rooms_name":"LSK_201"},{"rooms_lat":49.26545,"rooms_lon":-123.25533,"rooms_name":"LSK_200"},{"rooms_lat":49.26541,"rooms_lon":-123.24608,"rooms_name":"FRDM_153"},{"rooms_lat":49.26517,"rooms_lon":-123.24937,"rooms_name":"WESB_201"},{"rooms_lat":49.26517,"rooms_lon":-123.24937,"rooms_name":"WESB_100"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_437"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_435"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_434"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_432"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_354"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_350"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_347"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_345"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_343"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_339"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_335"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_334"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_332"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_296"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_295"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_293"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_292"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_291"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_254"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_243"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_241"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_237"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_235"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_234"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_232"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_098"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_039"},{"rooms_lat":49.26486,"rooms_lon":-123.25364,"rooms_name":"ANGU_037"},{"rooms_lat":49.26479,"rooms_lon":-123.25249,"rooms_name":"BIOL_2519"},{"rooms_lat":49.26479,"rooms_lon":-123.25249,"rooms_name":"BIOL_2200"},{"rooms_lat":49.26479,"rooms_lon":-123.25249,"rooms_name":"BIOL_2000"},{"rooms_lat":49.26479,"rooms_lon":-123.25249,"rooms_name":"BIOL_1503"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_G66"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_G65"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_G59"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_G57"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_G55"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_G53"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_G44"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_G41"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_B79"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_B75"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_6"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_5"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_4"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_3"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_2"},{"rooms_lat":49.26478,"rooms_lon":-123.24673,"rooms_name":"WOOD_1"},{"rooms_lat":49.2643,"rooms_lon":-123.25505,"rooms_name":"SOWK_326"},{"rooms_lat":49.2643,"rooms_lon":-123.25505,"rooms_name":"SOWK_324"},{"rooms_lat":49.2643,"rooms_lon":-123.25505,"rooms_name":"SOWK_224"},{"rooms_lat":49.2643,"rooms_lon":-123.25505,"rooms_name":"SOWK_223"},{"rooms_lat":49.2643,"rooms_lon":-123.25505,"rooms_name":"SOWK_222"},{"rooms_lat":49.2643,"rooms_lon":-123.25505,"rooms_name":"SOWK_124"},{"rooms_lat":49.2643,"rooms_lon":-123.25505,"rooms_name":"SOWK_122"},{"rooms_lat":49.2642,"rooms_lon":-123.24842,"rooms_name":"SPPH_B151"},{"rooms_lat":49.2642,"rooms_lon":-123.24842,"rooms_name":"SPPH_B138"},{"rooms_lat":49.2642,"rooms_lon":-123.24842,"rooms_name":"SPPH_B136"},{"rooms_lat":49.2642,"rooms_lon":-123.24842,"rooms_name":"SPPH_B112"},{"rooms_lat":49.2642,"rooms_lon":-123.24842,"rooms_name":"SPPH_B108"},{"rooms_lat":49.2642,"rooms_lon":-123.24842,"rooms_name":"SPPH_143"},{"rooms_lat":49.26414,"rooms_lon":-123.24959,"rooms_name":"FNH_60"},{"rooms_lat":49.26414,"rooms_lon":-123.24959,"rooms_name":"FNH_50"},{"rooms_lat":49.26414,"rooms_lon":-123.24959,"rooms_name":"FNH_40"},{"rooms_lat":49.26414,"rooms_lon":-123.24959,"rooms_name":"FNH_320"},{"rooms_lat":49.26414,"rooms_lon":-123.24959,"rooms_name":"FNH_30"},{"rooms_lat":49.26414,"rooms_lon":-123.24959,"rooms_name":"FNH_20"},{"rooms_lat":49.264,"rooms_lon":-123.2559,"rooms_name":"PCOH_1302"},{"rooms_lat":49.264,"rooms_lon":-123.2559,"rooms_name":"PCOH_1215"},{"rooms_lat":49.264,"rooms_lon":-123.2559,"rooms_name":"PCOH_1011"},{"rooms_lat":49.264,"rooms_lon":-123.2559,"rooms_name":"PCOH_1009"},{"rooms_lat":49.264,"rooms_lon":-123.2559,"rooms_name":"PCOH_1008"},{"rooms_lat":49.264,"rooms_lon":-123.2559,"rooms_name":"PCOH_1003"},{"rooms_lat":49.264,"rooms_lon":-123.2559,"rooms_name":"PCOH_1002"},{"rooms_lat":49.264,"rooms_lon":-123.2559,"rooms_name":"PCOH_1001"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_210"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_209"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_208"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_207"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_206"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_205"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_204A"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_204"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_203"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_202"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_201"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_200"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_1328"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_1024"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_1023"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_1022"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_1021"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_1020"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_1005"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_1004"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_1003"},{"rooms_lat":49.26398,"rooms_lon":-123.2531,"rooms_name":"SCRF_100"},{"rooms_lat":49.26372,"rooms_lon":-123.25099,"rooms_name":"AERL_120"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_410"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_409"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_408"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_407"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_406"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_405"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_310"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_309"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_308"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_307"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_306"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_305"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_222"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_221"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_122"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_121"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_110"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_109"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_108"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_107"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_106"},{"rooms_lat":49.26293,"rooms_lon":-123.25431,"rooms_name":"SWNG_105"},{"rooms_lat":49.26274,"rooms_lon":-123.25224,"rooms_name":"ESB_2012"},{"rooms_lat":49.26274,"rooms_lon":-123.25224,"rooms_name":"ESB_1013"},{"rooms_lat":49.26274,"rooms_lon":-123.25224,"rooms_name":"ESB_1012"},{"rooms_lat":49.26273,"rooms_lon":-123.24894,"rooms_name":"CEME_1215"},{"rooms_lat":49.26273,"rooms_lon":-123.24894,"rooms_name":"CEME_1212"},{"rooms_lat":49.26273,"rooms_lon":-123.24894,"rooms_name":"CEME_1210"},{"rooms_lat":49.26273,"rooms_lon":-123.24894,"rooms_name":"CEME_1206"},{"rooms_lat":49.26273,"rooms_lon":-123.24894,"rooms_name":"CEME_1204"},{"rooms_lat":49.26273,"rooms_lon":-123.24894,"rooms_name":"CEME_1202"},{"rooms_lat":49.26236,"rooms_lon":-123.24494,"rooms_name":"LSC_1003"},{"rooms_lat":49.26236,"rooms_lon":-123.24494,"rooms_name":"LSC_1002"},{"rooms_lat":49.26236,"rooms_lon":-123.24494,"rooms_name":"LSC_1001"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_3208"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_3124"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_3122"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_3120"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_3118"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_3116"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_3115"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_3114"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_3112"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_1201"},{"rooms_lat":49.26229,"rooms_lon":-123.24342,"rooms_name":"PHRM_1101"},{"rooms_lat":49.26228,"rooms_lon":-123.24718,"rooms_name":"CHBE_103"},{"rooms_lat":49.26228,"rooms_lon":-123.24718,"rooms_name":"CHBE_102"},{"rooms_lat":49.26228,"rooms_lon":-123.24718,"rooms_name":"CHBE_101"},{"rooms_lat":49.26228,"rooms_lon":-123.25198,"rooms_name":"EOSM_135"},{"rooms_lat":49.26207,"rooms_lon":-123.25314,"rooms_name":"CIRS_1250"},{"rooms_lat":49.26176,"rooms_lon":-123.24935,"rooms_name":"MCLD_254"},{"rooms_lat":49.26176,"rooms_lon":-123.24935,"rooms_name":"MCLD_242"},{"rooms_lat":49.26176,"rooms_lon":-123.24935,"rooms_name":"MCLD_228"},{"rooms_lat":49.26176,"rooms_lon":-123.24935,"rooms_name":"MCLD_220"},{"rooms_lat":49.26176,"rooms_lon":-123.24935,"rooms_name":"MCLD_214"},{"rooms_lat":49.26176,"rooms_lon":-123.24935,"rooms_name":"MCLD_202"},{"rooms_lat":49.26176,"rooms_lon":-123.25179,"rooms_name":"FORW_519"},{"rooms_lat":49.26176,"rooms_lon":-123.25179,"rooms_name":"FORW_317"},{"rooms_lat":49.26176,"rooms_lon":-123.25179,"rooms_name":"FORW_303"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360M"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360L"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360K"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360J"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360H"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360G"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360F"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360E"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360D"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360C"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360B"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_360A"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_358"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_260"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_256"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_166"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_160"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_158"},{"rooms_lat":49.26114,"rooms_lon":-123.25027,"rooms_name":"MCML_154"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4074"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4072"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4068"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4062"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4058"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4052"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4018"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4016"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4004"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_4002"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3074"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3072"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3068"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3062"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3058"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3052"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3018"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3016"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3004"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_3002"},{"rooms_lat":49.26048,"rooms_lon":-123.24944,"rooms_name":"ORCH_1001"},{"rooms_lat":49.26047,"rooms_lon":-123.24467,"rooms_name":"OSBO_A"},{"rooms_lat":49.26047,"rooms_lon":-123.24467,"rooms_name":"OSBO_203B"},{"rooms_lat":49.26047,"rooms_lon":-123.24467,"rooms_name":"OSBO_203A"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1617"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1615"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1613"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1611"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1402"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1221"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1005"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1003"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1002"},{"rooms_lat":49.26044,"rooms_lon":-123.24886,"rooms_name":"FSC_1001"}]}
        test.performQuery(simpleQuery)
            .then(function (result: any) {
                expect(result.code).to.equal(200);
                expect(result.body).deep.equal(expected)
                done()
            })
            .catch(function (err) {
                done(err)
            })
    })



    it("ROOMS query with a bunch of nots", function () {
        let query: QueryRequest =
            {
                "WHERE": {
                    "NOT": {
                        "NOT": {
                            "NOT": {
                                "NOT": {
                                    "IS": {
                                        "rooms_type": "Tiered Large Group"
                                    }
                                }
                            }
                        }
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_type",
                        "rooms_lon",
                        "rooms_fullname"
                    ],
                    "ORDER":"rooms_fullname",
                    "FORM":"TABLE"
                }
            };
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {
                    "render": "TABLE",
                    "result": [
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25099,
                            "rooms_fullname": "Aquatic Ecosystems Research Laboratory"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25249,
                            "rooms_fullname": "Biological Sciences"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25249,
                            "rooms_fullname": "Biological Sciences"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25237,
                            "rooms_fullname": "Brock Hall Annex"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25468,
                            "rooms_fullname": "Buchanan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25314,
                            "rooms_fullname": "Centre for Interactive  Research on Sustainability"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24718,
                            "rooms_fullname": "Chemical and Biological Engineering Building"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24718,
                            "rooms_fullname": "Chemical and Biological Engineering Building"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25308,
                            "rooms_fullname": "Chemistry"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25308,
                            "rooms_fullname": "Chemistry"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25308,
                            "rooms_fullname": "Chemistry"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25308,
                            "rooms_fullname": "Chemistry"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25308,
                            "rooms_fullname": "Chemistry"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25308,
                            "rooms_fullname": "Chemistry"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24894,
                            "rooms_fullname": "Civil and Mechanical Engineering"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25224,
                            "rooms_fullname": "Earth Sciences Building"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25224,
                            "rooms_fullname": "Earth Sciences Building"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25224,
                            "rooms_fullname": "Earth Sciences Building"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24959,
                            "rooms_fullname": "Food, Nutrition and Health"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24886,
                            "rooms_fullname": "Forest Sciences Centre"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24886,
                            "rooms_fullname": "Forest Sciences Centre"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25583,
                            "rooms_fullname": "Frederic Lasserre"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25583,
                            "rooms_fullname": "Frederic Lasserre"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24608,
                            "rooms_fullname": "Friedman Building"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25623,
                            "rooms_fullname": "Geography"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25165,
                            "rooms_fullname": "Hebb"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25374,
                            "rooms_fullname": "Hennings"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25374,
                            "rooms_fullname": "Hennings"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25374,
                            "rooms_fullname": "Hennings"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25364,
                            "rooms_fullname": "Henry Angus"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25364,
                            "rooms_fullname": "Henry Angus"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25364,
                            "rooms_fullname": "Henry Angus"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25364,
                            "rooms_fullname": "Henry Angus"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25364,
                            "rooms_fullname": "Henry Angus"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25364,
                            "rooms_fullname": "Henry Angus"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25364,
                            "rooms_fullname": "Henry Angus"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25364,
                            "rooms_fullname": "Henry Angus"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24807,
                            "rooms_fullname": "Hugh Dempster Pavilion"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24807,
                            "rooms_fullname": "Hugh Dempster Pavilion"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24807,
                            "rooms_fullname": "Hugh Dempster Pavilion"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.2521,
                            "rooms_fullname": "Irving K Barber Learning Centre"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25533,
                            "rooms_fullname": "Leonard S. Klinck (also known as CSCI)"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25533,
                            "rooms_fullname": "Leonard S. Klinck (also known as CSCI)"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24494,
                            "rooms_fullname": "Life Sciences Centre"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24494,
                            "rooms_fullname": "Life Sciences Centre"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24494,
                            "rooms_fullname": "Life Sciences Centre"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24935,
                            "rooms_fullname": "MacLeod"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24935,
                            "rooms_fullname": "MacLeod"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25027,
                            "rooms_fullname": "MacMillan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25027,
                            "rooms_fullname": "MacMillan"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.255534,
                            "rooms_fullname": "Mathematics"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.254816,
                            "rooms_fullname": "Mathematics Annex"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.2531,
                            "rooms_fullname": "Neville Scarfe"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24342,
                            "rooms_fullname": "Pharmaceutical Sciences Building"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24342,
                            "rooms_fullname": "Pharmaceutical Sciences Building"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24937,
                            "rooms_fullname": "Wesbrook"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24937,
                            "rooms_fullname": "Wesbrook"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25431,
                            "rooms_fullname": "West Mall Swing Space"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25431,
                            "rooms_fullname": "West Mall Swing Space"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25431,
                            "rooms_fullname": "West Mall Swing Space"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.25431,
                            "rooms_fullname": "West Mall Swing Space"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24673,
                            "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24673,
                            "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24673,
                            "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24673,
                            "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24673,
                            "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)"
                        },
                        {
                            "rooms_type": "Tiered Large Group",
                            "rooms_lon": -123.24673,
                            "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)"
                        }
                    ]
                });
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("ROOMS query with one AND combined with AND IS ", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "NOT": {
                                "IS": {
                                    "rooms_number": "310"
                                }
                            }
                        },
                        {
                            "GT": {
                                "rooms_lon": 0
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_number",
                        "rooms_shortname"
                    ],
                    "ORDER":"rooms_shortname",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {
                    "render": "TABLE",
                    "result": []
                });
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("ROOMS query with one IS room number = 1", function () {
        let query: any =
            {
                "WHERE":{
                    "IS":{
                        "rooms_number": "1"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_shortname",
                        "rooms_fullname"
                    ],
                    "ORDER":"rooms_shortname",
                    "FORM":"TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"rooms_shortname":"WOOD","rooms_fullname":"Woodward (Instructional Resources Centre-IRC)"}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });



});
