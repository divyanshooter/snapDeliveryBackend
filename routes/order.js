const Router = require("express").Router();
const orderCtrl = require("../controller/order");
const orderModel = require("../models/order");
const isAuth = require("../middleware/is-Auth");
const isRestaurant = require("../middleware/is-Restaurant");
const invoiceCreator = require("../helper/invoice");

const PDFDocument = require("pdfkit");

Router.post("/create", isAuth, (req, res) => {
  orderCtrl
    .addOrder(req.userId, req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.put("/update", isAuth, (req, res) => {
  orderCtrl
    .updateOrder(req.restaurantId, req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.get("/fetch", isAuth, (req, res) => {
  const id = req.query.id;
  orderCtrl
    .getOrder(id)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.get("/fetchAll", isAuth, (req, res) => {
  orderCtrl
    .getOrders(req.userId, req.restaurantId)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.delete("/delete", isAuth, (req, res) => {
  const id = req.query.id;
  orderCtrl
    .deleteOrder(id)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.get("/invoice", (req, res, next) => {
  const orderId = req.query.id;
  orderModel
    .findById(orderId)
    .populate("userId")
    .populate("restaurantId")
    .then((order) => {
      if (!order) {
        return next(new Error("No order Found"));
      }
      if (order.userId._id.toString() !== req.userId.toString()) {
        return res.status(401).json({ error: "Not Authorized" });
      }
      const invoiceName = "invoice-" + orderId + ".pdf";

      const pdfDoc = new PDFDocument({ size: "A4", margin: 50 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(res);
      invoiceCreator.generateHeader(pdfDoc);
      invoiceCreator.generateCustomerInformation(pdfDoc, order);
      invoiceCreator.generateRestaurantInformation(pdfDoc, order);
      invoiceCreator.generateInvoiceTable(pdfDoc, order);
      invoiceCreator.generateFooter(pdfDoc);

      pdfDoc.end();
    })
    .catch((err) => {
      return next(new Error(err));
    });
});

module.exports = Router;
