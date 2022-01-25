const addressModel = require("../models/addressSchema");

exports.addAddress = async (req, res) => {
	try {
		let newAddress = await addressModel.create(req.body);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(newAddress);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.updateAddressById = async (req, res) => {
	try {
		let updatedAddress = await addressModel.findByIdAndUpdate(
			req.params.addressId,
			{ $set: req.body },
			{ runValidators: true, new: true }
		);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(updatedAddress);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getAddressById = async(req, res) => {
	try {
		let Address = await addressModel.findById(req.params.addressId);
		res.status(200).setHeader("Content-Type", "application/json").json(Address);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.deleteAddressById = async (req, res) => {
	try {
		let deleted = await addressModel.findByIdAndDelete(req.params.addressId);
		res.status(200).setHeader("Content-Type", "application/json").json(deleted);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};
