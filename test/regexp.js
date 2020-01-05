const XRegExp = require("xregexp")


const regexp = new XRegExp("^/account/(?<_id>[^\/]+)/metadata/?$")

console.log(XRegExp.exec("/account/123-ezrz/metadata", regexp))