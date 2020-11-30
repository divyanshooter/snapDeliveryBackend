const orderModel = require("../models/order");
const mongoose = require("mongoose");

const addOrder = (userId, resBody) => {
  return new Promise((resolve, reject) => {
    let totalPrice = 0;

    resBody.order.map((item) => {
      if (!item.name || !item.price || !item.description || !item.qty) {
        return reject({
          status: 400,
          result: {
            error: "Please provide all the Information",
          },
        });
      } else {
        totalPrice += parseFloat(item.price) * parseInt(item.qty);
      }
    });

    const newOrder = new orderModel({
      userId,
      restaurantId: resBody.restaurantId,
      address: resBody.address,
      order: resBody.order,
      totalPrice,
      orderPlaced: new Date(),
      status: "Placed",
    });
    newOrder
      .save()
      .then((savedData) => {
        if (!savedData)
          return reject({
            status: 500,
            result: {
              error: "please try again, error while saving order to db",
            },
          });

        resolve({
          status: 201,
          result: {
            message: "Order Created Successfully",
            _id: savedData._id,
          },
        });
      })
      .catch((err) => {
        reject({ status: 500, result: { errors: err } });
      });
  });
};

const updateOrder = (restaurantId, resBody) => {
  return new Promise((resolve, reject) => {
    if (!restaurantId || !resBody._id) {
      return reject({
        stautus: 401,
        result: { error: "Not Authorized" },
      });
    }
    if (resBody.totalPrice || resBody.order) {
      return reject({
        stautus: 401,
        result: { error: "Not Authorised" },
      });
    }

    orderModel
      .updateOne(
        {
          _id: mongoose.Types.ObjectId(resBody._id),
          restaurantId: mongoose.Types.ObjectId(restaurantId),
        },
        resBody
      )
      .then((updatedOrder) => {
        console.log(updatedOrder);
        if (!updatedOrder || !updatedOrder.n) {
          return reject({
            status: 404,
            result: {
              error: "Order does not exists",
            },
          });
        }
        resolve({
          status: 200,
          result: { message: "The Order Successfully Updated" },
        });
      })
      .catch((err) =>
        reject({ status: 500, result: { error: "Not able to update" } })
      );
  });
};

const getOrder = (id) => {
  return new Promise((resolve, reject) => {
    console.log(id);
    orderModel
      .findOne({ _id: mongoose.Types.ObjectId(id) })
      .populate("userId")
      .populate("restaurantId")
      .then((order) => {
        if (!order) {
          return reject({
            status: 404,
            result: {
              error: "Order Does Not exist",
            },
          });
        }
        console.log(order);
        resolve({
          status: 200,
          result: {
            order,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        reject({ status: 500, result: { error: err } });
      });
  });
};

const getOrders = (userId, restaurantId) => {
  return new Promise((resolve, reject) => {
    let filter = {};
    if (userId) {
      filter = { userId: mongoose.Types.ObjectId(userId) };
    }
    if (restaurantId) {
      filter = { restaurantId: mongoose.Types.ObjectId(restaurantId) };
    }
    orderModel
      .find(filter)
      .then((orders) => {
        if (!orders) {
          return reject({
            status: 404,
            result: {
              error: "Orders Does Not exist",
            },
          });
        }
        resolve({
          status: 200,
          result: {
            orders,
          },
        });
      })
      .catch((err) => reject({ status: 500, result: { error: err } }));
  });
};

const deleteOrder = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      return reject({
        stautus: 404,
        result: { error: "Order does not exist" },
      });
    }
    orderModel
      .deleteOne({ _id: mongoose.Types.ObjectId(id) })
      .then((deletedOrder) => {
        if (!deletedOrder) {
          return reject({
            status: 404,
            result: {
              error: "Order does not exist",
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
  addOrder,
  updateOrder,
  getOrder,
  getOrders,
  deleteOrder,
};
