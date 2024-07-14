const cloudinary = require('cloudinary').v2;
const{CloudinaryStorage}=require('multer-storage-cloudinary');

cloudinary.config({
   cloud_name:process.env.CLOUD_NAME,
   api_key:process.env.CLOUD_API_KEY,
   api_secret:process.env.CLOUD_API_SECRET,
});

//mentioning cloudinary about our storage folder
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'trueviewer',
      allowdFormats:["png","jpg","jpeg"], // supports promises as well
    },
  });

  module.exports={
    cloudinary,
    storage,
  };