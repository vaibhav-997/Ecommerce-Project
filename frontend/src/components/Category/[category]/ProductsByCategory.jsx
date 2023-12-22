import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../Card/Card';
import axios from 'axios';
import { useTheme } from '../../themeProvider';


  

export default function ProductsByCategory() {

    const {category} = useParams()
    const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { theme } = useTheme();

  const getProductsByCategory = async () => {
    try {
      const res = await axios.get(`/api/v1/product/productsBy-category/${category}`);
      
      setProducts(res.data.payload);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProductsByCategory();
  }, []);
  return (
    <div className='m-4 mt-5 grid grid-cols-3 gap-5'>
      {products.map((product) => (
            <div className='cursor-pointer' key={product._id}>
                
              <Card
              onClick={() => navigate(`/product/${product._id}`)}
                title={product.productName}
                image={product.productImage}
                details={product.productDetails}
                theme={theme} // Pass theme to Card component
              />
            </div>
          ))}

    </div>
  )
}

