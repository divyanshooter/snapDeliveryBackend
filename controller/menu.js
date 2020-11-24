const menuModel = require("../models/menu");
const mongoose = require("mongoose");

const addMenu = (resBody) => {
  return new Promise((resolve, reject) => {
    const newMenu = new menuModel(resBody);
    newMenu
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

const updateMenu = (id, resBody) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject({
        stautus: 404,
        result: { error: "Menu does not exist" },
      });
    }
    if (!resBody.menu) {
      reject({
        status: 400,
        result: {
          error: "Please provide all the Information",
        },
      });
    }
    resBody.menu.map((item) => {
      if (!item.name || !item.price || !item.description) {
        reject({
          status: 400,
          result: {
            error: "Please provide all the Information",
          },
        });
      }
    });
    menuModel
      .updateOne({ _id: mongoose.Types.ObjectId(id) }, resBody)
      .then((updatedMenu) => {
        if (!updatedMenu) {
          reject({
            status: 404,
            result: {
              error: "Menu does not exists",
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
      .replaceOne({ _id: mongoose.Types.ObjectId(id) }, { menu: [] })
      .then((deletedMenu) => {
        if (!deletedMenu) {
          reject({
            status: 404,
            result: {
              error: "Menu does not exist",
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

const deleteMenuForever = (id) => {
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
  addMenu,
  updateMenu,
  getMenu,
  deleteMenu,
  deleteMenuForever,
};
