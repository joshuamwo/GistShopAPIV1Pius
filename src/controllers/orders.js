var orderModel = require("../models/orderSchema");
const mongoose = require("mongoose");
const itemModel = require("../models/itemSchema");
const userModel = require("../models/userSchema");
const transactionModel = require("../models/transactionSchema");
const utils = require("../../utils");

exports.getAllOrdersBySeller = async (req, res) => {};

exports.getAllOrdersByUserId = async (req, res) => {
  try {
    let orders = await orderModel
      .find({
        customerId: req.params.userId,
      })
      .populate("customerId", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
      ])
      .populate("shopId")
    res.status(200).setHeader("Content-Type", "application/json").json(orders);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};

exports.getOrderByProductId = async (req, res) => {
  try {
    let orders = await orderModel
      .find({ productIds: req.params.productId })
      .populate("productIds");
    res.status(200).setHeader("Content-Type", "application/json").json(orders);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};

exports.getOrderByShopId = async (req, res) => {
  try {
    let orders = await orderModel.find({ shopId: req.params.shopId });
    res.status(200).setHeader("Content-Type", "application/json").json(orders);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};

exports.addOrder = async (req, res) => {
  let orderId = new mongoose.Types.ObjectId();
  let itemId = new mongoose.Types.ObjectId();
  let total = req.body.tax + req.body.shippingFee + req.body.subtotal;
  let order = {
    _id: orderId,
    customerId: req.params.userId,
    shippingId: req.body.shippingId,
    shopId: req.body.shopId,
    subTotal: req.body.subTotal,
    tax: req.body.tax,
    shippingFee: req.body.shippingFee,
    total,
    itemId,
  };
  //   let customermodel = await userModel.findById(req.params.userId);
  //   if (customermodel.wallet == undefined || total > customermodel.wallet) {
  //     res.status(422).setHeader("Content-Type", "application/json").json({
  //       status: false,
  //       message: "You dont have enough GC to complete this order",
  //     });
  //   } else {
  let item = {
    _id: itemId,
    productId: req.body.productId,
    quantity: req.body.quantity,
    orderId,
  };

  try {
    let newOrder = await orderModel.create(order);
    let newItem = await itemModel.create(item);

    // save transaction to the customer
    let newTransaction = {
      from: req.params.userId,
      to: req.body.productOwnerId,
      reason: utils.Transactionreasons.PURCHASED,
      amount: req.body.quantity,
      type: "purchase",
      deducting: true,
      shopId: req.body.shopId,
    };
    await userModel.findByIdAndUpdate(
      req.params.userId,
      { $inc: { wallet: parseInt(total) * -1 } },
      { runValidators: true, new: true }
    );
    await transactionModel.create(newTransaction);

    // save transaction to the product owner

    let newTransaction1 = {
      from: req.params.userId,
      to: req.body.productOwnerId,
      reason: utils.Transactionreasons.PURCHASED,
      amount: req.body.quantity,
      type: "purchase",
      deducting: false,
      shopId: req.body.shopId,
    };
    await transactionModel.create(newTransaction1);

    //update owner wallet
    await userModel.findByIdAndUpdate(
      req.body.productOwnerId,
      { $inc: { wallet: parseFloat(total) } },
      { runValidators: true, new: true }
    );
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json({ newOrder, newItem });
  } catch (e) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(e.message);
  }
  //   }
};

exports.updateOrderById = async (req, res) => {
  let { productIds, ...setter } = req.body;

  try {
    let newOrder = await orderModel.findByIdAndUpdate(
      req.params.orderId,
      { $set: req.body },
      { runValidators: true, new: true }
    );
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(newOrder);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "Application/json")
      .json(error.message);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    let order = await orderModel
      .findById(req.params.orderId)
      .populate("itemId")
      .populate("billingId")
      .populate("shippingId")
      .populate("productIds");
    res.status(200).setHeader("Content-Type", "application/json").json(order);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "Application/json")
      .json(error.message);
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    let deleted = await orderModel.findByIdAndDelete(req.params.orderId);
    res.status(200).setHeader("Content-Type", "application/json").json(deleted);
  } catch (e) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(e.message);
  }
};
