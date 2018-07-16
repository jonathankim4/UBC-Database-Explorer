/**
 * Created by jonat on 3/2/2017.
 */



import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, IInsightFacade} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import {QueryRequest} from "../src/controller/IInsightFacade";
import {error} from "util";
var fs = require("fs");


describe("QueryAggregation", function () {

    var insightFacade: InsightFacade = null;

    // make sure all unit tests are independent on each other
    beforeEach(function () {
        insightFacade = new InsightFacade();
    });
    afterEach(function () {
        insightFacade = null;
    });

    it("Barrack Obama: Test MIN/AVG APPLY function in conjection with AVG function", function () {
        let query: QueryRequest =
            {
                "WHERE": {
                    "AND": [
                        {
                            "IS": {
                                "rooms_furniture": "*Tables*"
                            }
                        },
                        {
                            "GT": {
                                "rooms_seats": 68
                            }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortnams",
                        "avgSeats",
                        "maxSeats"
                    ],
                    "ORDER": "rooms_shortnams",
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": [
                        "rooms_shortname"
                    ],
                    "APPLY": [
                        {
                            "avgSeats": {
                                "MIN": "rooms_seats"
                            }
                        },
                        {
                            "maxSeats": {
                                "AVG": "rooms_seats"
                            }
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail()
        }).catch(function (err) {
            expect(err.code).to.equal(400);
            console.log(err)
        })
    });

    it("Scorcher 3: Should be able to find all sections in a dept not taught by a specific person.", function () {
        let query: QueryRequest =
            {
                "WHERE":{
                    "AND":[
                        {
                            "NO": {
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
            expect.fail()
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Salty AF: D2 MISSED INVALID MAYBE: Invalid query with O isnt of OR returns 400", function () {
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
                            "O":[
                                {
                                    "GT":{
                                        "courses_avg": 95
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
            expect.fail()
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Sodium: Invalid query with GROUP key matching COLUMN but not a KEY returns 400", function () {
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
                            "O":[
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
            expect.fail()
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Sky: Invalid query with GROUP not matching returns 400", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg":82
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_id",
                    "courses_audit",
                    "skurr"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_id", "courses_audit"],
                "APPLY": []
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail()
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Silver: Invalid query with GROUP key matching COLUMN but not a KEY returns 400", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg":82
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_id",
                    "courses_audit",
                    "maxSeats"
                ],
                "ORDER": "skurr",
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_id", "courses_audit"],
                "APPLY": [{
                    "skurr": {
                        "SUM": "courses_avg"
                    }
                },
                    {
                        "maxSeats": {
                            "COUNT": "courses_audit"
                        }
                    }]
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail()
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });



    it("Enter the 36 chambers: Group with 3 keys should work fine", function (done) {
        var test = new InsightFacade();
        let simpleQuery: QueryRequest = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "rooms_furniture": "*T*"
                        }
                    },
                    {
                        "GT": {
                            "rooms_seats": 20
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_shortname",
                    "rooms_furniture"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_name"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture", "rooms_shortname", "rooms_name"],
                "APPLY": []
            }
        }
        let expected = {"render":"TABLE","result":[{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"WOOD","rooms_name":"WOOD_G41"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"WOOD","rooms_name":"WOOD_B79"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"WOOD","rooms_name":"WOOD_B75"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"WOOD","rooms_name":"WOOD_6"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"WOOD","rooms_name":"WOOD_5"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"WOOD","rooms_name":"WOOD_4"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"WOOD","rooms_name":"WOOD_3"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"WOOD","rooms_name":"WOOD_2"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"WOOD","rooms_name":"WOOD_1"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"WESB","rooms_name":"WESB_201"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"WESB","rooms_name":"WESB_100"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"UCLL","rooms_name":"UCLL_107"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"UCLL","rooms_name":"UCLL_103"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"UCLL","rooms_name":"UCLL_101"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_410"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_409"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_408"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_407"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_406"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_405"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_310"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_309"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_308"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_307"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_306"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_305"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_222"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_221"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_122"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_121"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_110"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_109"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_108"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_107"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_106"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SWNG","rooms_name":"SWNG_105"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SRC","rooms_name":"SRC_220C"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SRC","rooms_name":"SRC_220B"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SRC","rooms_name":"SRC_220A"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"SPPH","rooms_name":"SPPH_B151"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"SPPH","rooms_name":"SPPH_B108"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"SPPH","rooms_name":"SPPH_143"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"SOWK","rooms_name":"SOWK_224"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"SOWK","rooms_name":"SOWK_223"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"SOWK","rooms_name":"SOWK_222"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"SOWK","rooms_name":"SOWK_124"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_210"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_209"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_208"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_207"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_206"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_205"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_204A"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_204"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_203"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_202"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_201"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_200"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_1328"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_1020"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_1005"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_1004"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"SCRF","rooms_name":"SCRF_1003"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"SCRF","rooms_name":"SCRF_100"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"PHRM","rooms_name":"PHRM_3208"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"PHRM","rooms_name":"PHRM_1201"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"PHRM","rooms_name":"PHRM_1101"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"PCOH","rooms_name":"PCOH_1302"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"PCOH","rooms_name":"PCOH_1215"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"PCOH","rooms_name":"PCOH_1011"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"PCOH","rooms_name":"PCOH_1009"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"PCOH","rooms_name":"PCOH_1008"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"PCOH","rooms_name":"PCOH_1003"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"PCOH","rooms_name":"PCOH_1002"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"PCOH","rooms_name":"PCOH_1001"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"OSBO","rooms_name":"OSBO_A"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"OSBO","rooms_name":"OSBO_203B"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"OSBO","rooms_name":"OSBO_203A"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ORCH","rooms_name":"ORCH_4058"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ORCH","rooms_name":"ORCH_4016"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ORCH","rooms_name":"ORCH_4004"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ORCH","rooms_name":"ORCH_4002"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ORCH","rooms_name":"ORCH_3074"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ORCH","rooms_name":"ORCH_3058"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ORCH","rooms_name":"ORCH_3016"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ORCH","rooms_name":"ORCH_3002"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"MGYM","rooms_name":"MGYM_208"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"MGYM","rooms_name":"MGYM_206"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MCML","rooms_name":"MCML_358"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MCML","rooms_name":"MCML_260"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MCML","rooms_name":"MCML_256"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"MCML","rooms_name":"MCML_166"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"MCML","rooms_name":"MCML_160"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"MCML","rooms_name":"MCML_158"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MCML","rooms_name":"MCML_154"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MCLD","rooms_name":"MCLD_254"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MCLD","rooms_name":"MCLD_242"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"MCLD","rooms_name":"MCLD_228"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MCLD","rooms_name":"MCLD_220"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MCLD","rooms_name":"MCLD_214"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"MCLD","rooms_name":"MCLD_202"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"MATX","rooms_name":"MATX_1100"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"MATH","rooms_name":"MATH_225"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"MATH","rooms_name":"MATH_204"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MATH","rooms_name":"MATH_203"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"MATH","rooms_name":"MATH_202"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"MATH","rooms_name":"MATH_105"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MATH","rooms_name":"MATH_104"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"MATH","rooms_name":"MATH_102"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"MATH","rooms_name":"MATH_100"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"LSK","rooms_name":"LSK_462"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"LSK","rooms_name":"LSK_460"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"LSK","rooms_name":"LSK_201"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"LSK","rooms_name":"LSK_200"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"LSC","rooms_name":"LSC_1003"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"LSC","rooms_name":"LSC_1002"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"LSC","rooms_name":"LSC_1001"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"LASR","rooms_name":"LASR_107"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"LASR","rooms_name":"LASR_105"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"LASR","rooms_name":"LASR_104"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"LASR","rooms_name":"LASR_102"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"IONA","rooms_name":"IONA_633"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"IONA","rooms_name":"IONA_301"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"IBLC","rooms_name":"IBLC_461"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"IBLC","rooms_name":"IBLC_261"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"IBLC","rooms_name":"IBLC_191"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"IBLC","rooms_name":"IBLC_185"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"IBLC","rooms_name":"IBLC_182"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"IBLC","rooms_name":"IBLC_158"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"IBLC","rooms_name":"IBLC_157"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"IBLC","rooms_name":"IBLC_156"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"IBLC","rooms_name":"IBLC_155"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"HENN","rooms_name":"HENN_304"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"HENN","rooms_name":"HENN_302"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"HENN","rooms_name":"HENN_301"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"HENN","rooms_name":"HENN_202"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"HENN","rooms_name":"HENN_201"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"HENN","rooms_name":"HENN_200"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"HEBB","rooms_name":"HEBB_13"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"HEBB","rooms_name":"HEBB_12"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"HEBB","rooms_name":"HEBB_100"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"HEBB","rooms_name":"HEBB_10"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"GEOG","rooms_name":"GEOG_242"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"GEOG","rooms_name":"GEOG_214"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"GEOG","rooms_name":"GEOG_212"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"GEOG","rooms_name":"GEOG_201"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"GEOG","rooms_name":"GEOG_200"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"GEOG","rooms_name":"GEOG_147"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"GEOG","rooms_name":"GEOG_101"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"GEOG","rooms_name":"GEOG_100"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"FSC","rooms_name":"FSC_1613"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"FSC","rooms_name":"FSC_1611"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"FSC","rooms_name":"FSC_1221"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"FSC","rooms_name":"FSC_1005"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"FSC","rooms_name":"FSC_1003"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"FSC","rooms_name":"FSC_1002"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"FSC","rooms_name":"FSC_1001"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"FRDM","rooms_name":"FRDM_153"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"FORW","rooms_name":"FORW_519"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"FORW","rooms_name":"FORW_317"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"FORW","rooms_name":"FORW_303"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"FNH","rooms_name":"FNH_60"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"FNH","rooms_name":"FNH_50"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"FNH","rooms_name":"FNH_40"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"FNH","rooms_name":"FNH_320"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"FNH","rooms_name":"FNH_30"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ESB","rooms_name":"ESB_2012"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"ESB","rooms_name":"ESB_1013"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"EOSM","rooms_name":"EOSM_135"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"DMP","rooms_name":"DMP_310"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"DMP","rooms_name":"DMP_301"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"DMP","rooms_name":"DMP_201"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"DMP","rooms_name":"DMP_110"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"DMP","rooms_name":"DMP_101"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"CIRS","rooms_name":"CIRS_1250"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"CHEM","rooms_name":"CHEM_D300"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"CHEM","rooms_name":"CHEM_D200"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"CHEM","rooms_name":"CHEM_C126"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"CHEM","rooms_name":"CHEM_C124"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"CHEM","rooms_name":"CHEM_B250"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"CHEM","rooms_name":"CHEM_B150"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"CHBE","rooms_name":"CHBE_103"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"CHBE","rooms_name":"CHBE_102"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"CHBE","rooms_name":"CHBE_101"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"CEME","rooms_name":"CEME_1215"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"CEME","rooms_name":"CEME_1212"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"CEME","rooms_name":"CEME_1210"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"CEME","rooms_name":"CEME_1206"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"CEME","rooms_name":"CEME_1204"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"CEME","rooms_name":"CEME_1202"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D325"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D323"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D322"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D319"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D317"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D316"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D315"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D314"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D313"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D312"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D307"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D306"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D304"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D301"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D229"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D228"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D222"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D221"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D219"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D218"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D217"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D216"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D214"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_D213"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D209"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D207"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D205"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D204"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_D201"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B319"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B318"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B316"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B315"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B313"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B310"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B309"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B308"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B307"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B306"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B304"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B303"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B302"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B219"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B218"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B216"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B215"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B213"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B211"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B210"},{"rooms_furniture":"Classroom-Movable Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_B209"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B208"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B142"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_B141"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_A203"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","rooms_shortname":"BUCH","rooms_name":"BUCH_A202"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_A201"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_A104"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_A103"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_A102"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"BUCH","rooms_name":"BUCH_A101"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"BRKX","rooms_name":"BRKX_2367"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"BRKX","rooms_name":"BRKX_2365"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"BIOL","rooms_name":"BIOL_2200"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"BIOL","rooms_name":"BIOL_2000"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"AUDX","rooms_name":"AUDX_157"},{"rooms_furniture":"Classroom-Moveable Tablets","rooms_shortname":"ANSO","rooms_name":"ANSO_207"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"ANSO","rooms_name":"ANSO_205"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","rooms_shortname":"ANSO","rooms_name":"ANSO_203"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ANSO","rooms_name":"ANSO_202"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_437"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_435"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_434"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_354"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_350"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_347"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_345"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_343"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_335"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_334"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_296"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_295"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_293"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_292"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_291"},{"rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_254"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_243"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_241"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_237"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_235"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_234"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_098"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_039"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ANGU","rooms_name":"ANGU_037"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ALRD","rooms_name":"ALRD_B101"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ALRD","rooms_name":"ALRD_121"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_shortname":"ALRD","rooms_name":"ALRD_105"},{"rooms_furniture":"Classroom-Fixed Tablets","rooms_shortname":"AERL","rooms_name":"AERL_120"}]}
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


    it("SteamedHam: Should be able to query with more than one APPLY key.", function () {
        let query: any =
            {
                "WHERE": {
                    "AND": [
                        {
                            "IS": {
                                "rooms_type": "*T*"
                            }
                        },
                        {
                            "GT": {
                                "rooms_seats": 20
                            }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_type",
                        "rooms_number",
                        "avgSeats",
                        "maxSeats"
                    ],
                    "ORDER": "rooms_number",
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_type", "rooms_number"],
                    "APPLY": [
                        {
                            "avgSeats": {
                                "AVG": "rooms_lat"
                            }
                        },
                        {
                            "maxSeats": {
                                "MIN": "rooms_lon"
                            }
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"rooms_type":"Tiered Large Group","rooms_number":"098","avgSeats":49.3,"maxSeats":-123.25364},{"rooms_type":"Tiered Large Group","rooms_number":"1","avgSeats":49.3,"maxSeats":-123.24673},{"rooms_type":"Tiered Large Group","rooms_number":"100","avgSeats":49.3,"maxSeats":-123.25623},{"rooms_type":"Tiered Large Group","rooms_number":"1001","avgSeats":49.3,"maxSeats":-123.24494},{"rooms_type":"Tiered Large Group","rooms_number":"1002","avgSeats":49.3,"maxSeats":-123.24494},{"rooms_type":"Tiered Large Group","rooms_number":"1003","avgSeats":49.3,"maxSeats":-123.24494},{"rooms_type":"Tiered Large Group","rooms_number":"1005","avgSeats":49.3,"maxSeats":-123.24886},{"rooms_type":"Tiered Large Group","rooms_number":"101","avgSeats":49.3,"maxSeats":-123.24718},{"rooms_type":"Tiered Large Group","rooms_number":"1012","avgSeats":49.3,"maxSeats":-123.25224},{"rooms_type":"Tiered Large Group","rooms_number":"1013","avgSeats":49.3,"maxSeats":-123.25224},{"rooms_type":"Tiered Large Group","rooms_number":"102","avgSeats":49.3,"maxSeats":-123.25583},{"rooms_type":"Tiered Large Group","rooms_number":"104","avgSeats":49.3,"maxSeats":-123.25583},{"rooms_type":"Tiered Large Group","rooms_number":"110","avgSeats":49.3,"maxSeats":-123.24807},{"rooms_type":"Tiered Large Group","rooms_number":"1100","avgSeats":49.3,"maxSeats":-123.254816},{"rooms_type":"Tiered Large Group","rooms_number":"1101","avgSeats":49.3,"maxSeats":-123.24342},{"rooms_type":"Tiered Large Group","rooms_number":"120","avgSeats":49.3,"maxSeats":-123.25099},{"rooms_type":"Tiered Large Group","rooms_number":"1201","avgSeats":49.3,"maxSeats":-123.24342},{"rooms_type":"Tiered Large Group","rooms_number":"1202","avgSeats":49.3,"maxSeats":-123.24894},{"rooms_type":"Tiered Large Group","rooms_number":"121","avgSeats":49.3,"maxSeats":-123.25431},{"rooms_type":"Tiered Large Group","rooms_number":"122","avgSeats":49.3,"maxSeats":-123.25431},{"rooms_type":"Tiered Large Group","rooms_number":"1221","avgSeats":49.3,"maxSeats":-123.24886},{"rooms_type":"Tiered Large Group","rooms_number":"1250","avgSeats":49.3,"maxSeats":-123.25314},{"rooms_type":"Tiered Large Group","rooms_number":"153","avgSeats":49.3,"maxSeats":-123.24608},{"rooms_type":"Tiered Large Group","rooms_number":"158","avgSeats":49.3,"maxSeats":-123.25027},{"rooms_type":"Tiered Large Group","rooms_number":"166","avgSeats":49.3,"maxSeats":-123.25027},{"rooms_type":"Tiered Large Group","rooms_number":"182","avgSeats":49.3,"maxSeats":-123.2521},{"rooms_type":"Tiered Large Group","rooms_number":"2","avgSeats":49.3,"maxSeats":-123.24673},{"rooms_type":"Tiered Large Group","rooms_number":"200","avgSeats":49.3,"maxSeats":-123.25533},{"rooms_type":"Tiered Large Group","rooms_number":"2000","avgSeats":49.3,"maxSeats":-123.25249},{"rooms_type":"Tiered Large Group","rooms_number":"201","avgSeats":49.3,"maxSeats":-123.25533},{"rooms_type":"Tiered Large Group","rooms_number":"2012","avgSeats":49.3,"maxSeats":-123.25224},{"rooms_type":"Tiered Large Group","rooms_number":"202","avgSeats":49.3,"maxSeats":-123.25374},{"rooms_type":"Tiered Large Group","rooms_number":"2200","avgSeats":49.3,"maxSeats":-123.25249},{"rooms_type":"TBD","rooms_number":"220A","avgSeats":49.3,"maxSeats":-123.24894},{"rooms_type":"TBD","rooms_number":"220B","avgSeats":49.3,"maxSeats":-123.24894},{"rooms_type":"TBD","rooms_number":"220C","avgSeats":49.3,"maxSeats":-123.24894},{"rooms_type":"Tiered Large Group","rooms_number":"221","avgSeats":49.3,"maxSeats":-123.25431},{"rooms_type":"Tiered Large Group","rooms_number":"222","avgSeats":49.3,"maxSeats":-123.25431},{"rooms_type":"Tiered Large Group","rooms_number":"228","avgSeats":49.3,"maxSeats":-123.24935},{"rooms_type":"Tiered Large Group","rooms_number":"2365","avgSeats":49.3,"maxSeats":-123.25237},{"rooms_type":"Tiered Large Group","rooms_number":"241","avgSeats":49.3,"maxSeats":-123.25364},{"rooms_type":"Tiered Large Group","rooms_number":"243","avgSeats":49.3,"maxSeats":-123.25364},{"rooms_type":"TBD","rooms_number":"293","avgSeats":49.3,"maxSeats":-123.25364},{"rooms_type":"Tiered Large Group","rooms_number":"3","avgSeats":49.3,"maxSeats":-123.24673},{"rooms_type":"Tiered Large Group","rooms_number":"301","avgSeats":49.3,"maxSeats":-123.24807},{"rooms_type":"Tiered Large Group","rooms_number":"310","avgSeats":49.3,"maxSeats":-123.24807},{"rooms_type":"Tiered Large Group","rooms_number":"343","avgSeats":49.3,"maxSeats":-123.25364},{"rooms_type":"Tiered Large Group","rooms_number":"345","avgSeats":49.3,"maxSeats":-123.25364},{"rooms_type":"Tiered Large Group","rooms_number":"347","avgSeats":49.3,"maxSeats":-123.25364},{"rooms_type":"Tiered Large Group","rooms_number":"350","avgSeats":49.3,"maxSeats":-123.25364},{"rooms_type":"Tiered Large Group","rooms_number":"354","avgSeats":49.3,"maxSeats":-123.25364},{"rooms_type":"Tiered Large Group","rooms_number":"4","avgSeats":49.3,"maxSeats":-123.24673},{"rooms_type":"Tiered Large Group","rooms_number":"5","avgSeats":49.3,"maxSeats":-123.24673},{"rooms_type":"Tiered Large Group","rooms_number":"6","avgSeats":49.3,"maxSeats":-123.24673},{"rooms_type":"Tiered Large Group","rooms_number":"60","avgSeats":49.3,"maxSeats":-123.24959},{"rooms_type":"Tiered Large Group","rooms_number":"A101","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"A102","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"A103","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"A104","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"A201","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"B150","avgSeats":49.3,"maxSeats":-123.25308},{"rooms_type":"Tiered Large Group","rooms_number":"B250","avgSeats":49.3,"maxSeats":-123.25308},{"rooms_type":"Tiered Large Group","rooms_number":"B313","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"B315","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"C124","avgSeats":49.3,"maxSeats":-123.25308},{"rooms_type":"Tiered Large Group","rooms_number":"C126","avgSeats":49.3,"maxSeats":-123.25308},{"rooms_type":"Tiered Large Group","rooms_number":"D200","avgSeats":49.3,"maxSeats":-123.25308},{"rooms_type":"Tiered Large Group","rooms_number":"D217","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"D218","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"D219","avgSeats":49.3,"maxSeats":-123.25468},{"rooms_type":"Tiered Large Group","rooms_number":"D300","avgSeats":49.3,"maxSeats":-123.25308}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });



    it("The Chronic 2001:  Should be able to get all courses data", function () {
        let query: QueryRequest = {
            "WHERE":{},
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept"
                ],
                "ORDER":"courses_dept",
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept"],
                "APPLY": []
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"courses_dept":"aanb"},{"courses_dept":"adhe"},{"courses_dept":"anat"},{"courses_dept":"anth"},{"courses_dept":"apbi"},{"courses_dept":"appp"},{"courses_dept":"apsc"},{"courses_dept":"arbc"},{"courses_dept":"arch"},{"courses_dept":"arcl"},{"courses_dept":"arst"},{"courses_dept":"arth"},{"courses_dept":"asia"},{"courses_dept":"asic"},{"courses_dept":"astr"},{"courses_dept":"astu"},{"courses_dept":"atsc"},{"courses_dept":"audi"},{"courses_dept":"ba"},{"courses_dept":"baac"},{"courses_dept":"babs"},{"courses_dept":"baen"},{"courses_dept":"bafi"},{"courses_dept":"bahr"},{"courses_dept":"bait"},{"courses_dept":"bala"},{"courses_dept":"bama"},{"courses_dept":"bams"},{"courses_dept":"bapa"},{"courses_dept":"basc"},{"courses_dept":"basm"},{"courses_dept":"baul"},{"courses_dept":"bioc"},{"courses_dept":"biof"},{"courses_dept":"biol"},{"courses_dept":"bmeg"},{"courses_dept":"bota"},{"courses_dept":"busi"},{"courses_dept":"caps"},{"courses_dept":"ccst"},{"courses_dept":"ceen"},{"courses_dept":"cell"},{"courses_dept":"cens"},{"courses_dept":"chbe"},{"courses_dept":"chem"},{"courses_dept":"chil"},{"courses_dept":"chin"},{"courses_dept":"cics"},{"courses_dept":"civl"},{"courses_dept":"clch"},{"courses_dept":"clst"},{"courses_dept":"cnps"},{"courses_dept":"cnrs"},{"courses_dept":"cnto"},{"courses_dept":"coec"},{"courses_dept":"cogs"},{"courses_dept":"cohr"},{"courses_dept":"comm"},{"courses_dept":"cons"},{"courses_dept":"cpen"},{"courses_dept":"cpsc"},{"courses_dept":"crwr"},{"courses_dept":"dani"},{"courses_dept":"dent"},{"courses_dept":"dhyg"},{"courses_dept":"eced"},{"courses_dept":"econ"},{"courses_dept":"edcp"},{"courses_dept":"edst"},{"courses_dept":"educ"},{"courses_dept":"eece"},{"courses_dept":"elec"},{"courses_dept":"ends"},{"courses_dept":"engl"},{"courses_dept":"enph"},{"courses_dept":"envr"},{"courses_dept":"eosc"},{"courses_dept":"epse"},{"courses_dept":"etec"},{"courses_dept":"fhis"},{"courses_dept":"fipr"},{"courses_dept":"fish"},{"courses_dept":"fist"},{"courses_dept":"fmst"},{"courses_dept":"fnel"},{"courses_dept":"fnh"},{"courses_dept":"fnis"},{"courses_dept":"food"},{"courses_dept":"fopr"},{"courses_dept":"fre"},{"courses_dept":"fren"},{"courses_dept":"frst"},{"courses_dept":"gbpr"},{"courses_dept":"geob"},{"courses_dept":"geog"},{"courses_dept":"germ"},{"courses_dept":"gpp"},{"courses_dept":"grek"},{"courses_dept":"grsj"},{"courses_dept":"gsat"},{"courses_dept":"hebr"},{"courses_dept":"hgse"},{"courses_dept":"hinu"},{"courses_dept":"hist"},{"courses_dept":"hunu"},{"courses_dept":"iar"},{"courses_dept":"igen"},{"courses_dept":"info"},{"courses_dept":"isci"},{"courses_dept":"ital"},{"courses_dept":"itst"},{"courses_dept":"iwme"},{"courses_dept":"japn"},{"courses_dept":"jrnl"},{"courses_dept":"kin"},{"courses_dept":"korn"},{"courses_dept":"lais"},{"courses_dept":"larc"},{"courses_dept":"laso"},{"courses_dept":"last"},{"courses_dept":"latn"},{"courses_dept":"law"},{"courses_dept":"lfs"},{"courses_dept":"libe"},{"courses_dept":"libr"},{"courses_dept":"ling"},{"courses_dept":"lled"},{"courses_dept":"math"},{"courses_dept":"mdvl"},{"courses_dept":"mech"},{"courses_dept":"medg"},{"courses_dept":"medi"},{"courses_dept":"micb"},{"courses_dept":"midw"},{"courses_dept":"mine"},{"courses_dept":"mrne"},{"courses_dept":"mtrl"},{"courses_dept":"musc"},{"courses_dept":"name"},{"courses_dept":"nest"},{"courses_dept":"nrsc"},{"courses_dept":"nurs"},{"courses_dept":"obst"},{"courses_dept":"onco"},{"courses_dept":"path"},{"courses_dept":"pcth"},{"courses_dept":"pers"},{"courses_dept":"phar"},{"courses_dept":"phil"},{"courses_dept":"phrm"},{"courses_dept":"phth"},{"courses_dept":"phys"},{"courses_dept":"plan"},{"courses_dept":"poli"},{"courses_dept":"pols"},{"courses_dept":"port"},{"courses_dept":"psyc"},{"courses_dept":"punj"},{"courses_dept":"relg"},{"courses_dept":"rgla"},{"courses_dept":"rhsc"},{"courses_dept":"rmes"},{"courses_dept":"rmst"},{"courses_dept":"rsot"},{"courses_dept":"russ"},{"courses_dept":"sans"},{"courses_dept":"scan"},{"courses_dept":"scie"},{"courses_dept":"soci"},{"courses_dept":"soil"},{"courses_dept":"sowk"},{"courses_dept":"span"},{"courses_dept":"spha"},{"courses_dept":"spph"},{"courses_dept":"stat"},{"courses_dept":"sts"},{"courses_dept":"surg"},{"courses_dept":"swed"},{"courses_dept":"test"},{"courses_dept":"thtr"},{"courses_dept":"udes"},{"courses_dept":"ufor"},{"courses_dept":"urst"},{"courses_dept":"ursy"},{"courses_dept":"vant"},{"courses_dept":"visa"},{"courses_dept":"wood"},{"courses_dept":"wrds"},{"courses_dept":"zool"}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("Here we go again: change this test into something invalid keys", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_audit":15
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_audit"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["courses_"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_audit"],
                "APPLY": [{
                    "coursesroom": {
                        "COUNT": "courses_avg"
                    }
                }]
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail()
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });


    it("Chiefers: test out the functionality of DIRECTION in ORDER", function () {
        let query: QueryRequest = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*s*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 3
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_lon",
                    "maxSeats",
                    "rooms_href"

                ],
                "ORDER": "rooms_href",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_lon", "rooms_href"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_lon"
                    }
                }]
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"rooms_lon":-123.25099,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/AERL-120","maxSeats":-123.25099},{"rooms_lon":-123.25318,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-105","maxSeats":-123.25318},{"rooms_lon":-123.25318,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-112","maxSeats":-123.25318},{"rooms_lon":-123.25318,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-113","maxSeats":-123.25318},{"rooms_lon":-123.25318,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-121","maxSeats":-123.25318},{"rooms_lon":-123.25318,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-B101","maxSeats":-123.25318},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-037","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-039","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-098","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-232","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-234","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-235","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-237","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-241","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-243","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-254","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-291","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-292","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-293","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-295","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-296","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-332","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-334","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-335","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-339","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-343","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-345","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-347","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-350","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-354","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-432","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-434","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-435","maxSeats":-123.25364},{"rooms_lon":-123.25364,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-437","maxSeats":-123.25364},{"rooms_lon":-123.25741,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-202","maxSeats":-123.25741},{"rooms_lon":-123.25741,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-203","maxSeats":-123.25741},{"rooms_lon":-123.25741,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-205","maxSeats":-123.25741},{"rooms_lon":-123.25741,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-207","maxSeats":-123.25741},{"rooms_lon":-123.25655,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/AUDX-142","maxSeats":-123.25655},{"rooms_lon":-123.25655,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/AUDX-157","maxSeats":-123.25655},{"rooms_lon":-123.25249,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BIOL-1503","maxSeats":-123.25249},{"rooms_lon":-123.25249,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BIOL-2000","maxSeats":-123.25249},{"rooms_lon":-123.25249,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BIOL-2200","maxSeats":-123.25249},{"rooms_lon":-123.25249,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BIOL-2519","maxSeats":-123.25249},{"rooms_lon":-123.25237,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BRKX-2365","maxSeats":-123.25237},{"rooms_lon":-123.25237,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BRKX-2367","maxSeats":-123.25237},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A101","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A102","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A103","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A104","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A201","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A202","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A203","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B141","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B142","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B208","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B209","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B210","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B211","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B213","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B215","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B216","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B218","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B219","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B302","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B303","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B304","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B306","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B307","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B308","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B309","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B310","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B312","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B313","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B315","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B316","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B318","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B319","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D201","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D204","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D205","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D207","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D209","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D213","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D214","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D216","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D217","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D218","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D219","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D221","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D222","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D228","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D229","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D301","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D304","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D306","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D307","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D312","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D313","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D314","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D315","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D316","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D317","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D319","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D322","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D323","maxSeats":-123.25468},{"rooms_lon":-123.25468,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D325","maxSeats":-123.25468},{"rooms_lon":-123.24894,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1202","maxSeats":-123.24894},{"rooms_lon":-123.24894,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1204","maxSeats":-123.24894},{"rooms_lon":-123.24894,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1206","maxSeats":-123.24894},{"rooms_lon":-123.24894,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1210","maxSeats":-123.24894},{"rooms_lon":-123.24894,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1212","maxSeats":-123.24894},{"rooms_lon":-123.24894,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1215","maxSeats":-123.24894},{"rooms_lon":-123.24718,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHBE-101","maxSeats":-123.24718},{"rooms_lon":-123.24718,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHBE-102","maxSeats":-123.24718},{"rooms_lon":-123.24718,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHBE-103","maxSeats":-123.24718},{"rooms_lon":-123.25308,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-B150","maxSeats":-123.25308},{"rooms_lon":-123.25308,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-B250","maxSeats":-123.25308},{"rooms_lon":-123.25308,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-C124","maxSeats":-123.25308},{"rooms_lon":-123.25308,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-C126","maxSeats":-123.25308},{"rooms_lon":-123.25308,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-D200","maxSeats":-123.25308},{"rooms_lon":-123.25308,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-D300","maxSeats":-123.25308},{"rooms_lon":-123.25314,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CIRS-1250","maxSeats":-123.25314},{"rooms_lon":-123.24807,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-101","maxSeats":-123.24807},{"rooms_lon":-123.24807,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-110","maxSeats":-123.24807},{"rooms_lon":-123.24807,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201","maxSeats":-123.24807},{"rooms_lon":-123.24807,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-301","maxSeats":-123.24807},{"rooms_lon":-123.24807,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-310","maxSeats":-123.24807},{"rooms_lon":-123.25198,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/EOSM-135","maxSeats":-123.25198},{"rooms_lon":-123.25224,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ESB-1012","maxSeats":-123.25224},{"rooms_lon":-123.25224,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ESB-1013","maxSeats":-123.25224},{"rooms_lon":-123.25224,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ESB-2012","maxSeats":-123.25224},{"rooms_lon":-123.24959,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-20","maxSeats":-123.24959},{"rooms_lon":-123.24959,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-30","maxSeats":-123.24959},{"rooms_lon":-123.24959,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-320","maxSeats":-123.24959},{"rooms_lon":-123.24959,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-40","maxSeats":-123.24959},{"rooms_lon":-123.24959,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-50","maxSeats":-123.24959},{"rooms_lon":-123.24959,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-60","maxSeats":-123.24959},{"rooms_lon":-123.25179,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FORW-303","maxSeats":-123.25179},{"rooms_lon":-123.25179,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FORW-317","maxSeats":-123.25179},{"rooms_lon":-123.25179,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FORW-519","maxSeats":-123.25179},{"rooms_lon":-123.24608,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FRDM-153","maxSeats":-123.24608},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1001","maxSeats":-123.24886},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1002","maxSeats":-123.24886},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1003","maxSeats":-123.24886},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1005","maxSeats":-123.24886},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1221","maxSeats":-123.24886},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1402","maxSeats":-123.24886},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1611","maxSeats":-123.24886},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1613","maxSeats":-123.24886},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1615","maxSeats":-123.24886},{"rooms_lon":-123.24886,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1617","maxSeats":-123.24886},{"rooms_lon":-123.25623,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-100","maxSeats":-123.25623},{"rooms_lon":-123.25623,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-101","maxSeats":-123.25623},{"rooms_lon":-123.25623,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-147","maxSeats":-123.25623},{"rooms_lon":-123.25623,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-200","maxSeats":-123.25623},{"rooms_lon":-123.25623,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-201","maxSeats":-123.25623},{"rooms_lon":-123.25623,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-212","maxSeats":-123.25623},{"rooms_lon":-123.25623,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-214","maxSeats":-123.25623},{"rooms_lon":-123.25623,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-242","maxSeats":-123.25623},{"rooms_lon":-123.25165,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-10","maxSeats":-123.25165},{"rooms_lon":-123.25165,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-100","maxSeats":-123.25165},{"rooms_lon":-123.25165,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-12","maxSeats":-123.25165},{"rooms_lon":-123.25165,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-13","maxSeats":-123.25165},{"rooms_lon":-123.25374,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-200","maxSeats":-123.25374},{"rooms_lon":-123.25374,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-201","maxSeats":-123.25374},{"rooms_lon":-123.25374,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-202","maxSeats":-123.25374},{"rooms_lon":-123.25374,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-301","maxSeats":-123.25374},{"rooms_lon":-123.25374,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-302","maxSeats":-123.25374},{"rooms_lon":-123.25374,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-304","maxSeats":-123.25374},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-155","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-156","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-157","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-158","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-182","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-185","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-191","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-192","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-193","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-194","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-195","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-261","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-263","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-264","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-265","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-266","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-460","maxSeats":-123.2521},{"rooms_lon":-123.2521,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-461","maxSeats":-123.2521},{"rooms_lon":-123.25042,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IONA-301","maxSeats":-123.25042},{"rooms_lon":-123.25042,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IONA-633","maxSeats":-123.25042},{"rooms_lon":-123.25583,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-102","maxSeats":-123.25583},{"rooms_lon":-123.25583,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-104","maxSeats":-123.25583},{"rooms_lon":-123.25583,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-105","maxSeats":-123.25583},{"rooms_lon":-123.25583,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-107","maxSeats":-123.25583},{"rooms_lon":-123.25583,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-211","maxSeats":-123.25583},{"rooms_lon":-123.25583,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-5C","maxSeats":-123.25583},{"rooms_lon":-123.24494,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSC-1001","maxSeats":-123.24494},{"rooms_lon":-123.24494,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSC-1002","maxSeats":-123.24494},{"rooms_lon":-123.24494,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSC-1003","maxSeats":-123.24494},{"rooms_lon":-123.25533,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSK-200","maxSeats":-123.25533},{"rooms_lon":-123.25533,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSK-201","maxSeats":-123.25533},{"rooms_lon":-123.25533,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSK-460","maxSeats":-123.25533},{"rooms_lon":-123.25533,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSK-462","maxSeats":-123.25533},{"rooms_lon":-123.255534,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-100","maxSeats":-123.255534},{"rooms_lon":-123.255534,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-102","maxSeats":-123.255534},{"rooms_lon":-123.255534,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-104","maxSeats":-123.255534},{"rooms_lon":-123.255534,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-105","maxSeats":-123.255534},{"rooms_lon":-123.255534,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-202","maxSeats":-123.255534},{"rooms_lon":-123.255534,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-203","maxSeats":-123.255534},{"rooms_lon":-123.255534,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-204","maxSeats":-123.255534},{"rooms_lon":-123.255534,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-225","maxSeats":-123.255534},{"rooms_lon":-123.254816,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATX-1100","maxSeats":-123.254816},{"rooms_lon":-123.24935,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-202","maxSeats":-123.24935},{"rooms_lon":-123.24935,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-214","maxSeats":-123.24935},{"rooms_lon":-123.24935,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-220","maxSeats":-123.24935},{"rooms_lon":-123.24935,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-228","maxSeats":-123.24935},{"rooms_lon":-123.24935,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-242","maxSeats":-123.24935},{"rooms_lon":-123.24935,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-254","maxSeats":-123.24935},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-154","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-158","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-160","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-166","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-256","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-260","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-358","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360A","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360B","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360C","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360D","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360E","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360F","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360G","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360H","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360J","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360K","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360L","maxSeats":-123.25027},{"rooms_lon":-123.25027,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360M","maxSeats":-123.25027},{"rooms_lon":-123.2466,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MGYM-206","maxSeats":-123.2466},{"rooms_lon":-123.2466,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MGYM-208","maxSeats":-123.2466},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-1001","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3002","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3004","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3016","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3018","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3052","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3058","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3062","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3068","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3072","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3074","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4002","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4004","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4016","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4018","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4052","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4058","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4062","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4068","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4072","maxSeats":-123.24944},{"rooms_lon":-123.24944,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4074","maxSeats":-123.24944},{"rooms_lon":-123.24467,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/OSBO-203A","maxSeats":-123.24467},{"rooms_lon":-123.24467,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/OSBO-203B","maxSeats":-123.24467},{"rooms_lon":-123.24467,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/OSBO-A","maxSeats":-123.24467},{"rooms_lon":-123.2559,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1001","maxSeats":-123.2559},{"rooms_lon":-123.2559,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1002","maxSeats":-123.2559},{"rooms_lon":-123.2559,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1003","maxSeats":-123.2559},{"rooms_lon":-123.2559,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1008","maxSeats":-123.2559},{"rooms_lon":-123.2559,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1009","maxSeats":-123.2559},{"rooms_lon":-123.2559,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1011","maxSeats":-123.2559},{"rooms_lon":-123.2559,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1215","maxSeats":-123.2559},{"rooms_lon":-123.2559,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1302","maxSeats":-123.2559},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-1101","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-1201","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3112","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3114","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3115","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3116","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3118","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3120","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3122","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3124","maxSeats":-123.24342},{"rooms_lon":-123.24342,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3208","maxSeats":-123.24342},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-100","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1003","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1004","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1005","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1020","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1021","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1022","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1023","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1024","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1328","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-200","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-201","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-202","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-203","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-204","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-204A","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-205","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-206","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-207","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-208","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-209","maxSeats":-123.2531},{"rooms_lon":-123.2531,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-210","maxSeats":-123.2531},{"rooms_lon":-123.25505,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-122","maxSeats":-123.25505},{"rooms_lon":-123.25505,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-124","maxSeats":-123.25505},{"rooms_lon":-123.25505,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-222","maxSeats":-123.25505},{"rooms_lon":-123.25505,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-223","maxSeats":-123.25505},{"rooms_lon":-123.25505,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-224","maxSeats":-123.25505},{"rooms_lon":-123.25505,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-324","maxSeats":-123.25505},{"rooms_lon":-123.25505,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-326","maxSeats":-123.25505},{"rooms_lon":-123.24842,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-143","maxSeats":-123.24842},{"rooms_lon":-123.24842,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B108","maxSeats":-123.24842},{"rooms_lon":-123.24842,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B112","maxSeats":-123.24842},{"rooms_lon":-123.24842,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B136","maxSeats":-123.24842},{"rooms_lon":-123.24842,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B138","maxSeats":-123.24842},{"rooms_lon":-123.24842,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B151","maxSeats":-123.24842},{"rooms_lon":-123.24894,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SRC-220A","maxSeats":-123.24894},{"rooms_lon":-123.24894,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SRC-220B","maxSeats":-123.24894},{"rooms_lon":-123.24894,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SRC-220C","maxSeats":-123.24894},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-105","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-106","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-107","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-108","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-109","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-110","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-121","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-122","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-221","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-222","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-305","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-306","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-307","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-308","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-309","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-310","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-405","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-406","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-407","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-408","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-409","maxSeats":-123.25431},{"rooms_lon":-123.25431,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-410","maxSeats":-123.25431},{"rooms_lon":-123.25692,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/UCLL-101","maxSeats":-123.25692},{"rooms_lon":-123.25692,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/UCLL-103","maxSeats":-123.25692},{"rooms_lon":-123.25692,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/UCLL-107","maxSeats":-123.25692},{"rooms_lon":-123.25692,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/UCLL-109","maxSeats":-123.25692},{"rooms_lon":-123.24937,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WESB-100","maxSeats":-123.24937},{"rooms_lon":-123.24937,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WESB-201","maxSeats":-123.24937},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-1","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-2","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-3","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-4","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-5","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-6","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-B75","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-B79","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G41","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G44","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G53","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G55","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G57","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G59","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G65","maxSeats":-123.24673},{"rooms_lon":-123.24673,"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G66","maxSeats":-123.24673}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("Flabbergasted: APPLY is present but has empty object", function () {
        let query: QueryRequest = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*s*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 3
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{}]
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("BootySweat: testing when WHERE is empty like {} with no order or nothin", function () {
        let query: QueryRequest =
            {
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_name",
                        "rooms_seats"
                    ],
                    "ORDER": "rooms_name",
                    "FORM": "TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"rooms_name":"AERL_120","rooms_seats":144},{"rooms_name":"ALRD_105","rooms_seats":94},{"rooms_name":"ALRD_112","rooms_seats":20},{"rooms_name":"ALRD_113","rooms_seats":20},{"rooms_name":"ALRD_121","rooms_seats":50},{"rooms_name":"ALRD_B101","rooms_seats":44},{"rooms_name":"ANGU_037","rooms_seats":54},{"rooms_name":"ANGU_039","rooms_seats":54},{"rooms_name":"ANGU_098","rooms_seats":260},{"rooms_name":"ANGU_232","rooms_seats":16},{"rooms_name":"ANGU_234","rooms_seats":60},{"rooms_name":"ANGU_235","rooms_seats":41},{"rooms_name":"ANGU_237","rooms_seats":41},{"rooms_name":"ANGU_241","rooms_seats":70},{"rooms_name":"ANGU_243","rooms_seats":68},{"rooms_name":"ANGU_254","rooms_seats":80},{"rooms_name":"ANGU_291","rooms_seats":54},{"rooms_name":"ANGU_292","rooms_seats":35},{"rooms_name":"ANGU_293","rooms_seats":32},{"rooms_name":"ANGU_295","rooms_seats":54},{"rooms_name":"ANGU_296","rooms_seats":37},{"rooms_name":"ANGU_332","rooms_seats":16},{"rooms_name":"ANGU_334","rooms_seats":60},{"rooms_name":"ANGU_335","rooms_seats":41},{"rooms_name":"ANGU_339","rooms_seats":20},{"rooms_name":"ANGU_343","rooms_seats":68},{"rooms_name":"ANGU_345","rooms_seats":68},{"rooms_name":"ANGU_347","rooms_seats":70},{"rooms_name":"ANGU_350","rooms_seats":58},{"rooms_name":"ANGU_354","rooms_seats":44},{"rooms_name":"ANGU_432","rooms_seats":16},{"rooms_name":"ANGU_434","rooms_seats":44},{"rooms_name":"ANGU_435","rooms_seats":53},{"rooms_name":"ANGU_437","rooms_seats":32},{"rooms_name":"ANSO_202","rooms_seats":26},{"rooms_name":"ANSO_203","rooms_seats":33},{"rooms_name":"ANSO_205","rooms_seats":37},{"rooms_name":"ANSO_207","rooms_seats":90},{"rooms_name":"AUDX_142","rooms_seats":20},{"rooms_name":"AUDX_157","rooms_seats":21},{"rooms_name":"BIOL_1503","rooms_seats":16},{"rooms_name":"BIOL_2000","rooms_seats":228},{"rooms_name":"BIOL_2200","rooms_seats":76},{"rooms_name":"BIOL_2519","rooms_seats":16},{"rooms_name":"BRKX_2365","rooms_seats":70},{"rooms_name":"BRKX_2367","rooms_seats":24},{"rooms_name":"BUCH_A101","rooms_seats":275},{"rooms_name":"BUCH_A102","rooms_seats":150},{"rooms_name":"BUCH_A103","rooms_seats":131},{"rooms_name":"BUCH_A104","rooms_seats":150},{"rooms_name":"BUCH_A201","rooms_seats":181},{"rooms_name":"BUCH_A202","rooms_seats":108},{"rooms_name":"BUCH_A203","rooms_seats":108},{"rooms_name":"BUCH_B141","rooms_seats":42},{"rooms_name":"BUCH_B142","rooms_seats":26},{"rooms_name":"BUCH_B208","rooms_seats":56},{"rooms_name":"BUCH_B209","rooms_seats":40},{"rooms_name":"BUCH_B210","rooms_seats":48},{"rooms_name":"BUCH_B211","rooms_seats":40},{"rooms_name":"BUCH_B213","rooms_seats":78},{"rooms_name":"BUCH_B215","rooms_seats":78},{"rooms_name":"BUCH_B216","rooms_seats":22},{"rooms_name":"BUCH_B218","rooms_seats":40},{"rooms_name":"BUCH_B219","rooms_seats":24},{"rooms_name":"BUCH_B302","rooms_seats":32},{"rooms_name":"BUCH_B303","rooms_seats":40},{"rooms_name":"BUCH_B304","rooms_seats":32},{"rooms_name":"BUCH_B306","rooms_seats":32},{"rooms_name":"BUCH_B307","rooms_seats":32},{"rooms_name":"BUCH_B308","rooms_seats":32},{"rooms_name":"BUCH_B309","rooms_seats":40},{"rooms_name":"BUCH_B310","rooms_seats":32},{"rooms_name":"BUCH_B312","rooms_seats":18},{"rooms_name":"BUCH_B313","rooms_seats":78},{"rooms_name":"BUCH_B315","rooms_seats":78},{"rooms_name":"BUCH_B316","rooms_seats":22},{"rooms_name":"BUCH_B318","rooms_seats":40},{"rooms_name":"BUCH_B319","rooms_seats":24},{"rooms_name":"BUCH_D201","rooms_seats":40},{"rooms_name":"BUCH_D204","rooms_seats":40},{"rooms_name":"BUCH_D205","rooms_seats":30},{"rooms_name":"BUCH_D207","rooms_seats":30},{"rooms_name":"BUCH_D209","rooms_seats":22},{"rooms_name":"BUCH_D213","rooms_seats":30},{"rooms_name":"BUCH_D214","rooms_seats":22},{"rooms_name":"BUCH_D216","rooms_seats":24},{"rooms_name":"BUCH_D217","rooms_seats":65},{"rooms_name":"BUCH_D218","rooms_seats":65},{"rooms_name":"BUCH_D219","rooms_seats":65},{"rooms_name":"BUCH_D221","rooms_seats":30},{"rooms_name":"BUCH_D222","rooms_seats":65},{"rooms_name":"BUCH_D228","rooms_seats":24},{"rooms_name":"BUCH_D229","rooms_seats":30},{"rooms_name":"BUCH_D301","rooms_seats":40},{"rooms_name":"BUCH_D304","rooms_seats":30},{"rooms_name":"BUCH_D306","rooms_seats":22},{"rooms_name":"BUCH_D307","rooms_seats":30},{"rooms_name":"BUCH_D312","rooms_seats":40},{"rooms_name":"BUCH_D313","rooms_seats":30},{"rooms_name":"BUCH_D314","rooms_seats":40},{"rooms_name":"BUCH_D315","rooms_seats":22},{"rooms_name":"BUCH_D316","rooms_seats":50},{"rooms_name":"BUCH_D317","rooms_seats":50},{"rooms_name":"BUCH_D319","rooms_seats":22},{"rooms_name":"BUCH_D322","rooms_seats":50},{"rooms_name":"BUCH_D323","rooms_seats":31},{"rooms_name":"BUCH_D325","rooms_seats":22},{"rooms_name":"CEME_1202","rooms_seats":100},{"rooms_name":"CEME_1204","rooms_seats":62},{"rooms_name":"CEME_1206","rooms_seats":26},{"rooms_name":"CEME_1210","rooms_seats":22},{"rooms_name":"CEME_1212","rooms_seats":34},{"rooms_name":"CEME_1215","rooms_seats":45},{"rooms_name":"CHBE_101","rooms_seats":200},{"rooms_name":"CHBE_102","rooms_seats":94},{"rooms_name":"CHBE_103","rooms_seats":60},{"rooms_name":"CHEM_B150","rooms_seats":265},{"rooms_name":"CHEM_B250","rooms_seats":240},{"rooms_name":"CHEM_C124","rooms_seats":90},{"rooms_name":"CHEM_C126","rooms_seats":90},{"rooms_name":"CHEM_D200","rooms_seats":114},{"rooms_name":"CHEM_D300","rooms_seats":114},{"rooms_name":"CIRS_1250","rooms_seats":426},{"rooms_name":"DMP_101","rooms_seats":40},{"rooms_name":"DMP_110","rooms_seats":120},{"rooms_name":"DMP_201","rooms_seats":40},{"rooms_name":"DMP_301","rooms_seats":80},{"rooms_name":"DMP_310","rooms_seats":160},{"rooms_name":"EOSM_135","rooms_seats":50},{"rooms_name":"ESB_1012","rooms_seats":150},{"rooms_name":"ESB_1013","rooms_seats":350},{"rooms_name":"ESB_2012","rooms_seats":80},{"rooms_name":"FNH_20","rooms_seats":12},{"rooms_name":"FNH_30","rooms_seats":28},{"rooms_name":"FNH_320","rooms_seats":27},{"rooms_name":"FNH_40","rooms_seats":54},{"rooms_name":"FNH_50","rooms_seats":43},{"rooms_name":"FNH_60","rooms_seats":99},{"rooms_name":"FORW_303","rooms_seats":63},{"rooms_name":"FORW_317","rooms_seats":44},{"rooms_name":"FORW_519","rooms_seats":35},{"rooms_name":"FRDM_153","rooms_seats":160},{"rooms_name":"FSC_1001","rooms_seats":65},{"rooms_name":"FSC_1002","rooms_seats":24},{"rooms_name":"FSC_1003","rooms_seats":65},{"rooms_name":"FSC_1005","rooms_seats":250},{"rooms_name":"FSC_1221","rooms_seats":99},{"rooms_name":"FSC_1402","rooms_seats":18},{"rooms_name":"FSC_1611","rooms_seats":24},{"rooms_name":"FSC_1613","rooms_seats":36},{"rooms_name":"FSC_1615","rooms_seats":20},{"rooms_name":"FSC_1617","rooms_seats":20},{"rooms_name":"GEOG_100","rooms_seats":225},{"rooms_name":"GEOG_101","rooms_seats":60},{"rooms_name":"GEOG_147","rooms_seats":60},{"rooms_name":"GEOG_200","rooms_seats":100},{"rooms_name":"GEOG_201","rooms_seats":42},{"rooms_name":"GEOG_212","rooms_seats":72},{"rooms_name":"GEOG_214","rooms_seats":39},{"rooms_name":"GEOG_242","rooms_seats":21},{"rooms_name":"HEBB_10","rooms_seats":54},{"rooms_name":"HEBB_100","rooms_seats":375},{"rooms_name":"HEBB_12","rooms_seats":54},{"rooms_name":"HEBB_13","rooms_seats":54},{"rooms_name":"HENN_200","rooms_seats":257},{"rooms_name":"HENN_201","rooms_seats":155},{"rooms_name":"HENN_202","rooms_seats":150},{"rooms_name":"HENN_301","rooms_seats":30},{"rooms_name":"HENN_302","rooms_seats":30},{"rooms_name":"HENN_304","rooms_seats":36},{"rooms_name":"IBLC_155","rooms_seats":50},{"rooms_name":"IBLC_156","rooms_seats":24},{"rooms_name":"IBLC_157","rooms_seats":24},{"rooms_name":"IBLC_158","rooms_seats":24},{"rooms_name":"IBLC_182","rooms_seats":154},{"rooms_name":"IBLC_185","rooms_seats":40},{"rooms_name":"IBLC_191","rooms_seats":24},{"rooms_name":"IBLC_192","rooms_seats":8},{"rooms_name":"IBLC_193","rooms_seats":8},{"rooms_name":"IBLC_194","rooms_seats":8},{"rooms_name":"IBLC_195","rooms_seats":8},{"rooms_name":"IBLC_261","rooms_seats":112},{"rooms_name":"IBLC_263","rooms_seats":8},{"rooms_name":"IBLC_264","rooms_seats":12},{"rooms_name":"IBLC_265","rooms_seats":10},{"rooms_name":"IBLC_266","rooms_seats":8},{"rooms_name":"IBLC_460","rooms_seats":16},{"rooms_name":"IBLC_461","rooms_seats":30},{"rooms_name":"IONA_301","rooms_seats":100},{"rooms_name":"IONA_633","rooms_seats":50},{"rooms_name":"LASR_102","rooms_seats":80},{"rooms_name":"LASR_104","rooms_seats":94},{"rooms_name":"LASR_105","rooms_seats":60},{"rooms_name":"LASR_107","rooms_seats":51},{"rooms_name":"LASR_211","rooms_seats":20},{"rooms_name":"LASR_5C","rooms_seats":20},{"rooms_name":"LSC_1001","rooms_seats":350},{"rooms_name":"LSC_1002","rooms_seats":350},{"rooms_name":"LSC_1003","rooms_seats":125},{"rooms_name":"LSK_200","rooms_seats":205},{"rooms_name":"LSK_201","rooms_seats":183},{"rooms_name":"LSK_460","rooms_seats":75},{"rooms_name":"LSK_462","rooms_seats":42},{"rooms_name":"MATH_100","rooms_seats":224},{"rooms_name":"MATH_102","rooms_seats":60},{"rooms_name":"MATH_104","rooms_seats":48},{"rooms_name":"MATH_105","rooms_seats":30},{"rooms_name":"MATH_202","rooms_seats":30},{"rooms_name":"MATH_203","rooms_seats":48},{"rooms_name":"MATH_204","rooms_seats":30},{"rooms_name":"MATH_225","rooms_seats":25},{"rooms_name":"MATX_1100","rooms_seats":106},{"rooms_name":"MCLD_202","rooms_seats":123},{"rooms_name":"MCLD_214","rooms_seats":60},{"rooms_name":"MCLD_220","rooms_seats":40},{"rooms_name":"MCLD_228","rooms_seats":136},{"rooms_name":"MCLD_242","rooms_seats":60},{"rooms_name":"MCLD_254","rooms_seats":84},{"rooms_name":"MCML_154","rooms_seats":47},{"rooms_name":"MCML_158","rooms_seats":74},{"rooms_name":"MCML_160","rooms_seats":72},{"rooms_name":"MCML_166","rooms_seats":200},{"rooms_name":"MCML_256","rooms_seats":32},{"rooms_name":"MCML_260","rooms_seats":32},{"rooms_name":"MCML_358","rooms_seats":24},{"rooms_name":"MCML_360A","rooms_seats":6},{"rooms_name":"MCML_360B","rooms_seats":6},{"rooms_name":"MCML_360C","rooms_seats":8},{"rooms_name":"MCML_360D","rooms_seats":8},{"rooms_name":"MCML_360E","rooms_seats":8},{"rooms_name":"MCML_360F","rooms_seats":8},{"rooms_name":"MCML_360G","rooms_seats":8},{"rooms_name":"MCML_360H","rooms_seats":8},{"rooms_name":"MCML_360J","rooms_seats":8},{"rooms_name":"MCML_360K","rooms_seats":8},{"rooms_name":"MCML_360L","rooms_seats":8},{"rooms_name":"MCML_360M","rooms_seats":8},{"rooms_name":"MGYM_206","rooms_seats":25},{"rooms_name":"MGYM_208","rooms_seats":40},{"rooms_name":"ORCH_1001","rooms_seats":72},{"rooms_name":"ORCH_3002","rooms_seats":25},{"rooms_name":"ORCH_3004","rooms_seats":25},{"rooms_name":"ORCH_3016","rooms_seats":25},{"rooms_name":"ORCH_3018","rooms_seats":48},{"rooms_name":"ORCH_3052","rooms_seats":25},{"rooms_name":"ORCH_3058","rooms_seats":25},{"rooms_name":"ORCH_3062","rooms_seats":16},{"rooms_name":"ORCH_3068","rooms_seats":16},{"rooms_name":"ORCH_3072","rooms_seats":16},{"rooms_name":"ORCH_3074","rooms_seats":72},{"rooms_name":"ORCH_4002","rooms_seats":25},{"rooms_name":"ORCH_4004","rooms_seats":25},{"rooms_name":"ORCH_4016","rooms_seats":25},{"rooms_name":"ORCH_4018","rooms_seats":48},{"rooms_name":"ORCH_4052","rooms_seats":25},{"rooms_name":"ORCH_4058","rooms_seats":25},{"rooms_name":"ORCH_4062","rooms_seats":16},{"rooms_name":"ORCH_4068","rooms_seats":16},{"rooms_name":"ORCH_4072","rooms_seats":20},{"rooms_name":"ORCH_4074","rooms_seats":72},{"rooms_name":"OSBO_203A","rooms_seats":40},{"rooms_name":"OSBO_203B","rooms_seats":39},{"rooms_name":"OSBO_A","rooms_seats":442},{"rooms_name":"PCOH_1001","rooms_seats":40},{"rooms_name":"PCOH_1002","rooms_seats":40},{"rooms_name":"PCOH_1003","rooms_seats":40},{"rooms_name":"PCOH_1008","rooms_seats":24},{"rooms_name":"PCOH_1009","rooms_seats":24},{"rooms_name":"PCOH_1011","rooms_seats":24},{"rooms_name":"PCOH_1215","rooms_seats":24},{"rooms_name":"PCOH_1302","rooms_seats":24},{"rooms_name":"PHRM_1101","rooms_seats":236},{"rooms_name":"PHRM_1201","rooms_seats":167},{"rooms_name":"PHRM_3112","rooms_seats":7},{"rooms_name":"PHRM_3114","rooms_seats":7},{"rooms_name":"PHRM_3115","rooms_seats":7},{"rooms_name":"PHRM_3116","rooms_seats":14},{"rooms_name":"PHRM_3118","rooms_seats":7},{"rooms_name":"PHRM_3120","rooms_seats":7},{"rooms_name":"PHRM_3122","rooms_seats":7},{"rooms_name":"PHRM_3124","rooms_seats":7},{"rooms_name":"PHRM_3208","rooms_seats":72},{"rooms_name":"SCRF_100","rooms_seats":280},{"rooms_name":"SCRF_1003","rooms_seats":40},{"rooms_name":"SCRF_1004","rooms_seats":40},{"rooms_name":"SCRF_1005","rooms_seats":40},{"rooms_name":"SCRF_1020","rooms_seats":24},{"rooms_name":"SCRF_1021","rooms_seats":20},{"rooms_name":"SCRF_1022","rooms_seats":20},{"rooms_name":"SCRF_1023","rooms_seats":20},{"rooms_name":"SCRF_1024","rooms_seats":20},{"rooms_name":"SCRF_1328","rooms_seats":38},{"rooms_name":"SCRF_200","rooms_seats":40},{"rooms_name":"SCRF_201","rooms_seats":40},{"rooms_name":"SCRF_202","rooms_seats":40},{"rooms_name":"SCRF_203","rooms_seats":40},{"rooms_name":"SCRF_204","rooms_seats":40},{"rooms_name":"SCRF_204A","rooms_seats":24},{"rooms_name":"SCRF_205","rooms_seats":34},{"rooms_name":"SCRF_206","rooms_seats":40},{"rooms_name":"SCRF_207","rooms_seats":40},{"rooms_name":"SCRF_208","rooms_seats":40},{"rooms_name":"SCRF_209","rooms_seats":60},{"rooms_name":"SCRF_210","rooms_seats":24},{"rooms_name":"SOWK_122","rooms_seats":12},{"rooms_name":"SOWK_124","rooms_seats":68},{"rooms_name":"SOWK_222","rooms_seats":29},{"rooms_name":"SOWK_223","rooms_seats":29},{"rooms_name":"SOWK_224","rooms_seats":31},{"rooms_name":"SOWK_324","rooms_seats":16},{"rooms_name":"SOWK_326","rooms_seats":16},{"rooms_name":"SPPH_143","rooms_seats":28},{"rooms_name":"SPPH_B108","rooms_seats":30},{"rooms_name":"SPPH_B112","rooms_seats":16},{"rooms_name":"SPPH_B136","rooms_seats":12},{"rooms_name":"SPPH_B138","rooms_seats":14},{"rooms_name":"SPPH_B151","rooms_seats":66},{"rooms_name":"SRC_220A","rooms_seats":299},{"rooms_name":"SRC_220B","rooms_seats":299},{"rooms_name":"SRC_220C","rooms_seats":299},{"rooms_name":"SWNG_105","rooms_seats":47},{"rooms_name":"SWNG_106","rooms_seats":27},{"rooms_name":"SWNG_107","rooms_seats":47},{"rooms_name":"SWNG_108","rooms_seats":27},{"rooms_name":"SWNG_109","rooms_seats":47},{"rooms_name":"SWNG_110","rooms_seats":27},{"rooms_name":"SWNG_121","rooms_seats":187},{"rooms_name":"SWNG_122","rooms_seats":188},{"rooms_name":"SWNG_221","rooms_seats":190},{"rooms_name":"SWNG_222","rooms_seats":190},{"rooms_name":"SWNG_305","rooms_seats":47},{"rooms_name":"SWNG_306","rooms_seats":27},{"rooms_name":"SWNG_307","rooms_seats":47},{"rooms_name":"SWNG_308","rooms_seats":27},{"rooms_name":"SWNG_309","rooms_seats":47},{"rooms_name":"SWNG_310","rooms_seats":27},{"rooms_name":"SWNG_405","rooms_seats":47},{"rooms_name":"SWNG_406","rooms_seats":27},{"rooms_name":"SWNG_407","rooms_seats":47},{"rooms_name":"SWNG_408","rooms_seats":27},{"rooms_name":"SWNG_409","rooms_seats":47},{"rooms_name":"SWNG_410","rooms_seats":27},{"rooms_name":"UCLL_101","rooms_seats":30},{"rooms_name":"UCLL_103","rooms_seats":55},{"rooms_name":"UCLL_107","rooms_seats":48},{"rooms_name":"UCLL_109","rooms_seats":30},{"rooms_name":"WESB_100","rooms_seats":325},{"rooms_name":"WESB_201","rooms_seats":102},{"rooms_name":"WOOD_1","rooms_seats":120},{"rooms_name":"WOOD_2","rooms_seats":503},{"rooms_name":"WOOD_3","rooms_seats":88},{"rooms_name":"WOOD_4","rooms_seats":120},{"rooms_name":"WOOD_5","rooms_seats":120},{"rooms_name":"WOOD_6","rooms_seats":181},{"rooms_name":"WOOD_B75","rooms_seats":30},{"rooms_name":"WOOD_B79","rooms_seats":21},{"rooms_name":"WOOD_G41","rooms_seats":30},{"rooms_name":"WOOD_G44","rooms_seats":14},{"rooms_name":"WOOD_G53","rooms_seats":10},{"rooms_name":"WOOD_G55","rooms_seats":10},{"rooms_name":"WOOD_G57","rooms_seats":12},{"rooms_name":"WOOD_G59","rooms_seats":10},{"rooms_name":"WOOD_G65","rooms_seats":12},{"rooms_name":"WOOD_G66","rooms_seats":16}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("Only Built for Cuban Linx: Apply: COUNT should be supported", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg":82
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_id",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats", "courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_id"],
                "APPLY": [{"maxSeats": {"COUNT": "courses_dept"}}]
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"courses_id":"501","maxSeats":41},{"courses_id":"502","maxSeats":37},{"courses_id":"500","maxSeats":28},{"courses_id":"520","maxSeats":25},{"courses_id":"503","maxSeats":25},{"courses_id":"550","maxSeats":23},{"courses_id":"510","maxSeats":22},{"courses_id":"505","maxSeats":22},{"courses_id":"504","maxSeats":19},{"courses_id":"511","maxSeats":18},{"courses_id":"531","maxSeats":17},{"courses_id":"521","maxSeats":17},{"courses_id":"516","maxSeats":17},{"courses_id":"508","maxSeats":17},{"courses_id":"300","maxSeats":17},{"courses_id":"541","maxSeats":16},{"courses_id":"530","maxSeats":16},{"courses_id":"515","maxSeats":16},{"courses_id":"540","maxSeats":15},{"courses_id":"535","maxSeats":15},{"courses_id":"507","maxSeats":15},{"courses_id":"506","maxSeats":15},{"courses_id":"402","maxSeats":15},{"courses_id":"200","maxSeats":15},{"courses_id":"549","maxSeats":14},{"courses_id":"525","maxSeats":14},{"courses_id":"522","maxSeats":14},{"courses_id":"514","maxSeats":14},{"courses_id":"513","maxSeats":14},{"courses_id":"512","maxSeats":14},{"courses_id":"449","maxSeats":14},{"courses_id":"599","maxSeats":13},{"courses_id":"562","maxSeats":13},{"courses_id":"527","maxSeats":13},{"courses_id":"509","maxSeats":13},{"courses_id":"410","maxSeats":13},{"courses_id":"201","maxSeats":13},{"courses_id":"526","maxSeats":12},{"courses_id":"524","maxSeats":12},{"courses_id":"523","maxSeats":12},{"courses_id":"440","maxSeats":12},{"courses_id":"430","maxSeats":12},{"courses_id":"420","maxSeats":12},{"courses_id":"406","maxSeats":12},{"courses_id":"400","maxSeats":12},{"courses_id":"303","maxSeats":12},{"courses_id":"301","maxSeats":12},{"courses_id":"101","maxSeats":12},{"courses_id":"100","maxSeats":12},{"courses_id":"570","maxSeats":11},{"courses_id":"551","maxSeats":11},{"courses_id":"545","maxSeats":11},{"courses_id":"544","maxSeats":11},{"courses_id":"532","maxSeats":11},{"courses_id":"450","maxSeats":11},{"courses_id":"411","maxSeats":11},{"courses_id":"405","maxSeats":11},{"courses_id":"404","maxSeats":11},{"courses_id":"310","maxSeats":11},{"courses_id":"304","maxSeats":11},{"courses_id":"560","maxSeats":10},{"courses_id":"553","maxSeats":10},{"courses_id":"543","maxSeats":10},{"courses_id":"534","maxSeats":10},{"courses_id":"305","maxSeats":10},{"courses_id":"210","maxSeats":10},{"courses_id":"564","maxSeats":9},{"courses_id":"563","maxSeats":9},{"courses_id":"555","maxSeats":9},{"courses_id":"533","maxSeats":9},{"courses_id":"529","maxSeats":9},{"courses_id":"528","maxSeats":9},{"courses_id":"517","maxSeats":9},{"courses_id":"437","maxSeats":9},{"courses_id":"433","maxSeats":9},{"courses_id":"425","maxSeats":9},{"courses_id":"333","maxSeats":9},{"courses_id":"320","maxSeats":9},{"courses_id":"110","maxSeats":9},{"courses_id":"597","maxSeats":8},{"courses_id":"595","maxSeats":8},{"courses_id":"573","maxSeats":8},{"courses_id":"571","maxSeats":8},{"courses_id":"565","maxSeats":8},{"courses_id":"561","maxSeats":8},{"courses_id":"557","maxSeats":8},{"courses_id":"556","maxSeats":8},{"courses_id":"554","maxSeats":8},{"courses_id":"542","maxSeats":8},{"courses_id":"518","maxSeats":8},{"courses_id":"452","maxSeats":8},{"courses_id":"445","maxSeats":8},{"courses_id":"421","maxSeats":8},{"courses_id":"415","maxSeats":8},{"courses_id":"412","maxSeats":8},{"courses_id":"407","maxSeats":8},{"courses_id":"403","maxSeats":8},{"courses_id":"401","maxSeats":8},{"courses_id":"302","maxSeats":8},{"courses_id":"102","maxSeats":8},{"courses_id":"591","maxSeats":7},{"courses_id":"582","maxSeats":7},{"courses_id":"575","maxSeats":7},{"courses_id":"566","maxSeats":7},{"courses_id":"547","maxSeats":7},{"courses_id":"499","maxSeats":7},{"courses_id":"490","maxSeats":7},{"courses_id":"441","maxSeats":7},{"courses_id":"439","maxSeats":7},{"courses_id":"432","maxSeats":7},{"courses_id":"408","maxSeats":7},{"courses_id":"330","maxSeats":7},{"courses_id":"311","maxSeats":7},{"courses_id":"596","maxSeats":6},{"courses_id":"594","maxSeats":6},{"courses_id":"592","maxSeats":6},{"courses_id":"581","maxSeats":6},{"courses_id":"580","maxSeats":6},{"courses_id":"574","maxSeats":6},{"courses_id":"552","maxSeats":6},{"courses_id":"536","maxSeats":6},{"courses_id":"495","maxSeats":6},{"courses_id":"493","maxSeats":6},{"courses_id":"485","maxSeats":6},{"courses_id":"464","maxSeats":6},{"courses_id":"461","maxSeats":6},{"courses_id":"460","maxSeats":6},{"courses_id":"459","maxSeats":6},{"courses_id":"457","maxSeats":6},{"courses_id":"436","maxSeats":6},{"courses_id":"431","maxSeats":6},{"courses_id":"424","maxSeats":6},{"courses_id":"422","maxSeats":6},{"courses_id":"416","maxSeats":6},{"courses_id":"350","maxSeats":6},{"courses_id":"325","maxSeats":6},{"courses_id":"202","maxSeats":6},{"courses_id":"598","maxSeats":5},{"courses_id":"586","maxSeats":5},{"courses_id":"585","maxSeats":5},{"courses_id":"584","maxSeats":5},{"courses_id":"578","maxSeats":5},{"courses_id":"577","maxSeats":5},{"courses_id":"576","maxSeats":5},{"courses_id":"572","maxSeats":5},{"courses_id":"569","maxSeats":5},{"courses_id":"568","maxSeats":5},{"courses_id":"559","maxSeats":5},{"courses_id":"548","maxSeats":5},{"courses_id":"539","maxSeats":5},{"courses_id":"537","maxSeats":5},{"courses_id":"519","maxSeats":5},{"courses_id":"492","maxSeats":5},{"courses_id":"491","maxSeats":5},{"courses_id":"474","maxSeats":5},{"courses_id":"471","maxSeats":5},{"courses_id":"465","maxSeats":5},{"courses_id":"462","maxSeats":5},{"courses_id":"454","maxSeats":5},{"courses_id":"427","maxSeats":5},{"courses_id":"413","maxSeats":5},{"courses_id":"374","maxSeats":5},{"courses_id":"371","maxSeats":5},{"courses_id":"362","maxSeats":5},{"courses_id":"361","maxSeats":5},{"courses_id":"352","maxSeats":5},{"courses_id":"340","maxSeats":5},{"courses_id":"335","maxSeats":5},{"courses_id":"315","maxSeats":5},{"courses_id":"307","maxSeats":5},{"courses_id":"306","maxSeats":5},{"courses_id":"589","maxSeats":4},{"courses_id":"583","maxSeats":4},{"courses_id":"567","maxSeats":4},{"courses_id":"546","maxSeats":4},{"courses_id":"498","maxSeats":4},{"courses_id":"494","maxSeats":4},{"courses_id":"489","maxSeats":4},{"courses_id":"486","maxSeats":4},{"courses_id":"481","maxSeats":4},{"courses_id":"473","maxSeats":4},{"courses_id":"472","maxSeats":4},{"courses_id":"470","maxSeats":4},{"courses_id":"467","maxSeats":4},{"courses_id":"458","maxSeats":4},{"courses_id":"456","maxSeats":4},{"courses_id":"453","maxSeats":4},{"courses_id":"451","maxSeats":4},{"courses_id":"447","maxSeats":4},{"courses_id":"442","maxSeats":4},{"courses_id":"434","maxSeats":4},{"courses_id":"426","maxSeats":4},{"courses_id":"423","maxSeats":4},{"courses_id":"419","maxSeats":4},{"courses_id":"418","maxSeats":4},{"courses_id":"370","maxSeats":4},{"courses_id":"355","maxSeats":4},{"courses_id":"341","maxSeats":4},{"courses_id":"337","maxSeats":4},{"courses_id":"323","maxSeats":4},{"courses_id":"321","maxSeats":4},{"courses_id":"316","maxSeats":4},{"courses_id":"309","maxSeats":4},{"courses_id":"308","maxSeats":4},{"courses_id":"250","maxSeats":4},{"courses_id":"221","maxSeats":4},{"courses_id":"211","maxSeats":4},{"courses_id":"206","maxSeats":4},{"courses_id":"103","maxSeats":4},{"courses_id":"602","maxSeats":3},{"courses_id":"601","maxSeats":3},{"courses_id":"590","maxSeats":3},{"courses_id":"587","maxSeats":3},{"courses_id":"579","maxSeats":3},{"courses_id":"480","maxSeats":3},{"courses_id":"479","maxSeats":3},{"courses_id":"477","maxSeats":3},{"courses_id":"475","maxSeats":3},{"courses_id":"469","maxSeats":3},{"courses_id":"466","maxSeats":3},{"courses_id":"446","maxSeats":3},{"courses_id":"435","maxSeats":3},{"courses_id":"414","maxSeats":3},{"courses_id":"409","maxSeats":3},{"courses_id":"398","maxSeats":3},{"courses_id":"391","maxSeats":3},{"courses_id":"377","maxSeats":3},{"courses_id":"376","maxSeats":3},{"courses_id":"373","maxSeats":3},{"courses_id":"366","maxSeats":3},{"courses_id":"365","maxSeats":3},{"courses_id":"364","maxSeats":3},{"courses_id":"363","maxSeats":3},{"courses_id":"359","maxSeats":3},{"courses_id":"356","maxSeats":3},{"courses_id":"349","maxSeats":3},{"courses_id":"348","maxSeats":3},{"courses_id":"343","maxSeats":3},{"courses_id":"342","maxSeats":3},{"courses_id":"336","maxSeats":3},{"courses_id":"331","maxSeats":3},{"courses_id":"328","maxSeats":3},{"courses_id":"327","maxSeats":3},{"courses_id":"326","maxSeats":3},{"courses_id":"319","maxSeats":3},{"courses_id":"314","maxSeats":3},{"courses_id":"313","maxSeats":3},{"courses_id":"312","maxSeats":3},{"courses_id":"240","maxSeats":3},{"courses_id":"230","maxSeats":3},{"courses_id":"224","maxSeats":3},{"courses_id":"220","maxSeats":3},{"courses_id":"215","maxSeats":3},{"courses_id":"112","maxSeats":3},{"courses_id":"698","maxSeats":2},{"courses_id":"603","maxSeats":2},{"courses_id":"600","maxSeats":2},{"courses_id":"593","maxSeats":2},{"courses_id":"588","maxSeats":2},{"courses_id":"558","maxSeats":2},{"courses_id":"488","maxSeats":2},{"courses_id":"487","maxSeats":2},{"courses_id":"484","maxSeats":2},{"courses_id":"483","maxSeats":2},{"courses_id":"478","maxSeats":2},{"courses_id":"463","maxSeats":2},{"courses_id":"444","maxSeats":2},{"courses_id":"438","maxSeats":2},{"courses_id":"428","maxSeats":2},{"courses_id":"417","maxSeats":2},{"courses_id":"392","maxSeats":2},{"courses_id":"390","maxSeats":2},{"courses_id":"381","maxSeats":2},{"courses_id":"380","maxSeats":2},{"courses_id":"375","maxSeats":2},{"courses_id":"360","maxSeats":2},{"courses_id":"358","maxSeats":2},{"courses_id":"353","maxSeats":2},{"courses_id":"351","maxSeats":2},{"courses_id":"344","maxSeats":2},{"courses_id":"339","maxSeats":2},{"courses_id":"338","maxSeats":2},{"courses_id":"334","maxSeats":2},{"courses_id":"322","maxSeats":2},{"courses_id":"317","maxSeats":2},{"courses_id":"298","maxSeats":2},{"courses_id":"292","maxSeats":2},{"courses_id":"291","maxSeats":2},{"courses_id":"290","maxSeats":2},{"courses_id":"271","maxSeats":2},{"courses_id":"270","maxSeats":2},{"courses_id":"262","maxSeats":2},{"courses_id":"255","maxSeats":2},{"courses_id":"235","maxSeats":2},{"courses_id":"226","maxSeats":2},{"courses_id":"225","maxSeats":2},{"courses_id":"222","maxSeats":2},{"courses_id":"217","maxSeats":2},{"courses_id":"213","maxSeats":2},{"courses_id":"212","maxSeats":2},{"courses_id":"207","maxSeats":2},{"courses_id":"205","maxSeats":2},{"courses_id":"204","maxSeats":2},{"courses_id":"203","maxSeats":2},{"courses_id":"170","maxSeats":2},{"courses_id":"161","maxSeats":2},{"courses_id":"141","maxSeats":2},{"courses_id":"140","maxSeats":2},{"courses_id":"131","maxSeats":2},{"courses_id":"122","maxSeats":2},{"courses_id":"120","maxSeats":2},{"courses_id":"117","maxSeats":2},{"courses_id":"104","maxSeats":2},{"courses_id":"724","maxSeats":1},{"courses_id":"722","maxSeats":1},{"courses_id":"721","maxSeats":1},{"courses_id":"699","maxSeats":1},{"courses_id":"695","maxSeats":1},{"courses_id":"693","maxSeats":1},{"courses_id":"684","maxSeats":1},{"courses_id":"683","maxSeats":1},{"courses_id":"682","maxSeats":1},{"courses_id":"672","maxSeats":1},{"courses_id":"671","maxSeats":1},{"courses_id":"662","maxSeats":1},{"courses_id":"660","maxSeats":1},{"courses_id":"654","maxSeats":1},{"courses_id":"640","maxSeats":1},{"courses_id":"635","maxSeats":1},{"courses_id":"634","maxSeats":1},{"courses_id":"632","maxSeats":1},{"courses_id":"628","maxSeats":1},{"courses_id":"627","maxSeats":1},{"courses_id":"626","maxSeats":1},{"courses_id":"620","maxSeats":1},{"courses_id":"607","maxSeats":1},{"courses_id":"606","maxSeats":1},{"courses_id":"538","maxSeats":1},{"courses_id":"497","maxSeats":1},{"courses_id":"496","maxSeats":1},{"courses_id":"482","maxSeats":1},{"courses_id":"468","maxSeats":1},{"courses_id":"455","maxSeats":1},{"courses_id":"448","maxSeats":1},{"courses_id":"443","maxSeats":1},{"courses_id":"399","maxSeats":1},{"courses_id":"396","maxSeats":1},{"courses_id":"395","maxSeats":1},{"courses_id":"393","maxSeats":1},{"courses_id":"389","maxSeats":1},{"courses_id":"388","maxSeats":1},{"courses_id":"386","maxSeats":1},{"courses_id":"383","maxSeats":1},{"courses_id":"378","maxSeats":1},{"courses_id":"372","maxSeats":1},{"courses_id":"368","maxSeats":1},{"courses_id":"367","maxSeats":1},{"courses_id":"357","maxSeats":1},{"courses_id":"354","maxSeats":1},{"courses_id":"347","maxSeats":1},{"courses_id":"346","maxSeats":1},{"courses_id":"345","maxSeats":1},{"courses_id":"332","maxSeats":1},{"courses_id":"329","maxSeats":1},{"courses_id":"282","maxSeats":1},{"courses_id":"281","maxSeats":1},{"courses_id":"279","maxSeats":1},{"courses_id":"276","maxSeats":1},{"courses_id":"275","maxSeats":1},{"courses_id":"274","maxSeats":1},{"courses_id":"273","maxSeats":1},{"courses_id":"272","maxSeats":1},{"courses_id":"265","maxSeats":1},{"courses_id":"260","maxSeats":1},{"courses_id":"259","maxSeats":1},{"courses_id":"254","maxSeats":1},{"courses_id":"252","maxSeats":1},{"courses_id":"249","maxSeats":1},{"courses_id":"244","maxSeats":1},{"courses_id":"243","maxSeats":1},{"courses_id":"241","maxSeats":1},{"courses_id":"233","maxSeats":1},{"courses_id":"231","maxSeats":1},{"courses_id":"229","maxSeats":1},{"courses_id":"227","maxSeats":1},{"courses_id":"219","maxSeats":1},{"courses_id":"218","maxSeats":1},{"courses_id":"209","maxSeats":1},{"courses_id":"208","maxSeats":1},{"courses_id":"191","maxSeats":1},{"courses_id":"167","maxSeats":1},{"courses_id":"164","maxSeats":1},{"courses_id":"163","maxSeats":1},{"courses_id":"159","maxSeats":1},{"courses_id":"150","maxSeats":1},{"courses_id":"149","maxSeats":1},{"courses_id":"135","maxSeats":1},{"courses_id":"130","maxSeats":1},{"courses_id":"127","maxSeats":1},{"courses_id":"121","maxSeats":1},{"courses_id":"119","maxSeats":1},{"courses_id":"118","maxSeats":1},{"courses_id":"115","maxSeats":1},{"courses_id":"114","maxSeats":1},{"courses_id":"113","maxSeats":1},{"courses_id":"111","maxSeats":1},{"courses_id":"109","maxSeats":1},{"courses_id":"108","maxSeats":1},{"courses_id":"106","maxSeats":1},{"courses_id":"105","maxSeats":1}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("RainDrops DropTop: Invalid query with GROUP key matching COLUMN but not a KEY returns 400", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg":82
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_id",
                    "courses_audit",
                    "skurr"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_id", "courses_audit", "skurr"],
                "APPLY": []
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Street Hop: Invalid query with GROUP not matching returns 400", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg":82
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_id",
                    "courses_audit",
                    "skurr"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_id", "courses_audit"],
                "APPLY": []
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Mountain Doo: Invalid query with GROUP key matching COLUMN but not a KEY returns 400", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg":82
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_id",
                    "courses_audit",
                    "skurr",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_id", "courses_audit", "maxSeats"],
                "APPLY": [{
                    "skurr": {
                        "SUM": "courses_avg"
                    }
                },
                    {
                        "maxSeats": {
                            "COUNT": "courses_audit"
                        }
                    }]
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Mountain Doo the Sequel: Invalid query with GROUP key matching COLUMN but not a KEY returns 400", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg":82
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_id",
                    "courses_audit",
                    "skurr",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [],
                "APPLY": [{
                    "skurr": {
                        "SUM": "courses_avg"
                    }
                },
                    {
                        "maxSeats": {
                            "COUNT": "courses_audit"
                        }
                    }]
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Sacrilicious: Apply: SUM should be supported", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_audit":8
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_audit",
                    "maxSeats"
                ],
                "ORDER":"courses_audit",
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_audit"],
                "APPLY": [{
                    "maxSeats": {
                        "SUM": "courses_avg"
                    }
                }]
            }
        }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"courses_dept":"aanb","courses_audit":9,"maxSeats":188.88},{"courses_dept":"chbe","courses_audit":9,"maxSeats":80.81},{"courses_dept":"cnto","courses_audit":9,"maxSeats":84.59},{"courses_dept":"cons","courses_audit":9,"maxSeats":76.21},{"courses_dept":"rhsc","courses_audit":9,"maxSeats":342.73},{"courses_dept":"cpsc","courses_audit":9,"maxSeats":182.44},{"courses_dept":"epse","courses_audit":9,"maxSeats":190},{"courses_dept":"rhsc","courses_audit":10,"maxSeats":177.13},{"courses_dept":"frst","courses_audit":10,"maxSeats":247.64},{"courses_dept":"rhsc","courses_audit":11,"maxSeats":84.5},{"courses_dept":"cpsc","courses_audit":11,"maxSeats":80.29},{"courses_dept":"frst","courses_audit":11,"maxSeats":159.28},{"courses_dept":"biol","courses_audit":12,"maxSeats":168.76},{"courses_dept":"rhsc","courses_audit":12,"maxSeats":341.08000000000004},{"courses_dept":"fren","courses_audit":12,"maxSeats":73.4},{"courses_dept":"rhsc","courses_audit":13,"maxSeats":86.19},{"courses_dept":"cnto","courses_audit":13,"maxSeats":84.6},{"courses_dept":"rhsc","courses_audit":14,"maxSeats":82.56},{"courses_dept":"cpsc","courses_audit":14,"maxSeats":80.29},{"courses_dept":"cons","courses_audit":15,"maxSeats":76.21},{"courses_dept":"rhsc","courses_audit":15,"maxSeats":164.2},{"courses_dept":"rhsc","courses_audit":17,"maxSeats":88},{"courses_dept":"rhsc","courses_audit":18,"maxSeats":87.14},{"courses_dept":"cpsc","courses_audit":18,"maxSeats":90.53},{"courses_dept":"rhsc","courses_audit":19,"maxSeats":250.65},{"courses_dept":"frst","courses_audit":19,"maxSeats":171.12},{"courses_dept":"rhsc","courses_audit":20,"maxSeats":87.26},{"courses_dept":"rhsc","courses_audit":21,"maxSeats":86.89},{"courses_dept":"cpsc","courses_audit":21,"maxSeats":90.53},{"courses_dept":"rhsc","courses_audit":23,"maxSeats":88.79}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("In the Zone Chief: Invalid APPLYTOKEN operator AV instead of AVG result in 400", function () {
        let query: any =
            {
                "WHERE": {
                    "AND": [
                        {
                            "IS": {
                                "rooms_furniture": "*Tables*"
                            }
                        },
                        {
                            "GT": {
                                "rooms_seats": 300
                            }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "avgSeats",
                        "maxSeats"
                    ],
                    "ORDER": "avgSeats",
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": [
                        "rooms_shortname"
                    ],
                    "APPLY": [
                        {
                            "avgSeats": {
                                "AVG": "rooms_seats"
                            }
                        },
                        {
                            "maxSeats": {
                                "AG": "rooms_lon"
                            }
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("The Next Episode: Invalid APPLYTOKEN data key {MAX : dhuu} result in 400", function () {
        let query: any =
            {
                "WHERE": {
                    "AND": [
                        {
                            "IS": {
                                "rooms_furniture": "*Tables*"
                            }
                        },
                        {
                            "GT": {
                                "rooms_seats": 300
                            }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "avgSeats",
                        "maxSeats"
                    ],
                    "ORDER": "avgSeats",
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": [
                        "rooms_shortname"
                    ],
                    "APPLY": [
                        {
                            "avgSeats": {
                                "AVG": "rooms_seats"
                            }
                        },
                        {
                            "maxSeats": {
                                "MAX": "dhuu"
                            }
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Collard Greens: Invalid numberic field key TOKEN for AVG result in 400", function () {
        let query: any =
            {
                "WHERE": {
                    "AND": [
                        {
                            "IS": {
                                "rooms_furniture": "*Tables*"
                            }
                        },
                        {
                            "GT": {
                                "rooms_seats": 300
                            }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "avgSeats",
                        "maxSeats"
                    ],
                    "ORDER": "avgSeats",
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": [
                        "rooms_shortname"
                    ],
                    "APPLY": [
                        {
                            "avgSeats": {
                                "AVG": "rooms_shortname"
                            }
                        },
                        {
                            "maxSeats": {
                                "MAX": "rooms_seats"
                            }
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Vape Nation: trying to query incorrect group" , function () {
        let query: any =
            {
                "WHERE": {
                    "OR": [{
                        "IS": {
                            "rooms_furniture": "*assroom-Movable Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_furniture",
                        "asdf"
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_furniture"],
                    "APPLY": [{
                        "asdf": {
                            "MIN": "rooms_derps"
                        }
                    },
                        {
                            "lolkz": {
                                "COUNT": "rooms_seats"
                            }
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("The Warriors: The APPLY key is invalid", function () {
        let query: any =
            {
                "WHERE": {
                    "OR": [{
                        "IS": {
                            "rooms_furniture": "*assroom-Movable Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_furniture",
                        "asdf"
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_furniture"],
                    "APPLY": [{
                        "asdf": {
                            "MIN": "rooms_seats"
                        }
                    },
                        {
                            "lolkz": {
                                "COUNT": "lolz"
                            },
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Double Cups and Molly: group reference wrong dataset", function () {
        let query: any =
            {
                "WHERE": {
                    "OR": [{
                        "IS": {
                            "rooms_furniture": "*assroom-Movable Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_furniture",
                        "asdf"
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "courses_avg"],
                    "APPLY": [{
                        "asdf": {
                            "MIN": "rooms_seats"
                        }
                    },
                        {
                            "lolkz": {
                                "MIN": "rooms_seats"
                            }
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Blue Dream and Lean: the columns do not match any of the APPLY keys", function () {
        let query: any =
            {
                "WHERE": {
                    "OR": [{
                        "IS": {
                            "rooms_furniture": "*assroom-Movable Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_furniture",
                        "skurrskurr"
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_furniture"],
                    "APPLY": [{
                        "asdf": {
                            "MIN": "rooms_seats"
                        }
                    },
                        {
                            "lolkz": {
                                "MIN": "rooms_seats"
                            },
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Allergic to Waffles: Duplicate apply token key", function () {
        let query: any =
            {
                "WHERE": {
                    "OR": [{
                        "IS": {
                            "rooms_furniture": "*assroom-Movable Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_furniture",
                        "skurrskurr"
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_furniture"],
                    "APPLY": [{
                        "asdf": {
                            "MIN": "rooms_seats"
                        }
                    },
                        {
                            "asdf": {
                                "MIN": "rooms_seats"
                            },
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal(400);
        })
    });

    it("Dave Attell Captain Miserable: Invalid DIRECTION for ORDER result in 400", function () {
        let query: any =
            {
                "WHERE": {
                    "GT": {
                        "courses_instructor": 97
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER": {
                        "dir": "derp",
                        "keys": ["courses_dept"]
                    },
                    "FORM": "TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code == 400);
        })
    });


    it("Anthony Jeselnik Shakesspear: Invalid key for ORDER result in 400", function () {
        let query: any =
            {
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_furniture",
                        "rooms_seats",
                        "rooms_shortname"
                    ],
                    "ORDER": {
                        "dir": "UP",
                        "keys": ["skurr skurr"]
                    },
                    "FORM": "TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code == 400);
        })
    });

    it("Anthony Jeselnik Thoughts and Prayers: Invalid key for ORDER result in 400", function () {
        let query: any =
            {
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_furniture",
                        "rooms_seats",
                        "rooms_shortname"
                    ],
                    "ORDER": {
                        "dir": "UP",
                        "keys": ["rooms_shortname", "rooms_name"]
                    },
                    "FORM": "TABLE"
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code == 400);
        })
    });

    it("Patrice O Neal: all keys in COLUMNS must be in GROUP", function () {
        let query: any =
            {
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_furniture",
                        "rooms_seats",
                        "rooms_shortname",
                        "rooms_name",
                        "rooms_lon"
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_furniture", "rooms_seats", "rooms_shortname", "rooms_name", "rooms_lat"],
                    "APPLY": []
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code == 400);
        })
    });


    it("Souja Boy: TRANSFORMATION apply cannot contain _", function () {
        let simpleQuery: QueryRequest = {
            "WHERE":{},
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_shortname"
                ],
                "ORDER":"rooms_shortname",
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "max_Seats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        }
        return insightFacade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            expect.fail()
        }).catch(function (err) {
            Log.test(err.message);
            expect(err.code == 400);
        });
    });


    it("Pineapple Express: Simple MAX transformation", function (done) {
        var test = new InsightFacade();
        let simpleQuery: QueryRequest = {
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


    it("Vault 101 FALLOUT 3: Test COUNT APPLY function", function () {
        let query: QueryRequest =
            {
                "WHERE": {
                    "OR": [{
                        "IS": {
                            "rooms_type": "*Large Group*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_type",
                        "ranch"
                    ],
                    "ORDER": {
                        "dir": "UP",
                        "keys": ["ranch", "rooms_shortname"]
                    },
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_type"],
                    "APPLY": [{
                        "ranch": {
                            "COUNT": "rooms_seats"
                        }
                    }]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"rooms_shortname":"AERL","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"BRKX","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"CEME","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"CIRS","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"FNH","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"FRDM","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"GEOG","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"HEBB","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"IBLC","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"MATH","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"MATX","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"OSBO","rooms_type":"Open Design General Purpose","ranch":1},{"rooms_shortname":"SCRF","rooms_type":"Tiered Large Group","ranch":1},{"rooms_shortname":"BIOL","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"CHBE","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"FSC","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"LASR","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"LSC","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"LSK","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"MCLD","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"MCML","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"PHRM","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"WESB","rooms_type":"Tiered Large Group","ranch":2},{"rooms_shortname":"DMP","rooms_type":"Tiered Large Group","ranch":3},{"rooms_shortname":"ESB","rooms_type":"Tiered Large Group","ranch":3},{"rooms_shortname":"HENN","rooms_type":"Tiered Large Group","ranch":3},{"rooms_shortname":"SWNG","rooms_type":"Tiered Large Group","ranch":3},{"rooms_shortname":"CHEM","rooms_type":"Tiered Large Group","ranch":4},{"rooms_shortname":"WOOD","rooms_type":"Tiered Large Group","ranch":4},{"rooms_shortname":"ANGU","rooms_type":"Tiered Large Group","ranch":5},{"rooms_shortname":"BUCH","rooms_type":"Tiered Large Group","ranch":6}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });

    it("PurpScurp: Test SUM APPLY function", function () {
        let query: QueryRequest =
            {
                "WHERE": {
                    "OR": [{
                        "IS": {
                            "rooms_type": "*Large Group*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_type",
                        "ranch"
                    ],
                    "ORDER": {
                        "dir": "UP",
                        "keys": ["ranch", "rooms_shortname"]
                    },
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_type"],
                    "APPLY": [{
                        "ranch": {
                            "SUM": "rooms_seats"
                        }
                    }]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"rooms_shortname":"BRKX","rooms_type":"Tiered Large Group","ranch":70},{"rooms_shortname":"FNH","rooms_type":"Tiered Large Group","ranch":99},{"rooms_shortname":"CEME","rooms_type":"Tiered Large Group","ranch":100},{"rooms_shortname":"MATX","rooms_type":"Tiered Large Group","ranch":106},{"rooms_shortname":"AERL","rooms_type":"Tiered Large Group","ranch":144},{"rooms_shortname":"IBLC","rooms_type":"Tiered Large Group","ranch":154},{"rooms_shortname":"FRDM","rooms_type":"Tiered Large Group","ranch":160},{"rooms_shortname":"LASR","rooms_type":"Tiered Large Group","ranch":174},{"rooms_shortname":"MATH","rooms_type":"Tiered Large Group","ranch":224},{"rooms_shortname":"GEOG","rooms_type":"Tiered Large Group","ranch":225},{"rooms_shortname":"MCLD","rooms_type":"Tiered Large Group","ranch":259},{"rooms_shortname":"MCML","rooms_type":"Tiered Large Group","ranch":274},{"rooms_shortname":"SCRF","rooms_type":"Tiered Large Group","ranch":280},{"rooms_shortname":"CHBE","rooms_type":"Tiered Large Group","ranch":294},{"rooms_shortname":"BIOL","rooms_type":"Tiered Large Group","ranch":304},{"rooms_shortname":"FSC","rooms_type":"Tiered Large Group","ranch":349},{"rooms_shortname":"DMP","rooms_type":"Tiered Large Group","ranch":360},{"rooms_shortname":"HEBB","rooms_type":"Tiered Large Group","ranch":375},{"rooms_shortname":"LSK","rooms_type":"Tiered Large Group","ranch":388},{"rooms_shortname":"PHRM","rooms_type":"Tiered Large Group","ranch":403},{"rooms_shortname":"CIRS","rooms_type":"Tiered Large Group","ranch":426},{"rooms_shortname":"WESB","rooms_type":"Tiered Large Group","ranch":427},{"rooms_shortname":"OSBO","rooms_type":"Open Design General Purpose","ranch":442},{"rooms_shortname":"HENN","rooms_type":"Tiered Large Group","ranch":562},{"rooms_shortname":"ESB","rooms_type":"Tiered Large Group","ranch":580},{"rooms_shortname":"ANGU","rooms_type":"Tiered Large Group","ranch":706},{"rooms_shortname":"SWNG","rooms_type":"Tiered Large Group","ranch":755},{"rooms_shortname":"LSC","rooms_type":"Tiered Large Group","ranch":825},{"rooms_shortname":"CHEM","rooms_type":"Tiered Large Group","ranch":913},{"rooms_shortname":"WOOD","rooms_type":"Tiered Large Group","ranch":1132},{"rooms_shortname":"BUCH","rooms_type":"Tiered Large Group","ranch":1238}]});
        }).catch(function (err) {
            Log.test(err.message);
        });
    });

    it("Ranch Original: Test MIN/AVG APPLY function in conjection with AVG function", function () {
        let query: QueryRequest =
            {
                "WHERE": {
                    "AND": [
                        {
                            "IS": {
                                "rooms_furniture": "*Tables*"
                            }
                        },
                        {
                            "GT": {
                                "rooms_seats": 68
                            }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "avgSeats",
                        "maxSeats"
                    ],
                    "ORDER": "rooms_shortname",
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": [
                        "rooms_shortname"
                    ],
                    "APPLY": [
                        {
                            "avgSeats": {
                                "MIN": "rooms_seats"
                            }
                        },
                        {
                            "maxSeats": {
                                "AVG": "rooms_seats"
                            }
                        }
                    ]
                }
            }
        return insightFacade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            expect(response.body).to.deep.equal(
                {"render":"TABLE","result":[{"rooms_shortname":"ALRD","avgSeats":94,"maxSeats":94},{"rooms_shortname":"ANGU","avgSeats":70,"maxSeats":120},{"rooms_shortname":"BIOL","avgSeats":76,"maxSeats":76},{"rooms_shortname":"BRKX","avgSeats":70,"maxSeats":70},{"rooms_shortname":"BUCH","avgSeats":78,"maxSeats":88},{"rooms_shortname":"CEME","avgSeats":100,"maxSeats":100},{"rooms_shortname":"CHBE","avgSeats":94,"maxSeats":147},{"rooms_shortname":"DMP","avgSeats":80,"maxSeats":120},{"rooms_shortname":"ESB","avgSeats":80,"maxSeats":80},{"rooms_shortname":"FRDM","avgSeats":160,"maxSeats":160},{"rooms_shortname":"GEOG","avgSeats":72,"maxSeats":86},{"rooms_shortname":"HEBB","avgSeats":375,"maxSeats":375},{"rooms_shortname":"IBLC","avgSeats":112,"maxSeats":133},{"rooms_shortname":"IONA","avgSeats":100,"maxSeats":100},{"rooms_shortname":"LASR","avgSeats":80,"maxSeats":80},{"rooms_shortname":"LSC","avgSeats":125,"maxSeats":275},{"rooms_shortname":"LSK","avgSeats":75,"maxSeats":154.33},{"rooms_shortname":"MCLD","avgSeats":84,"maxSeats":114.33},{"rooms_shortname":"MCML","avgSeats":72,"maxSeats":72},{"rooms_shortname":"ORCH","avgSeats":72,"maxSeats":72},{"rooms_shortname":"OSBO","avgSeats":442,"maxSeats":442},{"rooms_shortname":"PHRM","avgSeats":72,"maxSeats":158.33},{"rooms_shortname":"SRC","avgSeats":299,"maxSeats":299},{"rooms_shortname":"SWNG","avgSeats":187,"maxSeats":188.75},{"rooms_shortname":"WOOD","avgSeats":88,"maxSeats":112}]});
        }).catch(function (err) {
            Log.test(err.message);
            expect.fail();
        });
    });



});
