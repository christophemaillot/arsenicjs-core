import { OutgoingMessage, ServerResponse } from "http";

export class ArsenicResponse {
    
    private res: ServerResponse;

    constructor(res:ServerResponse) {
        this.res = res
    }

    public status(code:number, message:string|null = null) {
        this.res.statusCode = code
        if (message != null) {
            this.res.statusMessage = message
        }
        return this
    }

    public header(key:string, value:string) {
        this.res.setHeader(key, value)
        return this
    }

    public body(content:string) {
        this.res.write(content, "UTF-8")
        return this
    }

    public end() {
        this.res.end()
    }
}