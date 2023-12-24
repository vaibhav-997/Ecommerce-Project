import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const {toast} = useToast()
  useEffect(() => {
    const getCartProducts = async () => {
      setLoading(true);
      let res = await axios.get("/api/v1/product/cart");

      setProducts(res.data.payload[0]);
      setProductDetails(res.data.payload[0].products);
      setLoading(false);
    };
    getCartProducts();
  }, []);

  const handleDeleteCartProduct = async(id) => {

    let res = await axios.delete(`/api/v1/product/cart/${id}` )
    toast({
        description:res.data.message
    })
}

  return (
    <Drawer>
      <DrawerTrigger>Cart</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto my-4 max-w-4xl md:my-6">
          <div className="overflow-hidden  rounded-xl shadow">
            <div className="">
              {/* Product List */}
              <div className="bg-gray-100 px-5 py-6 md:px-8">
                <div className="flow-root">
                  <ul className="-my-7 divide-y divide-gray-200">
                    {productDetails?.map((product) => (
                      <li
                        key={product._id}
                        className="flex items-stretch justify-between space-x-5 py-7"
                      >
                        <div className="flex flex-1 items-stretch">
                          <div className="flex-shrink-0">
                            <img
                              className="h-20 w-20 rounded-lg border border-gray-200 bg-white object-contain"
                              src={product.productImage[0]}
                              alt={product.productName}
                            />
                          </div>
                          <div className="ml-5 flex flex-col justify-between">
                            <div className="flex-1">
                             
                              <p className="mt-1.5 text-sm font-medium text-gray-500">
                                {product.productName}
                              </p>
                            </div>
                            <p className="mt-4 text-xs font-medium ">x {product.quantity}</p>
                          </div>
                        </div>
                        <div className="ml-auto flex flex-col items-end justify-between">
                          <p className="text-right text-sm font-bold text-gray-900">
                            {product.productPrice}
                          </p>
                          <button
                            type="button"
                            className="-m-2 inline-flex rounded p-2 text-gray-400 transition-all duration-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                          >
                            <span className="sr-only">Remove</span>
                            <X onClick={() => handleDeleteCartProduct(product._id)} className="h-5 w-5" />
                          </button>
                           
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className="mt-6 border-gray-200" />

                <ul className="mt-6 space-y-3">
                  <li className="flex items-center justify-between text-gray-900">
                    <p className="text-sm font-medium ">Total</p>
                    <p className="text-sm font-bold ">
                      ₹{products?.productTotal}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>{" "}
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
          <h2 >Cancle</h2>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
