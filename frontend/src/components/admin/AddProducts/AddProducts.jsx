import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { PulseLoader } from "react-spinners";

import { useTheme } from "../../themeProvider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function AddProducts() {
  const initialState = {
    productName: "",
    productCompany: "",
    productImages: [],
    productDetails: "",
    productCategory: "",
    productStock: "",
    productPrice: "",
  };

  const { pathname } = useLocation();
  const [productDetails, setProductDetails] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (label, value) => {
    setProductDetails({ ...productDetails, [label]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductDetails({ ...productDetails, productImages: files });

    // Generate image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleAddProduct = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("productName", productDetails.productName);
      formData.append("productCompany", productDetails.productCompany);
      for (let i = 0; i < productDetails.productImages.length; i++) {
        formData.append("productImage", productDetails.productImages[i]);
      }
      formData.append("productDetails", productDetails.productDetails);
      formData.append("productCategory", productDetails.productCategory);
      formData.append("productStock", productDetails.productStock);
      formData.append("productPrice", productDetails.productPrice);
      setLoading(true);

      const res = await axios.post("/api/v1/product/add-product", formData);
      

      setProductDetails(initialState);
      setLoading(false);

      toast({
        description: res.data.message,
      });

      // if (res.data.success === true) {
      //   setTimeout(() => { navigate() }, 2000);
      // }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const content = [
    {
      label: "Product-Name",
      type: "text",
      placeholder: "Enter product name",
      value: productDetails?.productName,
      onChange: (e) => handleInputChange("productName", e.target.value),
      key: "product-name",
    },
    {
      label: "Product-Company",
      type: "text",
      placeholder: "Enter product company",
      value: productDetails?.productCompany,
      onChange: (e) => handleInputChange("productCompany", e.target.value),
      key: "product-company",
    },
    {
      label: "Product-Category",
      type: "text",
      placeholder: "Enter product category",
      value: productDetails?.productCategory,
      onChange: (e) => handleInputChange("productCategory", e.target.value),
      key: "product-category",
    },
    {
      label: "Product-Image",
      type: "file",
      onChange: handleImageChange,
      multiple: true,
      key: "product-image",
    },
    {
      label: "Product-Price",
      type: "text",
      placeholder: "Enter product price",
      value: productDetails?.productPrice,
      onChange: (e) => handleInputChange("productPrice", e.target.value),
      key: "product-price",
    },
    {
      label: "Product-Stock",
      type: "text",
      placeholder: "Enter product stock",
      value: productDetails?.productStock,
      onChange: (e) => handleInputChange("productStock", e.target.value),
      key: "product-stock",
    },
  ];

  const imagePreviewsSection = imagePreviews.map((preview, index) => (
    <img
      key={index}
      src={preview}
      alt={`Product Preview ${index + 1}`}
      className="max-w-full grid grid-cols-3 gap-2 my-2"
    />
  ));

  useEffect(() => {
    const getProduct = async () => {
      try {
        
        let res = await axios.get(`/api/v1/product/product/${id}`);

        setProductDetails(res.data.payload);
       
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    getProduct();
  }, [id]);

  const handleUpdate = async () => {
    try {
      // Update product details
      setLoading(true)
      const detailsUpdateRes = await axios.patch(
        `/api/v1/product/update-product/${id}`,
        productDetails
      );
      setLoading(false)
      toast({
        description: detailsUpdateRes.data.message,
      });
  
      // Update product images
      
      if (productDetails.productImages.length > 0) {
        const imageFormData = new FormData();
        for (let i = 0; i < productDetails.productImages.length; i++) {
          imageFormData.append(
            "productImage",
            productDetails.productImages[i]
          );
        }
  setLoading(true)
        const imagesUpdateRes = await axios.patch(
          `/api/v1/product/update-productImages/${id}`,
          imageFormData
        );
        setLoading(false)
        toast({
          description: imagesUpdateRes.data.message,
        });
      }
  
      // Optionally, you can reset the productDetails state or perform any other actions.
  
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  

  return (
    <Card className="max-w-full mx-auto mt-8 bg-white rounded-md overflow-hidden shadow-lg">
      <CardHeader className="bg-gray-800 text-white py-4">
        <CardTitle className="text-2xl font-semibold">ADD PRODUCT</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap -mx-4">
          {content.map((item) => (
            <div key={item.label} className="w-full sm:w-1/2 px-4 mb-4">
              <Label
                htmlFor={item.label}
                className="block text-gray-700 m-2 p-4"
              >
                {item.label}
              </Label>
              {item.type === "file"  ? (
                <Input
                  id={item.label}
                  type={item.type}
                  onChange={item.onChange}
                  multiple={item.multiple}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                <Input
                  id={item.label}
                  type={item.type}
                  value={item.value}
                  onChange={item.onChange}
                  placeholder={item.placeholder}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          ))}
          <div className="w-full px-4 mb-4">
            <Label
              htmlFor="productDetails"
              className="block text-gray-700 m-2 p-4"
            >
              Product-Details
            </Label>
            <Textarea
              id="productDetails"
              placeholder="Enter product details"
              value={productDetails?.productDetails}
              onChange={(e) =>
                handleInputChange("productDetails", e.target.value)
              }
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          {
            <div className="grid grid-cols-3 gap-3 mx-4 px-4">
              {imagePreviewsSection}
            </div>
          }
        </div>
      </CardContent>
      <CardFooter className="items-center justify-center py-4">
        {/* Add Product Button */}
        {loading ? (
          <Button
            className={"text-2xl"}
            onClick={handleAddProduct}
            variant="outline"
          >
            Loading{" "}
            <PulseLoader
              color={`${theme === "dark" ? "white" : "black"}`}
              loading={loading}
              size={10}
              data-testid="loader"
            />
          </Button>
        ) : pathname === "/add-product" ? (
          <Button onClick={handleAddProduct} variant="outline">
            Add Product
          </Button>
        ) : (
          <Button onClick={handleUpdate} variant="outline">
            Update Product
          </Button>
        )}
      </CardFooter>
      <Toaster />
    </Card>
  );
}
