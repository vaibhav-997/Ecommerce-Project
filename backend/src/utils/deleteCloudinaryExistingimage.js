import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv'
dotenv.config({
  path: "./.env"
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});




const deleteExistingCloudinaryImage = async (imageurl) => {
  try {
    // console.log(localFilePath)
    if (!localFilePath) return null
    const cloudinaryResponse = await cloudinary.uploader.destroy(imageurl)
    fs.unlinkSync(localFilePath)
    // console.log(cloudinaryResponse)
    return cloudinaryResponse
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null
  }
}


export { deleteExistingCloudinaryImage }