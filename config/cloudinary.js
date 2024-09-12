const cloudinary = require("cloudinary").v2

cloudinary.config({ 
    cloud_name: 'dyxlelvbk',
    api_key: '338295835813319',
    api_secret: process.env.CLOUDINARY_SECRET 
  });

  module.exports = cloudinary