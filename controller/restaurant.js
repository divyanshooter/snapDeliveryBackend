const restaurant = require("../models/restaurant");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const addrestaurant = (resBody) => {
  return new Promise((resolve, reject) => {
    const {
      mobileNumber,
      password,
      fullName,
      email,
      age,
      gender,
      state,
      city,
      address,
      pincode,
    } = resBody;

    if (
      !mobileNumber ||
      !fullName.trim() ||
      !address.trim() ||
      !state.trim() ||
      !email.trim() ||
      !city.trim() ||
      !password.trim() ||
      !pincode
    )
      reject({
        status: 400,
        result: {
          error: "Please provide all the Information",
        },
      });

    restaurant
      .findOne({ email })
      .then((response) => {
        if (response) {
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
            const newrestaurant = new restaurant({
              fullName,
              mobileNumber,
              password: hashedPassword,
              email,
              address,
              gender,
              age,
              state,
              city,
              pincode,
            });
            newrestaurant
              .save()
              .then((savedData) => {
                if (!savedData)
                  return reject({
                    status: 500,
                    result: {
                      error:
                        "please try again, error while saving restaurant to db",
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
                  result: { message: "Restaurant Created Successfully", token },
                });
              })
              .catch((err) => {
                reject({ status: 500, result: { errors: err } });
              });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

const loginrestaurant = (resBody) => {
  return new Promise((resolve, reject) => {
    const { email, password } = resBody;
    if (!email.trim() || !password.trim())
      reject({
        status: 400,
        result: {
          error: "Please provide all the Information",
        },
      });

    restaurant
      .findOne({
        email,
      })
      .then((restaurant) => {
        if (!restaurant) {
          reject({
            status: 404,
            result: {
              error: "Restaurant Does Not exist",
            },
          });
        }

        bcrypt
          .compare(password, restaurant.password)
          .then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign(
                {
                  userId: restaurant._id.toString(),
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h",
                }
              );

              resolve({
                status: 200,
                result: { message: "Restaurant Logged In Successfully", token },
              });
              return;
            } else {
              reject({
                status: 404,
                result: {
                  error: "Restaurant Does Not exist",
                },
              });
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

const getRestaurant = (id) => {
  console.log(id);
  return new Promise((resolve, reject) => {
    restaurant
      .findOne({ _id: mongoose.Types.ObjectId(id) })
      .then((restaurant) => {
        if (!restaurant) {
          reject({
            status: 404,
            result: {
              error: "Restaurant Does Not exist",
            },
          });
        }
        resolve({
          status: 200,
          result: {
            restaurant,
          },
        });
      })
      .catch((err) => console.log(err));
  });
};

const getRestaurants = (city) => {
  return new Promise((resolve, reject) => {
    restaurant
      .find({ city })
      .then((restaurants) => {
        if (!restaurants) {
          reject({
            status: 404,
            result: {
              error: "Restaurants Does Not exist",
            },
          });
        }
        resolve({
          status: 200,
          result: {
            restaurants,
          },
        });
      })
      .catch((err) => console.log(err));
  });
};

const deleteRestaurant = (id) => {
  return new Promise((resolve, reject) => {
    restaurant
      .findOneAndDelete({ _id: mongoose.Types.ObjectId(id) })
      .then((deleterestaurant) => {
        if (!deleterestaurant) {
          reject({
            status: 404,
            result: {
              error: "Restaurant Does Not exist",
            },
          });
        }
        resolve({
          status: 200,
          result: {
            message: "Deleted Successfully",
          },
        });
      })
      .catch((err) => console.log(err));
  });
};
module.exports = {
  addrestaurant,
  loginrestaurant,
  getRestaurant,
  getRestaurants,
  deleteRestaurant,
};