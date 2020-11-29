const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const transporter = require("../helper/email");
const { updateOne } = require("../models/user");

const addUser = (resBody) => {
  return new Promise((resolve, reject) => {
    const {
      mobileNumber,
      password,
      fullName,
      address,
      email,
      age,
      gender,
      state,
      city,
      pincode,
    } = resBody;
    if (
      !mobileNumber ||
      !fullName ||
      !fullName.trim() ||
      !state ||
      !state.trim() ||
      !email ||
      !email.trim() ||
      !city ||
      !city.trim() ||
      !address ||
      !address.trim() ||
      !password ||
      !password.trim() ||
      !pincode
    ) {
      reject({
        status: 400,
        result: {
          error: "Please provide all the Information",
        },
      });
      return;
    }
    User.findOne({
      email,
    })
      .then((user) => {
        if (user) {
          reject({
            status: 403,
            result: {
              error: "Email Already Exists",
            },
          });
          return;
        }
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const newUser = new User({
              fullName,
              mobileNumber,
              password: hashedPassword,
              email,
              gender,
              age,
              state,
              address,
              city,
              pincode,
            });
            newUser
              .save()
              .then((savedData) => {
                if (!savedData) {
                  reject({
                    status: 500,
                    result: {
                      error: "please try again, error while saving user to db",
                    },
                  });
                  return;
                }
                const token = jwt.sign(
                  {
                    userId: savedData._id.toString(),
                  },
                  process.env.JWT_KEY,
                  {
                    expiresIn: "1h",
                  }
                );
                resolve({
                  status: 201,
                  result: { message: "User Created Successfully", token },
                });
                // return transporter.sendMail({
                //   to: email,
                //   from: `${process.env.EMAIL}`,
                //   subject: "Signup Successful!!",
                //   html: `<h1>SnapDelivery Welcomes You.</h1><p>Hi ${fullName} <br>Order your first food and get lots of offers.Why to be hungry when you have SnapDelivery<br>
                //   Order now!! </p>`,
                // });
              })
              .catch((err) => {
                reject({ status: 500, result: { errors: err } });
              });
          })
          .catch((err) =>
            reject({ status: 500, result: { error: "Server Error" } })
          );
      })
      .catch((err) =>
        reject({ status: 500, result: { error: "Server Error" } })
      );
  });
};

const updateUser = (resBody) => {
  return new Promise((resolve, reject) => {
    const {
      mobileNumber,
      password,
      fullName,
      address,
      email,
      age,
      gender,
      state,
      city,
      pincode,
    } = resBody;
    if (
      !mobileNumber ||
      !fullName ||
      !fullName.trim() ||
      !state ||
      !state.trim() ||
      !email ||
      !email.trim() ||
      !city ||
      !city.trim() ||
      !address ||
      !address.trim() ||
      !pincode
    ) {
      reject({
        status: 400,
        result: {
          error: "Please provide all the Information",
        },
      });
      return;
    }
    User.findOne({
      email,
    })
      .then((user) => {
        if (!user) {
          reject({
            status: 404,
            result: {
              error: "User Does Not Exists",
            },
          });
          return;
        }
        if (password && password.trim()) {
          bcrypt
            .hash(password, 12)
            .then((hashedPassword) => {
              const updateData = {
                fullName,
                mobileNumber,
                password: hashedPassword,
                email,
                gender,
                age,
                state,
                address,
                city,
                pincode,
              };
              User.updateOne({ email }, updateData)
                .then((updatedData) => {
                  if (!updatedData) {
                    reject({
                      status: 500,
                      result: {
                        error:
                          "please try again, error while saving user to db",
                      },
                    });
                    return;
                  }
                  resolve({
                    status: 201,
                    result: {
                      message: "User Updated Successfully Successfully",
                    },
                  });
                })
                .catch((err) => {
                  console.log(err);
                  reject({ status: 500, result: { errors: err } });
                });
            })
            .catch((err) =>
              reject({ status: 500, result: { error: "Server Error" } })
            );
        } else {
          const updateData = {
            fullName,
            mobileNumber,
            password: user.password,
            email,
            gender,
            age,
            state,
            address,
            city,
            pincode,
          };

          User.updateOne({ email }, updateData, { new: true })
            .then((savedData) => {
              if (!savedData) {
                reject({
                  status: 500,
                  result: {
                    error: "please try again, error while saving user to db",
                  },
                });
                return;
              }
              resolve({
                status: 200,
                result: { message: "User Updated Successfully" },
              });
            })
            .catch((err) => {
              reject({ status: 500, result: { errors: err } });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        reject({ status: 500, result: { error: "Server Error" } });
      });
  });
};
const loginUser = (resBody) => {
  return new Promise((resolve, reject) => {
    const { email, password } = resBody;
    if (!email.trim() || !password.trim()) {
      reject({
        status: 400,
        result: {
          error: "Please provide all the Information",
        },
      });
      return;
    }

    User.findOne({
      email,
    })
      .then((user) => {
        if (!user) {
          reject({
            status: 404,
            result: {
              error: "User Does Not exist",
            },
          });
          return;
        }

        bcrypt
          .compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign(
                {
                  userId: user._id.toString(),
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h",
                }
              );

              resolve({
                status: 200,
                result: { message: "User Logged In Successfully", token },
              });
            } else {
              reject({
                status: 404,
                result: {
                  error: "User Does Not exist",
                },
              });
            }
          })
          .catch((err) =>
            reject({ status: 500, result: { error: "Server Error" } })
          );
      })
      .catch((err) =>
        reject({ status: 500, result: { error: "Server Error" } })
      );
  });
};

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: mongoose.Types.ObjectId(id) })
      .then((user) => {
        if (!user) {
          reject({
            status: 404,
            result: {
              error: "User Does Not exist",
            },
          });
          return;
        }
        resolve({
          status: 200,
          result: {
            user,
          },
        });
      })
      .catch((err) =>
        reject({ status: 500, result: { error: "Server Error" } })
      );
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    User.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) })
      .then((deleteUser) => {
        if (!deleteUser) {
          reject({
            status: 404,
            result: {
              error: "User Does Not exist",
            },
          });
          return;
        }
        resolve({
          status: 200,
          result: {
            deleteUser,
          },
        });
      })
      .catch((err) =>
        reject({ status: 500, result: { error: "Server Error" } })
      );
  });
};
module.exports = {
  addUser,
  loginUser,
  updateUser,
  getUser,
  deleteUser,
};
