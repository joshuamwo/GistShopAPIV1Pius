const fs = require('fs');

const decode = (img) =>{
   const split = img.split(","); // or whatever is appropriate here. this will work for the example given
	const base64Data = split[1];
   fs.writeFileSync("./public/img/new.png", base64Data, "base64");
}

module.exports = decode;