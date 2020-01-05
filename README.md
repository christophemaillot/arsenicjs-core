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
    .route("/account/register")
    .method("PUT")
    .contentType("application/json")
    .target((req, res) => { 
      res.header("Content-Type: text/plain").body("OK").end()
    })

app.listen(port)
```
