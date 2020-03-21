const { arsenic } = require("../dist/")
const {ConsoleLogger} = require("../dist/logger")

const app = arsenic()

app.route("/about/:id").method("GET").target(function(req, res) { 
    res.header("Content-Type", "text/plain").body("OK " + req.pathparams.id).end()
});

app.listen(8090);