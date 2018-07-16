/**
 * This is the REST entry point for the project.
 * Restify is configured here.
 */

import restify = require('restify');
import fs = require("fs")

import Log from "../Util";
import {InsightResponse, IInsightFacade} from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";
import {QueryRequest} from '../controller/IInsightFacade';

/**
 * This configures the REST endpoints for the server.
 */

/**
 * This configures the REST endpoints for the server.
 */
export default class Server {

    private port: number;
    private rest: restify.Server;

    constructor(port: number) {
        Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        Log.info('Server::close()');
        let that = this;
        return new Promise(function (fulfill) {
            that.rest.close(function () {
                fulfill(true);
            });
        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                Log.info('Server::start() - start');

                that.rest = restify.createServer({
                    name: 'insightUBC'
                });

                that.rest.use(restify.bodyParser({mapParams: true, mapFiles: true}));

                that.rest.get('/', function (req: restify.Request, res: restify.Response, next: restify.Next) {
                    let data = fs.readFileSync("./src/rest/mainpage.html")
                    res.write(data)
                    res.end()
                    res.send(200);
                    return next();
                });

                that.rest.get('/public/.*', restify.serveStatic({
                    directory:__dirname
                }));

                that.rest.get('/views/.*', restify.serveStatic({
                    directory:__dirname
                }));



                // provides the echo service
                // curl -is  http://localhost:4321/echo/myMessage
                that.rest.get('/echo/:msg', Server.echo);

                //D3 implementation of REST

                // curl localhost:4321/dataset/courses --upload-file courses.zip

                let insightFacade: IInsightFacade = new InsightFacade;


                that.rest.put('/dataset/:id', function (req: restify.Request, res: restify.Response, next: restify.Next) {
                    let insightFacade: IInsightFacade = new InsightFacade;

                    var id: string = req.params.id;

                    let dataStr = new Buffer(req.params.body).toString('base64');
                    insightFacade.addDataset(id, dataStr).then(function(result)
                    {
                        fulfill(res.json(result.code, result.body));

                    }).catch(function (error)
                    {
                        reject(res.json(error.code, error.body));
                    })
                    return next();
                });


                // curl -X DELETE localhost:4321/dataset/courses
                that.rest.del('/dataset/:id', function (req: restify.Request, res: restify.Response, next: restify.Next) {
                    let insightFacade: IInsightFacade = new InsightFacade;

                    var id: string = req.params.id;

                    insightFacade.removeDataset(id).then(function(result)
                    {
                        fulfill(res.json(result.code, result.body));

                    }).catch(function (error)
                    {
                        reject(res.json(error.code, error.body));
                    })
                    return next();
                });

                that.rest.post('/query', function (req: restify.Request, res: restify.Response, next: restify.Next) {
                    let query: QueryRequest = req.params;
                    let insightFacade: IInsightFacade = new InsightFacade;
                    Log.info("we are getting here")
                    insightFacade.performQuery(query).then(function(result)
                    {
                        Log.info("we are getting here")
                        res.json(result.code, result.body);

                    }).catch(function (error)
                    {
                        Log.info("we are getting here")
                        res.json(error.code, error.body);
                    })
                });

                // Other endpoints will go here

                that.rest.listen(that.port, function () {
                    Log.info('Server::start() - restify listening: ' + that.rest.url);
                    fulfill(true);
                });

                that.rest.on('error', function (err: string) {
                    Log.info('Server::start() - restify ERROR: ' + err);
                    reject(err);
                });
            } catch (err) {
                Log.error('Server::start() - ERROR: ' + err);
                reject(err);
            }
        });
    }

    // The next two methods handle the echo service.
    // These are almost certainly not the best place to put these, but are here for your reference.
    // By updating the Server.echo function pointer above, these methods can be easily moved.

    public static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::echo(..) - params: ' + JSON.stringify(req.params));
        try {
            let result = Server.performEcho(req.params.msg);
            Log.info('Server::echo(..) - responding ' + result.code);
            res.json(result.code, result.body);
        } catch (err) {
            Log.error('Server::echo(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performEcho(msg: string): InsightResponse {
        if (typeof msg !== 'undefined' && msg !== null) {
            return {code: 200, body: {message: msg + '...' + msg}};
        } else {
            return {code: 400, body: {error: 'Message not provided'}};
        }
    }

}