import * as http from "http"
import { ArsenicRequest } from "./request";
import { ArsenicResponse } from "./response";
import { Route } from "./route";
import { AddressInfo } from "net";

export type FilterType = (req:ArsenicRequest, resp:ArsenicResponse, next:(req:ArsenicRequest, resp:ArsenicResponse)=>void)=>void

export default class Application {

    private routes: Route[]
    private server: http.Server|null

    private filters: Array<FilterType> = [];

    constructor() {
        this.routes = []
        this.server = null
    }

    /**
     * Add a route to this application (with a default method and handler).
     * 
     * 
     * @param pattern A URL pattern for this route.
     * @returns a newly created route.
     */
    public route(pattern:string) {
        const route = new Route(this, pattern)
        this.routes.push(route)

        return route
    }

    /**
     * main handler for incoming request.
     *
     * @param req the http server request
     * @param res the http server response
     */

    private privhandler(req:http.IncomingMessage, res:http.ServerResponse) {
        const arsenicReq = new ArsenicRequest(req)
        const arsenicRes = new ArsenicResponse(res)

        const handlers = (req:ArsenicRequest, res:ArsenicResponse, filters:Array<FilterType>) => {
            if (filters.length == 0) {
                this.privhandlerfiltered(req, res)
            } else {
                const filter = filters.shift()
                if (filter) {
                    filter(req, res, (aReq, aRes) => {
                        handlers(aReq, aRes, filters)
                    })
                }
            }
        }
        handlers(arsenicReq, arsenicRes, [...this.filters])
    }

    private privhandlerfiltered(arsenicReq:ArsenicRequest, arsenicRes:ArsenicResponse) {
        // filter by path pattern
        var routes : Array<[Route, { [key:string]: string } | null]> = this.routes.map(route  => [route, route.matchPath(arsenicReq)]);
        routes = routes.filter(item => item[1] != null);

        if (routes.length == 0) {
            arsenicRes.status(404, "not found").body("<p>Not found</p>").end()
        } else {
            routes = routes.filter(route => route[0].matchMethod(arsenicReq))
            if (routes.length == 0) {
                arsenicRes.status(405, "method not allowed").body("<p>Method not allowed</p>").end()
            } else {
                routes = routes.filter(route => route[0].matchContentType(arsenicReq))
                if (routes.length == 0) {
                    arsenicRes.status(415, "unsupported media type").body("<p>Unsupported Media Type</p>").end()
                } else {
                    // parse params
                    let firstRoute = routes[0][0]
                    let firstParams = routes[0][1]
                    if (firstParams != null) {
                        arsenicReq.pathparams = firstParams
                        firstRoute.handle(arsenicReq, arsenicRes)
                    } else {
                        throw("should not happend")
                    }
                }
            }
        }
    }
 
    /**
     * Start a HTTP server on the given port and address and server this application.
     * 
     */
    public listen(port:number = 8080, bindAddress:string|null = null) {
        this.server = http.createServer(this.privhandler.bind(this))
        this.server.listen(port)
    }

    public close() {
        if (this.server != null) {
            this.server.close()
        }
    }

    public address():string|null|AddressInfo {
        if (this.server != null) {
            return this.server.address()
        } else {
            return null;
        }        
    }

     /**
     * Add a filter to this app.
     * 
     * @param filter 
     * 
     */
    public filter(filter:FilterType) {
        this.filters.push(filter)
    }
}
