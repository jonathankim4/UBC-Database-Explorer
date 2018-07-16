/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";

var chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);


describe("EchoSpec", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Should be able to echo", function () {
        let out = Server.performEcho('echo');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: 'echo...echo'});
    });

    it("Should be able to echo silence", function () {
        let out = Server.performEcho('');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: '...'});
    });

    it("Should be able to handle a missing echo message sensibly", function () {
        let out = Server.performEcho(undefined);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    it("Should be able to handle a null echo message sensibly", function () {
        let out = Server.performEcho(null);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.have.property('error');
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });



    it("GET test", function(){
        let s = new Server(4321);
        s.start();
        return chai.request("http://localhost:4321/")
            .get("/echo/hey")
            .then(function(res: any){
                console.log(res.body)
               s.stop()
            });
    })


    it("PUT description", function () {
        let fs = require("fs");

        return chai.request("http://localhost:4321")
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("rooms.zip"))
            .then(function (res: InsightResponse) {
                Log.trace('then:');
                console.log("asdfsad")
                console.log(res)
            })
            .catch(function (err:any) {
                Log.trace('catch:');
                // some assertions
            })
    });

    it("DEL description", function () {
        let fs = require("fs");

        return chai.request("http://localhost:4321")
            .del('/dataset/rooms')
            .then(function (res: InsightResponse) {
                Log.trace('then:');
                console.log(res)
                console.log("asdfsad")
                expect.fail();
            })
            .catch(function (err:any) {
                Log.trace('catch:');
                // some assertions
            })
    });

    it("POST description", function () {
        let fs = require("fs");
        return chai.request("http://localhost:4321")
            .post('/query')
            .attach("body", fs.readFileSync("rooms.zip"))
            .then(function (res: InsightResponse) {
                Log.trace('then:');
                expect.fail();
                console.log(res)
            })
            .catch(function (err:any) {
                Log.trace('catch:');
            })
    });




});
