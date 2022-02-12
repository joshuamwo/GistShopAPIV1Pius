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
		bio: value,
		userName: value,
		phonenumber: value,
      profilePhoto: value,
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
			required: true,
			min: 6,
		},
		wallet: {
			type: Number,
			min: 0,
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
   	decode(this.profilePhoto, this._id);
		const image = `${user._id}.png`;

		this.profilePhoto = image;
		next();


	next();
});

userSchema.methods.isValidPassword = async function (password) {
	const user = this;
	const compare = await bcrypt.compare(password, user.password);
	return compare;
};

const users = model("user", userSchema);
module.exports = users;
