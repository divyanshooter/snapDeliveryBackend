// var should = require("should");
const app = require("../app");
const request = require("supertest");

describe("GET /", function () {
  it("should return string ", function (done) {
    request(app)
      .get("/")
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  //   it("should respond with redirect on post", function (done) {
  //     // need help here
  //   });
  after(function () {
    app.stop();
  });
});
