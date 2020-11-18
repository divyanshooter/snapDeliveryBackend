// var should = require("should");
const app = require("../app");
const request = require("supertest");

describe("TESTING", function () {
  let token;
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
  // it("should respond with token for user login", function (done) {
  //   const data = {
  //     email: "test@gmail.com",
  //     password: "password",
  //   };
  //   request(app)
  //     .post("/app/user/login")
  //     .send(data)
  //     .set("Accept", "application/json")
  //     .expect(200)
  //     .expect("Content-Type", /json/)
  //     .end(function (err, res) {
  //       if (err) {
  //         return done(err);
  //       }

  //       done();
  //     });
  // });
  after(function () {
    app.stop();
  });
});
