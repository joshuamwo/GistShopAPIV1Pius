const roomsModel = require("../models/roomSchema");
const userModel = require("../models/userSchema");
const functions = require("../shared/functions")


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
    productImages: req.body.productImages,
    productPrice: req.body.productPrice
  };
  try {
    let rooms = await roomsModel.find({ ownerId: req.params.userId }); 
    

    let user = await userModel.findById(req.params.userId)

    if(user.currentRoom != "" && user.currentRoom != req.params.roomId){
      let userRoom = await roomsModel.findById(user.currentRoom)

      if(userRoom != null){
        if(userRoom.hostIds.length < 2 && userRoom.hostIds.includes(req.params.userId)){
	     
          await roomsModel.findByIdAndDelete(user.currentRoom)
        }else{
          await roomsModel.findByIdAndUpdate(
            user.currentRoom,
            {
              $pullAll: {speakerIds: [req.params.userId]},
            },
            { runValidators: true, new: true, upsert: false }
          );
          await roomsModel.findByIdAndUpdate(
            user.currentRoom,
            {
              $pullAll: {hostIds: [req.params.userId]},
            },
            { runValidators: true, new: true, upsert: false }
          );
          await roomsModel.findByIdAndUpdate(
            user.currentRoom,
            {
              $pullAll: {userIds: [req.params.userId]},
            },
            { runValidators: true, new: true, upsert: false }
          );
        }
      }
    }

    let newRoom = await roomsModel.create(newObj)

        
    await userModel.findByIdAndUpdate(req.params.userId,
			{
				$set: {currentRoom: newRoom._id}
			}
		)

    for( let i = 0; i < user.followers.length; i ++) {

      functions.saveActivity(
        newRoom._id,
        user.firstName + " " + user.lastName,
        'RoomScreen',
        false,
        null,
        user.followers[i]._id,
        user.firstName + " " + user.lastName + " started a room. Join?.",
        user._id
      )

    }
    
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
    .sort({createdAt: -1})  
       .populate("hostIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("userIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("raisedHands", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("speakerIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("invitedIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("productIds", ["images", "name", "price", "quantity"])
      .populate("shopId", ["description", "image"])
      .populate("ownerId", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
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


exports.addUserToRoom = async (req, res) => {
  try {

    const room = await roomsModel.findById(req.params.roomId)

    let user = await userModel.findById(req.body.users[0])

    if(user.currentRoom != "" && user.currentRoom != req.params.roomId){
      console.log("User has room")
      let userRoom = await roomsModel.findById(user.currentRoom)

      if(userRoom != null){
        console.log("room is not null")
        if(userRoom.hostIds.length < 2 && userRoom.hostIds.includes(req.body.users[0])){
	     
          console.log("User is a host and it has other hosts")
          await roomsModel.findByIdAndDelete(user.currentRoom)
        }else{
          console.log("Opposite of User is a host and it has other hosts")
          await roomsModel.findByIdAndUpdate(
            user.currentRoom,
            {
              $pullAll: {userIds: [req.body.users]},
              $pullAll: {hostIds: [req.body.users]},
              $pullAll: {speakerIds: [req.body.users]},
            },
            { runValidators: true, new: true, upsert: false }
          );
        }
      }
    }

    await userModel.findByIdAndUpdate(req.body.users[0],
			{
				$set: {currentRoom: req.params.roomId}
			}
		)

    if (room.hostIds.includes(req.body.users[0]) || room.speakerIds.includes(req.body.users[0])){

      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json(room);
      

    }else{
	    
	    let updatedRoom = await roomsModel.findByIdAndUpdate(
        req.params.roomId,
        {
          $addToSet: {userIds: req.body.users},
          
        },
        { runValidators: true, new: true, upsert: false }
      );
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json(updatedRoom);
      
    }

  } catch (error) {
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json(error.message);
  }
};

exports.removeUserFromRoom = async (req, res) => {

  try {
  
    let updatedRoom = await roomsModel.findByIdAndUpdate(
      req.params.roomId,
      {
        $pullAll: {userIds: [req.body.users]},
        
      },
      { runValidators: true, new: true, upsert: false }
    );

    await userModel.findByIdAndUpdate(req.body.users[0],
			{
				$set: {currentRoom: ""}
			}
		)

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

exports.removeUserFromAudienceRoom = async (req, res) => {

  try {
  
    let updatedRoom = await roomsModel.findByIdAndUpdate(
      req.params.roomId,
      {
        $pullAll: {userIds: [req.body.users]},
        
      },
      { runValidators: true, new: true, upsert: false }
    );

    await userModel.findByIdAndUpdate(req.body.users[0],
			{
				$set: {currentRoom: ""}
			}
		)

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

exports.removeSpeakerRoom = async (req, res) => {

  try {
  
    let updatedRoom = await roomsModel.findByIdAndUpdate(
      req.params.roomId,
      {
        $pullAll: {speakerIds: [req.body.speakerIds]},
        
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


exports.removeRaisedHandRoom = async (req, res) => {

  try {
  
    let updatedRoom = await roomsModel.findByIdAndUpdate(
      req.params.roomId,
      {
        $pullAll: {raisedHands: [req.body.users]},
        
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
      .populate("hostIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("userIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("raisedHands", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("speakerIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("invitedIds", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ])
      .populate("productIds", ["images", "name", "price", "quantity"])
      .populate("shopId", ["description", "image"])
      .populate("ownerId", [
        "firstName",
        "lastName",
        "bio",
        "userName",
        "email",
        "profilePhoto"
      ]);
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
