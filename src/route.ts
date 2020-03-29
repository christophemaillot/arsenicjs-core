
import XRegExp = require("xregexp")
import { ArsenicResponse } from "./response";
import { ArsenicRequest } from "./request";
import Application, {FilterType} from "./application";

export class Route {
    
    private _app: Application;
    private _method: string[] = []
    private _contentTypes: string[] = []
    private _target:((req:ArsenicRequest, resp:ArsenicResponse)=>void)|null = null
    private _regexp:RegExp
    private _pattern: string

    private _filters: Array<(req:ArsenicRequest, resp:ArsenicResponse, next:(req:ArsenicRequest, resp:ArsenicResponse)=>void)=>void> = [];

    constructor(app:Application, pattern:string) {

        const  p = "^" + pattern.replace(/:([a-zA-Z0-9]+)/g, "(?<_$1>[^\\/]+)").replace(/\*/, "(?<_$1>.*)") + "/?$"
        this._regexp = XRegExp(p)
        this._pattern = p
        this._app = app
    }

    /**
     * Set the method of this route.
     */
    public method(method:string) {
        this._method.push(method)
        return this
    }

    /**
     * Adds a content type to the list of content types handled by this route.
     * 
     * @param contentType a non null content type string
     */
    public contentType(contentType:string) {
        if (this._contentTypes == null) {
            this._contentTypes = []
        }
        this._contentTypes.push(contentType)
        return this
    }

    /**
     * Set the target handler of this route.
     * @param target a non null handler function
     */
    public target(target:((req:ArsenicRequest, resp:ArsenicResponse)=>void)) {
        this._target = target;
        return this
    }

    public matchPath(req:ArsenicRequest): { [key: string]: string }|null {
        let array = XRegExp.exec(req.path, this._regexp) as any
        if (array == null) {
            return null;
        } else {
            const result:{[key:string]:string} =  {}
            Object.keys(array).forEach(key => {
               if (key.startsWith("_")) {
                   result[key.substr(1)] = array[key]
               } 
            });
            return result;
        }
    }

    public matchMethod(req:ArsenicRequest): boolean {
        return this._method.length == 0 || this._method.includes(req.method)
    }

    public matchContentType(req:ArsenicRequest): boolean {
        return this._contentTypes.length == 0 || this._contentTypes.includes(req.contentType)
    }

    public handle(req:ArsenicRequest, resp:ArsenicResponse) {
        this._handle(req, resp, this._filters);
    }

    public _handle(req:ArsenicRequest, resp:ArsenicResponse, filters:Array<FilterType>) {
        if (filters.length == 0) {
            if (this._target != null) {
                this._target(req, resp);
            }
        } else {
            let filter = filters.shift()

            let next = (areq:ArsenicRequest, aresp:ArsenicResponse) => {
                if (areq == null) {
                    throw("next() function call with a null request instance.")
                }
                if (aresp == null) {
                    throw("next() function call with a null response instance.")
                }
                this._handle(areq, aresp, filters)
            }
            if (filter) {
                filter(req, resp, next.bind(this));
            }
        }
    }

    /**
     * Add a filter to this route.
     * 
     * @param filter 
     * 
     */
    public filter(filter:(req:ArsenicRequest, resp:ArsenicResponse, next:(req:ArsenicRequest, resp:ArsenicResponse)=>void)=>void) {
        this._filters.push(filter)
        return this;
    }

}