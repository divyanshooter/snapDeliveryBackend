const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

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
                if (!savedData)
                  reject({
                    status: 500,
                    result: {
                      error: "please try again, error while saving user to db",
                    },
                  });
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

const loginUser = (resBody) => {
  return new Promise((resolve, reject) => {
    const { email, password } = resBody;
    if (!email.trim() || !password.trim())
      reject({
        status: 400,
        result: {
          error: "Please provide all the Information",
        },
      });

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
  getUser,
  deleteUser,
};
