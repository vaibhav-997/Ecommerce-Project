import { Product } from "../models/product.model.js";
import Joi from 'joi';
import {uploadToCloudinary} from '../utils/cloudinary.js'
import { deleteExistingCloudinaryImage } from "../utils/deleteCloudinaryExistingimage.js";
import { Comments } from "../models/comment.model.js";
import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { User } from "../models/user.model.js";


const productValidation  = Joi.object({
    productName: Joi.string().max(100).min(3).required(),
    productDetails: Joi.string().max(5000).min(10).required(),
    productCompany: Joi.string().max(30).min(3).required(),
     productCategory: Joi.string().max(30).min(3).required(),
    productPrice: Joi.number().required(),
    productStock: Joi.number().required(),
})


// product controller
class ProductController {

    // add products method
    static async addProduct(req, res) {
        try {
            const {productName, productCategory,productPrice,productStock, productDetails, productCompany} = req.body;
            const images = req.files
    
            if(!productName || !productCategory || !productPrice || !productStock || !productDetails ||!productCompany) {
                return res.json({
                    success:false,
                    message:"All fields are required"
                })
            }
    
            const productValidationError = await productValidation.validate({productName, productCategory,productPrice,productStock,productDetails, productCompany})
            if(productValidationError.error){
                return res.json({
                    success:false,
                    message:`Validation error ${productValidationError.error.message}`
                })
            }
            
            let productImages = [];
            for(let i = 0; i < images.length; i++){
                productImages[i] = await uploadToCloudinary(images[i].path)
               
            }
            let productImageUrl = productImages.map((productImage) => productImage.secure_url)
            
            const product = await Product.create({productName,productDetails, productCategory,productPrice, productCompany,productStock, productImage:productImageUrl})
            
            return res.json({
                success:true,
                message:"Product created successfully",
                product
            })
        } catch (error) {
            return res.json({success:false, message:`Error creating product ${error.message}`})
        }
    }


    // Update product method
    static async updateProduct(req, res) {
        const id = req.params.id;
        const {
            productName,
            productCategory,
            productPrice,
            productStock,
            productDetails,
            productCompany
        } = req.body;
    
        if (!(productName || productCategory || productPrice || productStock || productDetails || productCompany)) {
            return res.json({
                success: false,
                message: "At least one field is required for update"
            });
        }
    
        // Construct the update object based on the fields present in the request body
        const updateFields = {};
        if (productName) updateFields.productName = productName;
        if (productCategory) updateFields.productCategory = productCategory;
        if (productPrice) updateFields.productPrice = productPrice;
        if (productStock) updateFields.productStock = productStock;
        if (productDetails) updateFields.productDetails = productDetails;
        if (productCompany) updateFields.productCompany = productCompany;
    
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id, updateFields, {
                    new: true
                }
            );
    
            return res.json({
                success: true,
                message: "Product updated successfully",
                payload: updatedProduct
            });
        } catch (error) {
            return res.json({
                success: false,
                message: "Error updating product",
                error: error.message
            });
        }
    }

    // update images method

    static async updateProductImages(req, res){
        try {
            const images = req.files
            const id = req.params.id;
            if(!images) {
                return res.json({success:false, message:"Images required"})
            }
            let productImages = []
            for(let i = 0; i < images.length; i++) {
                productImages[i] = await uploadToCloudinary(images[i].path)
            }
            
            let updatedProductImages = productImages.map(productImage => productImage.secure_url)
           
            let updatedProduct = await Product.findByIdAndUpdate(id, {productImage:updatedProductImages},{new:true})
         
            if(!updatedProduct){
                return res.json({success:false, message:"product updation failed! Invalid id"})
            }

            for(let i = 0; i<updatedProduct.productImage.length; i++){
                await deleteExistingCloudinaryImage(updatedProduct.productImage[i])
            }
            return res.json({success:true, message:"Images updated successfully", payload:updatedProduct});
        } catch (error) {
            return res.json({success:false, message:"Updation failed! Error"})
        }
        

    }
    

    // search products methods
    static async searchProducts(req, res) {
        try {
            const search = req.query.search;

            const searchProduct = await Product.aggregate([
                {
                    $match: {
                        $text: { $search: search }
                    }
                }
            ]);

            if (!searchProduct || searchProduct.length === 0) {
                return res.json({ success: false, message: "No products available with this search" });
            }

            return res.json({
                success: true,
                message: "Product Found Successfully",
                searchProduct
            });
        } catch (error) {
            console.error(`Error searching for products: ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    // get Three products by category
    static async getThreeProductsByCategory(req, res) {
        try {
            const products = await Product.aggregate([
                {
                  $group: {
                    _id: "$productCategory",
                    category: {
                      $first: "$$ROOT",
                    },
                  },
                },
                {
                  $limit: 3,
                },
              ])
            return res.json({
                success:true,
                payload:products
            })
        } catch (error) {
            return res.json({ success:false, message:"Error getting products"})
        }
    }


    // get all category products
    static async getAllCategoryProducts (req, res){
        try {
            const products = await Product.aggregate([
                {
                    $group: {
                    _id: "$productCategory",
                    category: {
                        $first: "$$ROOT",
                    },
                    },
                },
                ])
            return res.json({
                success:true,
                payload:products
            })
        } catch (error) {
            return res.json({ success:false, message:"Error getting products"})
        }
    }

    // get products by category
    static async getProductsByCategory (req, res){
        try {
            const productCategory = req.params.productCategory
          
            if(!productCategory) return res.json({ success:false, message:"Category not found"})
            let products = await Product.find({productCategory})
            if(!products) return res.json({ success:false, message:"Product not available for this category"})
            return res.json({success:true, payload:products})
        } catch (error) {
            return res.json({ success:false, message:"Error getting products with this category"})
        }
    }

    // get product by id
    static async getProductById (req, res){
        try {
            const id = req.params.id
            let product = await Product.findById(id)
            if(!product) return res.json({ success:false, message:"Product not found"})
            return res.json({ success:true, payload:product})
        } catch (error) {
            return res.json({ success:false, message:"Error getting the product with this id"})
        }
    }

    //    delete product by id
    static async deleteProductById (req, res){
        try {
            const id = req.params.id
            await Product.findByIdAndDelete(id)
            return res.json({ success:true, message:"Product deleted successfully"})
        } catch (error) {
            return res.json({ success:false, message:"Error deleting the product"})
        }
    }

    // Add comments to product
    static async addComment (req, res){
        try {
            const id = req.params.id
        const user = req.user
        const {comment} = req.body
       
        if(!comment) return res.json({ success:false, message:"Comment can not be empty"})
        const product = await Product.findById(id)
        const comments = await Comments.create({comments:comment,user:user._id, product:product._id})

        if(!comments){
            return res.json({ success:false, message:"Error creating comment"})
        }

        return res.json({ success:true, message:"Comment added successfully"})
        } catch (error) {
            return res.json({success:false, message:"error while adding comment"})
        }
    }

    // showing comments to the product
    static async getComments(req, res){
        try {
            const id = req.params.id
            const comments = await Comments.find({product:id}).populate("user").select("-password -refreshToken")
           
          
    
       
            if(!comments){
                return res.json({ success:false, message:"Comments not found"})
    
            }
            return res.json({success:true, message:comments.length>0 ? "Comments found successfully":"This product dont have any comments", payload:comments})
        } catch (error) {
            return res.json({success:false, message:"error while fetching comments"})
        }
    }

    // update comments from the product
    static async updateComments(req, res){
        try {
            const {id,comments} = req.body 
            if(!id || !comments){
                return res.json({success:false, message:"Comments not found"})
            }
            const updateComments = await Comments.findByIdAndUpdate(id,{comments},{new:true})
            if(!updateComments){
                return res.json({success:false, message:"Failed to update comments"})
            }
            return res.json({success:true, message:"comments updated successfully"})
        } catch (error) {
            return res.json({success:false, message:"error while updating comments"})
        }
    }

    // delete comments from the product
    static async deleteComments(req, res){
        try {
            const {id} = req.params
            if(!id ){
                return res.json({success:false, message:"Invalid id"})
            }
            const deletedComment = await Comments.findByIdAndDelete(id,{new:true})
            if(!deletedComment){
                return res.json({success:false, message:"Failed to deleting commen"})
            }
            return res.json({success:true, message:"comments deleted successfully"})
        } catch (error) {
            return res.json({success:false, message:"error while deleting comment"})
        }
    }

    // Add to cart method
    static async addToCart(req, res){
        try {
            const {id} = req.params
         
            if(!id){
                return res.json({success:false, message:"Invalid id"})
            }
            let cartProduct = await Cart.create({user:req.user._id, products:id})
            if(!cartProduct){
                return res.json({success:false, message:"Failed adding product to cart"})
            }
            return res.json({success:true, message:"Product successfully added to cart"})
        } catch (error) {
            return res.json({success:false, message:"Error adding product to cart"})
        }
    }   

    // get cart products
    static async getCartProducts(req, res){
      
       try {
       
         const cartProductsDetails = await User.aggregate([
             {
                 $match: {
                     _id: new mongoose.Types.ObjectId(req.user._id)
                 }
             },
             {
                 $lookup: {
                     from: "carts",
                     localField: "_id",
                     foreignField: "user",
                     as: "cartProduct"
                 }
             },
             {
                 $unwind: "$cartProduct"
             },
             {
                 $lookup: {
                     from: "products",
                     localField: "cartProduct.products",
                     foreignField: "_id",
                     as: "productDetails"
                 }
             },
             {
                 $unwind: "$productDetails"
             },
             {
                 $project: {
                     "productDetails.productImage": 1,
                     "productDetails.productName": 1,
                     "productDetails.productPrice": 1,
                     "productDetails._id": 1,
                     "productDetails.quantity": 1
                 }
             },
             {
                 $group: {
                     _id: "$_id", // Group by user
                     productTotal: { $sum: "$productDetails.productPrice" },
                     products: { $push: "$productDetails" }
                 }
             },
             
         ]
         )
       
         if(!cartProductsDetails ){
             return res.json({success: false, message: "Cart dont have products"})
         }
 
         return res.json({success: true, payload:cartProductsDetails,message:cartProductsDetails.length === 0 ? "Dont have products in the cart":"Cart products fecthed successfully"})
       } catch (error) {
        return res.json({success: false, message:"Error fecthing the cart products"})
       }
    }


    // delete cart products
    static async deleteCartProduct(req, res){
        try {
            const id = req.params.id
            if(!id){
                return res.json({success:false, message:"Invalid id"})
            }
            let deletedProduct = await Cart.findOneAndDelete({products:id})
            console.log(deletedProduct)
            if(!deletedProduct){
                return res.json({success:false, message:"Product deletion failed"})
            }
            return res.json({success:true, message:"Deleted Product from cart"})
        } catch (error) {
            return res.json({success:false, message:"Error deleting product from cart"})
        }
    }
}

export { ProductController };