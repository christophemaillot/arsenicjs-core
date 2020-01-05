import { PatternMatcher } from "./patternmatcher";
import { ArsenicRequest } from "./request";

import XRegExp = require("xregexp")
import { ArsenicResponse } from "./response";

export class Route {
    
    private _pattern: string
    private _method: string[] = []
    private _contentTypes: string[] = []
    private _target:Function|null = null
    private _regexp:RegExp

    constructor(pattern:string) {
        this._pattern = pattern
        const  p = "^" + pattern.replace(/:([a-zA-Z0-9]+)/g, "(?<_$1>[^\\/]+)") + "/?$"
        this._regexp = XRegExp(p)
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
    public target(target:Function) {
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

    public handle(req:ArsenicRequest, res:ArsenicResponse) {
        if (this._target != null) {
            this._target(req, res)
        }
    }
}