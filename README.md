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

# releases

## release 0.1.0

- initial release

## release 0.2.0

- add route-level filters

## todos

- make the framework more robust
- add app level error handlers
