const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const restaurant = require("../models/restaurant");
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

    this.timeout(100000);

    const data = {mobileNumber : 1234567890,
      password : "pass123",
      fullName : "test user",
      email :  "test@gmail.com",
      age : "50",
      gender : "Male",
      state : "UP",
      city : "Mirzapur",
      address : "Test address",
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
      email :  "test1@gmail.com",
      age : "50",
      gender : 'MALE',
      state : "UP",
      city : "Mirzapur",
      pincode : "2310001",
      address : "test address",
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
        res.should.have.status(201);
        res.body.should.have.property('message').eql("User Created Successfully");
        res.body.should.have.property('token');

        token = res.body.token;
        
        done();
      });

  });

  it("should say user already exist", function(done) {
    this.timeout(10000);
    const data = {mobileNumber : 1234567890,
      password : "pass123",
      fullName : "test user",
      email :  "test1@gmail.com",
      age : "50",
      gender : 'MALE',
      state : "UP",
      city : "Mirzapur",
      pincode : "2310001",
      address : "test address",
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
        res.should.have.status(403);
        res.body.should.have.property('error').eql("Email Already Exists");
        done();
      });
  });

  it("should respond with token for user login", function (done) {
    this.timeout(10000);
    const data = {
      email: "test1@gmail.com",
      password: "pass123",
    };

    chai.request(app)
      .post("/app/user/login")
      .send(data)
      .set("Accept", "application/json")
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        res.body.should.have.property('message').eql('User Logged In Successfully');
        res.body.should.have.property('token');
        token = res.body.token;
        done();
      });
   });

  it("should fetch user", function (done) {
    this.timeout(10000);

    chai.request(app)
      .get("/app/user/fetch")
      .set("Accept", "application/json")
      .set("Authorization","bearer "+token)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it("should delete a the test user", function(done) {
    this.timeout(10000);

    chai.request(app)
      .delete("/app/user/delete")
      .set("Accept", "application/json")
      .set("Authorization","bearer "+token)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it("should say user not found", function(done) {
    this.timeout(10000);

    chai.request(app)
      .get("/app/user/fetch")
      .set("Accept", "application/json")
      .set("Authorization","bearer "+token)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.should.have.status(404);
        res.body.should.have.property('error').eql("User Does Not exist");
        done();
      });
  });
  
  after(function () {
    app.stop();
  });
});
