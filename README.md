# arsenicjs-core

Core module of the ArsenicJS suite.

This is a early stage alpha project.

ArsenicJS is a lightweight node.js web framework.


# sample usage

```
const {arsenic} = require('@arsenicjs/core')

const DEFAULT_PORT = 8010
const port = process.env.PORT || DEFAULT_PORT

const app = arsenic()


// simple filter. req and resp can be altered to had features
const loggingFilter = (req, resp, next) => {
    console.log("- " , req.path);
    next(req, resp);
}

// simple GET route
app
    .route("/message/:id")
    .method("GET")
    .target((req, res) => { 
      res.header("Content-Type: text/plain").body("this is message " + req.pathparams.id).end()
    })

// more advanced PUT route with a content type restriction
app
    .route("/message/:id")
    .method("PUT")
    .contentType("application/json")
    .target((req, res) => { 
      // do something with message
      res.header("Content-Type: text/plain").body("message " + req.pathparams.id + " updated").end()
    })

app.listen(port)
```

# advanced usage with JSON handling

Here is a more advanced sample with JSON handling and JSON validation (using external libraries).

```
yarn add body jsonschema
```

The JSON schemas are defined and exported from some schema.js file.

```
const { arsenic } = require('@arsenicjs/core')

// load json frameworks
const jsonBody = require('body/json')
const validate = require('jsonschema').validate

const schemas = require('./schemas')

const app = arsenic()

// a filter that parses the body. Need more validation and error handling
const jsonFilter = (req, res, next) => {
    jsonBody(req.req, res.res, function (err, body) {
        if (err) {
            res.status(400, "bad request").header("Content-Type","text/plain").body("could not parse JSON").end()
        } else {
            req.json = body
            next(req, res)
        }
    })
}

const jsonValidateFilter = schema => (req, res, next) => {
    const result = validate(req.json, schema)
    if (result.errors.length == 0) {
        next(req, res)
    } else {
        res.status(400, "bad request").header("Content-Type","text/plain").body("schema validation failed").end()
        // would need to send back a JSON structure with the error messaged from the validation lib
    }
}

app.route("/register/submit")
    .method("POST")
    .contentType("application/json")
    .filter(jsonFilter)
    .filter(jsonValidateFilter(schemas.registerSubmitSchema))
    .target((req, res) => {
      // some handling here, body.json contains the data.
    });

const port = process.env.PORT || 8080
console.log(`listening at http://localhost:${port}/`)

app.listen(port)    
```




# releases

## release 0.1.0

- initial release

## release 0.2.0

- add route-level filters

## release 0.3.0

- more advanced sample in README
- fix filters applied in the wrong order

## todos

- make the framework more robust
- add app level error handlers
- make a nice README like this one : https://www.npmjs.com/package/commander

