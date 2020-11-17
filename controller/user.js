const User = require("../models/user");

const addUser = (resBody) => {
  return new Promise((resolve, reject) => {
    const {
      mobileNumber,
      fullName,
      email,
      age,
      gender,
      state,
      city,
      pincode,
    } = resBody;

    if (
      !mobileNumber ||
      !fullName.trim() ||
      !state.trim() ||
      !city.trim() ||
      !pincode
    )
      reject({
        status: 400,
        result: {
          error: "Please provide all the Information",
        },
      });

    const newUser = new User({
      fullName,
      mobileNumber,
      email,
      gender,
      age,
      state,
      city,
      pincode,
    });
    newUser
      .save()
      .then((savedData) => {
        if (!savedData)
          return reject({
            status: 500,
            result: {
              error: "please try again, error while saving user to db",
            },
          });
        resolve({
          status: 201,
          result: { message: "User Created Successfully" },
        });
      })
      .catch((err) => {
        reject({ status: 500, result: { errors: err } });
      });
  });
};

module.exports = {
  addUser,
};
