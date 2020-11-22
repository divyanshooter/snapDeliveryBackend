// const app = require("../app");
// const chai = require("chai");
// const chaiHttp = require("chai-http");

// chai.use(chaiHttp);

// describe("TESTING", function () {
//   let token;
//   it("should return string ", function () {
//     chai
//       .request(app)
//       .get("/")
//       .end(function (err, res) {
//         expect(err).to.be.null();
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.be.equal("Working,Welcome To SnapDelivery");
//       });
//   });
//   //   it("should respond with token for user login", (done) => {
//   //     try {
//   //       chai
//   //         .request(app)
//   //         .post("/app/user/login")
//   //         .send({
//   //           email: "test@gmail.com",
//   //           password: "password",
//   //         })
//   //         .end((err, res) => {
//   //           if (err) {
//   //             done(err);
//   //           } else {
//   //             done();
//   //           }
//   //           // expect(res).to.have.status(200);
//   //           // expect(res.body.message).to.be.equal("Working,Welcome To SnapDelivery");
//   //         });
//   //     } catch (err) {
//   //       console.log(err);
//   //     }
//   //   });

//   //   it("should respond with user", (done) => {
//   //     try {
//   //       chai
//   //         .request(app)
//   //         .get("/app/user/fetch")
//   //
//   //         .end((err, res) => {
//   //           if (err) {
//   //             done(err);
//   //           } else {
//   //             res.should.have.status(200);
//   //             res.should.be.a("object");
//   //             done();
//   //           }
//   //           // expect(res).to.have.status(200);
//   //           // expect(res.body.message).to.be.equal("Working,Welcome To SnapDelivery");
//   //         });
//   //     } catch (err) {
//   //       console.log(err);
//   //     }
//   //   });
// });
