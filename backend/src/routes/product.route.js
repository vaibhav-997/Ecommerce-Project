import express from 'express';
import { ProductController } from '../controllers/product.controller.js';
import {upload } from '../middlewares/multer.middleware.js';
import {authUser} from '../middlewares/user.middleware.js'

const router = express.Router()



router.post('/add-product',authUser,upload.array('productImage', 3),ProductController.addProduct )
router.get('/search',ProductController.searchProducts )
router.get('/get-three-productBy-category',ProductController.getThreeProductsByCategory )
router.get('/get-productBy-category',ProductController.getAllCategoryProducts)
router.get('/productsBy-category/:productCategory',ProductController.getProductsByCategory)
router.get('/product/:id',ProductController.getProductById)
router.patch('/update-product/:id',authUser,ProductController.updateProduct )
router.patch('/update-productImages/:id',authUser,upload.array("productImage",3),ProductController.updateProductImages )
router.delete('/delete-product/:id',authUser,ProductController.deleteProductById )
router.post('/comment/:id', authUser,ProductController.addComment)
router.get('/comments/:id', authUser,ProductController.getComments)
router.patch('/update-comment', authUser, ProductController.updateComments)
router.delete('/delete-comment/:id', authUser, ProductController.deleteComments)
router.post('/add-cart/:id', authUser, ProductController.addToCart)
router.get('/cart', authUser, ProductController.getCartProducts)
router.delete('/cart/:id', authUser, ProductController.deleteCartProduct)


export default router