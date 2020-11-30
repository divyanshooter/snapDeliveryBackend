const Router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

Router.post("/payment", (req, res, next) => {
  stripe.charge.create({
    amount: req.body.amount,
    currency: "INR",
    description: "One-time setup fee",
    source: req.body.token.id,
  }),
    (err, charge) => {
      if (err) {
        res
          .status(500)
          .json({ error: "Payment Cannot be done Try after Some Time" });
        return;
      }
      res.status(200).json({ result: "Payment Successfull" });
    };
});

module.exports = Router;
