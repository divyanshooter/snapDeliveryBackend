const menuModel = require("../models/menu");
const mongoose = require("mongoose");

const addrestaurant = (resBody) => {
  return new Promise((resolve, reject) => {
    menuModel
      .save()
      .then((savedData) => {
        if (!savedData)
          return reject({
            status: 500,
            result: {
              error: "please try again, error while saving restaurant to db",
            },
          });

        resolve({
          status: 201,
          result: { message: "Menu Created Successfully", _id: savedData._id },
        });
      })
      .catch((err) => {
        reject({ status: 500, result: { errors: err } });
      });
  });
};

const updateMenu = (resBody) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject({
        stautus: 404,
        result: { error: "Menu does not exist" },
      });
    }
    resBody.data.forEach((item) => {
      if (!item.price || !item.description) {
        reject({
          status: 400,
          result: {
            error: "Please provide all the Information",
          },
        });
      }
    });
    menuModel
      .updateOne({ _id: mongoose.Types.ObjectId(resBody._id) }, resBody.data)
      .then((updatedMenu) => {
        if (!updatedMenu) {
          reject({
            status: 404,
            result: {
              error: "Menu does not exists ",
            },
          });
        }
        resolve({
          status: 200,
          result: { message: "The Menu Successfully Updated" },
        });
      })
      .catch((err) =>
        reject({ status: 500, result: { error: "Not able to update" } })
      );
  });
};

const getMenu = (id) => {
  return new Promise((resolve, reject) => {
    menuModel
      .findOne({ _id: mongoose.Types.ObjectId(id) })
      .then((menu) => {
        if (!menu) {
          reject({
            status: 404,
            result: {
              error: "Menu Does Not exist",
            },
          });
        }
        resolve({
          status: 200,
          result: {
            menu,
          },
        });
      })
      .catch((err) => reject({ status: 500, result: { error: err } }));
  });
};

const deleteMenu = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject({
        stautus: 404,
        result: { error: "Menu does not exist" },
      });
    }
    menuModel
      .findOneAndDelete({ _id: mongoose.Types.ObjectId(id) })
      .then((deletedMenu) => {
        if (!deletedMenu) {
          reject({
            status: 404,
            result: {
              error: "Menu d0oes not exist",
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
      .catch((err) => reject({ status: 500, result: { error: err } }));
  });
};
module.exports = {
  addrestaurant,
  updateMenu,
  getMenu,
  deleteMenu,
};
