const restaurant = require("../models/restaurant");
const menuCtrl = require("../controller/menu");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const transporter = require("../helper/email");

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
      avgPrice,
    } = resBody;

    if (
      !mobileNumber ||
      !fullName ||
      !fullName.trim() ||
      !address ||
      !address.trim() ||
      !state ||
      !state.trim() ||
      !email ||
      !email.trim() ||
      !city ||
      !city.trim() ||
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
          return;
        }
        menuCtrl
          .addMenu({ menu: [] })
          .then((res) => {
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
                  avgPrice,
                  menuId: res.result._id,
                });
                newrestaurant
                  .save()
                  .then((savedData) => {
                    if (!savedData) {
                      return reject({
                        status: 500,
                        result: {
                          error:
                            "please try again, error while saving restaurant to db",
                        },
                      });
                    }
                    const token = jwt.sign(
                      {
                        restaurantId: savedData._id.toString(),
                      },
                      process.env.JWT_KEY,
                      {
                        expiresIn: "1h",
                      }
                    );
                    resolve({
                      status: 201,
                      result: {
                        message: "Restaurant Created Successfully",
                        token,
                      },
                    });
                    // return transporter.sendMail({
                    //   to: email,
                    //   from: `${process.env.EMAIL}`,
                    //   subject: "Signup Successful!!",
                    //   html: `<h1>SnapDelivery Welcomes You.</h1><p>Hi ${fullName} Thanks For Sigining Up!.Get your first client by successfully uploading your menu.</p>`,
                    // });
                  })
                  .catch((err) => {
                    reject({ status: 500, result: { errors: err } });
                  });
              })
              .catch((err) => reject({ status: 500, result: { error: err } }));
          })
          .catch((err) => reject({ status: 500, result: { error: err } }));
      })
      .catch((err) => reject({ status: 500, result: { error: err } }));
  });
};

const updateRestaurant = (resBody) => {
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
      avgPrice,
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
    restaurant
      .findOne({
        email,
      })
      .then((user) => {
        if (!user) {
          reject({
            status: 404,
            result: {
              error: "Restaurant Does Not Exists",
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
                avgPrice,
              };
              restaurant
                .updateOne({ email }, updateData)
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
                      message: "Restaurant Updated Successfully Successfully",
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

          restaurant
            .updateOne({ email }, updateData, { new: true })
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
                result: { message: "Restaurant Data Updated Successfully" },
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
const loginrestaurant = (resBody) => {
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
          return;
        }

        bcrypt
          .compare(password, restaurant.password)
          .then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign(
                {
                  restaurantId: restaurant._id.toString(),
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
          .catch((err) => reject({ status: 500, result: { error: err } }));
      })
      .catch((err) => reject({ status: 500, result: { error: err } }));
  });
};

const getRestaurant = (id, menu) => {
  return new Promise((resolve, reject) => {
    if (menu) {
      restaurant
        .findOne({ _id: mongoose.Types.ObjectId(id) })
        .populate("menuId")
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
        .catch((err) => reject({ status: 500, result: { error: err } }));
    } else {
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
            return;
          }
          resolve({
            status: 200,
            result: {
              restaurant,
            },
          });
        })
        .catch((err) => reject({ status: 500, result: { error: err } }));
    }
  });
};

const getRestaurants = (city, q, start, end) => {
  return new Promise((resolve, reject) => {
    const matchCondition = {};
    if (city && city.trim() != "") {
      matchCondition.city = city;
    }
    if (q && q.trim() != "") {
      matchCondition["menu.menu.name"] = {
        $regex: new RegExp(q),
        $options: "i",
      };
    }
    if (start && end) {
      matchCondition.avgPrice = { $lte: parseInt(end), $gte: parseInt(start) };
    } else if (start) {
      matchCondition.avgPrice = { $gte: parseInt(start) };
    } else if (end) {
      matchCondition.avgPrice = { $lte: parseInt(end) };
    }
    restaurant
      .aggregate([
        {
          $lookup: {
            from: "menus",
            localField: "menuId",
            foreignField: "_id",
            as: "menu",
          },
        },
        { $unwind: "$menu" },
        { $match: matchCondition },
      ])
      .then((restaurants) => {
        if (!restaurants) {
          reject({
            status: 404,
            result: {
              error: "Restaurants Does Not exist",
            },
          });
          return;
        }
        resolve({
          status: 200,
          result: {
            restaurants,
          },
        });
      })
      .catch((err) => reject({ status: 500, result: { error: err } }));
  });
};

const fetchRestuarant = (id) => {
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
          return;
        }
        resolve({
          status: 200,
          result: {
            restaurant,
          },
        });
      })
      .catch((err) => reject({ status: 500, result: { error: err } }));
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
          return;
        }

        return menuCtrl.deleteMenuForever(deleterestaurant.menuId);
      })
      .then((res) => {
        resolve({
          status: 200,
          result: {
            message: "Deleted Successfully",
          },
        });
      })
      .catch((err) => reject({ status: 500, result: { error: err } }));
  });
};
module.exports = {
  addrestaurant,
  updateRestaurant,
  loginrestaurant,
  getRestaurant,
  getRestaurants,
  fetchRestuarant,
  deleteRestaurant,
};
