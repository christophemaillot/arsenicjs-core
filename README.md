# arsenicjs-core

Core module of the ArsenicJS suite.

This is a early stage alpha project.

ArsenicJS is a lightweight node.js web framework.


# sample usage

```
const {arsenic} = require('@arsenic/core')

const DEFAULT_PORT = 8010
const port = process.env.PORT || DEFAULT_PORT

const app = arsenic()

app
    .route("/message/:id")
    .method("GET")
    .target((req, res) => { 
      res.header("Content-Type: text/plain").body("this is message " + req.pathparams.id).end()
    })

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
