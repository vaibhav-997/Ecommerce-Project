import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
    index:'text'
    
  },
  productCompany: {
    type: String,
    required: true,
    uppercase:true,
    index:'text'
  },
  productImage: [{
    type: String,
    required: true,
  }],
  productDetails: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
    uppercase:true
    
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productStock: {
    type: Number,
    default: 0,
    required: true,
  },
  productSlug: {
    type: String, // Corrected type to String
    unique: true, // Ensuring uniqueness for the slug
  },
  productRatings: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    rating: {
      type: Number,
    },
  }],
}, { timestamps: true });

// productSchema.index({ productName: 'text', productCompany: 'text' });

productSchema.pre('save', async function (next) {
  this.productSlug = slugify(this.productName, { lower: true }); // Adding { lower: true } for lowercase slugs
  next();
});

const Product = model("Product", productSchema); // Corrected model name

export { Product };
