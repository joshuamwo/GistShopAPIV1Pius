const fs = require("fs");

exports.decode = (img) => {
	// let base64Image = img.split(";base64,").pop();
	let file = fs.writeFile(
		"image.png",
		img,
		{ encoding: "base64" },
		function (err) {
			console.log("File created");
		}
	);
	return file;
};
