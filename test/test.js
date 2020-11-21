const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("TESTING", function () {
  let token;
  it("should return string ", function (done) {
    this.timeout(10000);
    chai.request(app)
      .get("/")
      .end(function (err, res) {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Working,Welcome To SnapDelivery');
        done();
      });
  });

  it("should say incomplete detail while creating data", function(done){ 

    this.timeout(10000);

    const data = {mobileNumber : 1234567890,
      password : "pass123",
      fullName : "test user",
      email :  "test@gmail.com",
      age : "50",
      gender : "T",
      state : "UP",
      city : "Mirzapur"};


      chai.request(app)
      .post("/app/user/create")
      .send(data)
      .set("Accept", "application/json")
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return done(err);
        }
        res.should.have.status(400);
        res.body.should.have.property('error').eql('Please provide all the Information');
        done();
      });
  });

  it("should create a test user", function(done) {
    this.timeout(10000);
    const data = {mobileNumber : 1234567890,
      password : "pass123",
      fullName : "test user",
      email :  "test@gmail.com",
      age : "50",
      gender : 'MALE',
      state : "UP",
      city : "Mirzapur",
      pincode : "2310001",
    };

      chai.request(app)
      .post("/app/user/create")
      .send(data)
      .set("Accept", "application/json")
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return done(err);
        }
        console.log(res.body);
        res.should.have.status(200);
        done();
      });

  });
  it("should respond with token for user login", function (done) {
    this.timeout(10000);
    const data = {
      email: "test@gmail.com",
      password: "password",
    };

    chai.chai.request(app)
      .post("/app/user/login")
      .send(data)
      .set("Accept", "application/json")
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        done();
      });
  });
  it("should fetch user", function (done) {
    this.timeout(10000);

    chai.request(app)
      .get("/app/user/fetch")
      .set("Accept", "application/json")
      .set("Authorization","bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmI4YjczNjE1MjJmMTEyNzQ2ZDk4MTciLCJpYXQiOjE2MDU5NTAwNjEsImV4cCI6MTYwNTk1MzY2MX0.2md0glk_u1UrHvL7SzitsNqdFswZIY-e74gILCL6_M0")
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  after(function () {
    app.stop();
  });
});
