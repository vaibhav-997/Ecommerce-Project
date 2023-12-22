import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import axios from 'axios';
import { useTheme } from '../themeProvider';

import {useSelector} from 'react-redux'

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { theme } = useTheme();
  const authStatus = useSelector(state => state.auth.status)

  
  const getProductsByCategory = async () => {
    try {
      const res = await axios.get('/api/v1/product/get-three-productBy-category');
      setProducts(res.data.payload);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProductsByCategory();
  }, []);
  
  return (
    <>
      <div className={`relative w-full my-4 ${theme}`}>
        

<div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="flex flex-col justify-center px-4 py-12 md:py-16 lg:col-span-7 lg:gap-x-6 lg:px-6 lg:py-24 xl:col-span-6">
          
          <h1 className={`mt-8 text-3xl font-bold tracking-tight ${theme === "dark" ? "text-white": "text-black"}  md:text-4xl lg:text-6xl`}>
          Explore and shop your favorites just for you!
          </h1>
          <p className={`mt-8 text-lg ${theme === "dark" ? "text-white": "text-gray-700"}  `}>
          Find stylish, quality products that suit your taste and lifestyle.
          </p>
         {
          !authStatus &&  <form action="" className="mt-8 flex items-start space-x-2">
          <div>
            <input
              className={`flex w-full rounded-md border  ${theme === "dark" ? "text-white": "border-black/30"} bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50`}
              type="email"
              placeholder="Enter your email"
              id="email"
            ></input>
            <p className={`mt-2 text-sm ${theme === "dark" ? "text-white": "text-gray-500"} `}>We care about your privacy</p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-md bg-black px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Login
            </button>
          </div>
        </form> 
         }
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:col-span-6">
          <img
            className="aspect-[3/2] bg-gray-50 object-cover lg:aspect-[4/3] lg:h-[600px] xl:aspect-[16/9]"
            src="/hero.avif"
            alt=""
          />
        </div>
      </div>
      </div>

      <hr className="my-7" />

      <div className="my-7">
        <h1 className="font-bold text-4xl text-center font-serif">Shop Products Now</h1>
      </div>

      <hr className="my-5" />

      <div className="flex items-center justify-center">
        <div className=" mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id}>
              <Card
              onClick={() => navigate('/category')}
                title={product.category.productName}
                image={product.category.productImage}
                details={product.category.productDetails}
                theme={theme} // Pass theme to Card component
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

