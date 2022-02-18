const roomsModel = require("../models/roomSchema");
var mongoose = require("mongoose");
const arrayToObjectIds = require("../shared/arrayToObjectIds");

exports.createRoom = async (req, res) => {
  let newObj = {
    ownerId: mongoose.Types.ObjectId(req.params.userId),
    productIds: arrayToObjectIds(req.body.productIds),
    hostIds: arrayToObjectIds(req.body.hostIds),
    userIds: arrayToObjectIds(req.body.userIds),
    title: req.body.title,
    raisedHands: arrayToObjectIds(req.body.raisedHands),
    speakerIds: arrayToObjectIds(req.body.speakerIds),
    invitedIds: arrayToObjectIds(req.body.invitedIds),
    shopId: mongoose.Types.ObjectId(req.body.shopId),
  };
  try {
    let rooms = await roomsModel.find({ ownerId: req.params.userId });
    if (rooms.length > 0) {
      await roomsModel.findByIdAndDelete(rooms[0]._id);
    }
    let newRoom = await roomsModel.create(newObj);
    res.status(200).setHeader("Content-Type", "application/json").json(newRoom);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};

exports.getRoomsByUserId = async (req, res) => {
  try {
    let rooms = await roomsModel
      .find({ ownerId: req.params.userId })
      .populate("hostIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
      ])
      .populate("userIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
      ])
      .populate("raisedHands", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
      ])
      .populate("speakerIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
      ])
      .populate("invitedIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
      ])
      .populate("productIds", ["images", "name", "price", "quantity"])
      .populate("shopId", ["description", "image"])
      .populate("ownerId", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
      ]);
      
    res.status(200).setHeader("Content-Type", "application/json").json(rooms);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};
exports.getRoomsAllRooms = async (req, res) => {
  try {
    let rooms = await roomsModel.find()      
    .populate("hostIds", [
      "firstName",
      "lastName",
      "bio",
      "userName",
      "email",
    ])
    .populate("userIds", [
      "firstName",
      "lastName",
      "bio",
      "userName",
      "email",
    ])
    .populate("raisedHands", [
      "firstName",
      "lastName",
      "bio",
      "userName",
      "email",
    ])
    .populate("speakerIds", [
      "firstName",
      "lastName",
      "bio",
      "userName",
      "email",
    ])
    .populate("invitedIds", [
      "firstName",
      "lastName",
      "bio",
      "userName",
      "email",
    ])
    .populate("productIds", ["images", "name", "price", "quantity"])
    .populate("shopId", ["name","description", "image"])
    .populate("ownerId", [
      "firstName",
      "lastName",
      "bio",
      "userName",
      "email",
    ]);
    res.status(200).setHeader("Content-Type", "application/json").json(rooms);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};

exports.getRoomsByShopId = async (req, res) => {
  try {
    let rooms = await roomsModel
      .find({ shopId: req.params.shopId })
      .populate("shopId");
    res.status(200).setHeader("Content-Type", "application/json").json(rooms);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};

exports.updateRoomById = async (req, res) => {
  let { title, ...arrays } = req.body;
  try {
    let updatedRoom = await roomsModel.findByIdAndUpdate(
      req.params.roomId,
      {
        $push: arrays,
        $set: { title },
      },
      { runValidators: true, new: true, upsert: false }
    );
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(updatedRoom);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};

exports.getRoomById = async (req, res) => {
  try {
    let room = await roomsModel
      .findById(req.params.roomId)
      .populate("productIds", ["images", "name", "price", "quantity"])
      .populate("shopId", ["description", "image"])
      .populate("ownerId", ["userName"]);
    res.status(200).setHeader("Content-Type", "application/json").json(room);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};

exports.deleteRoomById = async (req, res) => {
  try {
    let room = await roomsModel.findByIdAndDelete(req.params.roomId);
    res.status(200).setHeader("Content-Type", "application/json").json(room);
  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};
