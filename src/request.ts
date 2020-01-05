import { IncomingMessage } from "http";


interface PathParams {
    [key: string]: string
}

export class ArsenicRequest {

    private req: IncomingMessage

    public path: string 
    public method: string
    public contentType: string
    public pathparams: PathParams
    public queryparams: object

    constructor(req:IncomingMessage) {
        this.req = req
        this.path = req.url || ""
        this.method = req.method || ""
        this.contentType = req.headers["content-type"] || ""
        this.pathparams = {}
        this.queryparams = {}
    }

}