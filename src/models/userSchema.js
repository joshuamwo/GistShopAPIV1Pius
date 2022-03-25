const mongoose = require("mongoose");
const { Schema, model } = mongoose;
require("mongoose-currency").loadType(mongoose);
const bcrypt = require("bcrypt");
const decode = require("../shared/base64");

const value = {
  type: String,
  required: [true, "This field is required"],
};

const userSchema = new Schema(
  {
    firstName: value,
    lastName: value,
    bio: { type: String, default: "" },
    userName: value,
    phonenumber: { type: String, },
    profilePhoto: { type: String, default: "" },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,

    },
    followersCount: {
      type: Number
    },
    followingCount: {
      type: Number
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    memberShip: {
      type: Number
    },
    upgradedDate: {
      type: Number
    },
    wallet: {
      type: Number,
      min: 0,
      default: 0,
    },
    currentRoom: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    linkedIn: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      default: null,
    },
    notificationToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    autoCreate: true, // auto create collection
    autoIndex: true, // auto create indexes
  }
);

/* a prehook that is called before the user info is stored in the database 
this hook will hash the plain text password before storing it*/
userSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  if (this.profilePhoto) {
    decode(this.profilePhoto, this._id);
    const image = `${user._id}.png`;

    this.profilePhoto = image;

  }
  next();

  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

/*
userSchema.pre("findOneAndUpdate", async function (next) {
  const user = this;
  
 

  if(this._update.$set.profilePhoto != null) {

 console.log("Update " + this._conditions._id)
  decode(this._update.$set.profilePhoto, this._conditions._id);
  const image = `${this._conditions._id}.png`;

  this._update.$set.profilePhoto = image;

  }
  next();
});
*/

const users = model("user", userSchema);
module.exports = users;
