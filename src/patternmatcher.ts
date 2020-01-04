
import XRegExp = require("xregexp")

export class PatternMatcher {

    private patterns: [string, any, RegExp][] = []

    public add(pattern:string, target:any) {
        const p = "^" + pattern.replace(/:([a-zA-Z0-9]+)/g, "(?<$1>[^\\/]+)") + "/?$";
        //this.patterns.push([pattern, target, ])
    }

    public findMatching(url:string|undefined):any[] {
        if (url != null) {
            return this.patterns.filter(item => XRegExp.match(url, item[2])).map(item => item[1])
        } else {
            return []
        }
    }
}