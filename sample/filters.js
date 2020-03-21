const { arsenic } = require("../dist/")

const app = arsenic()

const timingFilter = (req, resp, next) => {
    const t0 = Date.now()
    next(req, resp);
    const t1 = Date.now()
    console.log("  => ", (t1-t0), " ms")
}

const loggingFilter = (req, resp, next) => {
    console.log("- " , req.path);
    next(req, resp);
}

app.route("/about/:id").method("GET").filter(loggingFilter).filter(timingFilter).target(function(req, resp) { 
    resp.header("Content-Type", "text/plain").body("OK " + req.pathparams.id).end()
});

app.listen(8090);