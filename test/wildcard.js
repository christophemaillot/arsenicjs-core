let { arsenic } = require('../dist/index')

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;

chai.use(chaiHttp);

const PORT = 28088;

// ================================================================================================================================ //
//       set up default test arsenic app                                                                                            //
// ================================================================================================================================ //

let app = arsenic()

app.route("/about").method("GET").target((req, res) => { res.header("Content-Type","text/plain").body("OK").end() })
app.route("/user/*").method("GET").target((req, res) => { res.header("Content-Type","text/plain").body("user").end() })
app.route("/*").method("GET").target((req, res) => { res.status(200).body("all").end() })

app.listen(PORT)

after(() => { setTimeout(() => process.exit(), 0) })

// ================================================================================================================================ //
//       basic smock tests                                                                                                          //
// ================================================================================================================================ //

describe('GET /about', () => {
    it('it should GET a default text/plain message', (done) => {
        chai.request(app)
            .keepOpen()
            .get('/about')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.header("Content-Type", "text/plain")
                expect(res).to.be.text;
                expect(res.text).to.be.eql("OK")
                done();
            });
    });
});

describe('the /user/* route', () => {
    it('shoud match when app called on the root path (/user)', (done) => {
        chai.request(app)
            .keepOpen()
            .get('/user/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.be.eql("user")
                done();
            });
    })
    it('shoud match when app called on the sub path with one path component (/user/18)', (done) => {
        chai.request(app)
            .keepOpen()
            .get('/user/18')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.be.eql("user")
                done();
            });
    it('shoud match should return a value a deep path', (done) => {
        chai.request(app)
            .keepOpen()
            .get('/user/18/profile')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.be.eql("user")
                done();
            });
        })
    })
})



