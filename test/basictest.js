let { arsenic } = require('../dist/index')

//let portfinder = require("portfinder")
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;

chai.use(chaiHttp);

const PORT = 28087;

// ================================================================================================================================ //
//       set up default test arsenic app                                                                                            //
// ================================================================================================================================ //

let app = arsenic()
app.route("/about").method("GET").target((req, res) => { res.header("Content-Type","text/plain").body("OK").end() })
app.route("/user").method("POST").contentType("application/json").target((req, res) => { res.header("Content-Type","text/plain").body("done").end() })
app.route("/no/content").method("GET").target((req, res) => { res.status(204).end() })
app.route("/account/:id/metadata").method("GET").target((req, res) => { res.header("Content-Type","text/plain").body("account:" + req.pathparams.id).end() })

app.route("/custom-headers").method("GET").target((req, res) => {
    res.status(200)
    res.header("X-status", "synchronized")
    res.header("X-token", "1234")
    res.body("this response has headers")
    res.end()
})

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
    it('it should work properly when no Content-Type header is sent', (done) => {
        chai.request(app)
            .keepOpen()
            .get('/about')
            .unset("Content-Type")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
});

describe('GET /does/not/exists?yet', () => {
    it('it should return a not found status code', (done) => {
    chai.request(app)
        .keepOpen()
        .get('/does/not/exists?yet')
        .end((err, res) => {
            expect(res).to.have.status(404);
            done();
        });
    });
});

describe('GET /no/content', () => {
    it('it should return an empty body', (done) => {
    chai.request(app)
        .keepOpen()
        .get('/no/content')
        .end((err, res) => {
            expect(res).to.have.status(204);
            expect(res.body).to.be.empty
            done();
        });
    });
});

describe('the /user resource', () => {
    it('it should return a 405 status when GETed', (done) => {
        chai.request(app)
            .keepOpen()
            .get('/user')
            .end((err, res) => {
                expect(res).to.have.status(405);
                done();
            });
    });
    it('it should return a 415 status when POSTed with a text/plain content', (done) => {
        chai.request(app)
            .keepOpen()
            .post('/user')
            .set("Content-Type", "text/plain")
            .end((err, res) => {
                expect(res).to.have.status(415);
                done();
            });
    });
    it('it should return a 200 status when POSTed with a application/json content', (done) => {
        chai.request(app)
            .keepOpen()
            .post('/user')
            .set("Content-Type", "application/json")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('the /custom-headers resource', () => {
    it('it should has custom headers', (done) => {
        chai.request(app)
            .keepOpen()
            .get('/custom-headers')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.header("X-status", "synchronized")
                expect(res).to.have.header("X-token", "1234")
                done();
            });
    });
});

describe('the path parameters should be parsed accordingly ', () => {
    it('it should return the path parameter', (done) => {
        chai.request(app)
            .keepOpen()
            .get('/account/FB11465A-48B7-46BB-B6B1-00D2670F9180/metadata/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.be.eql("account:FB11465A-48B7-46BB-B6B1-00D2670F9180")
                done();
            });
    });
});
