import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import axios from 'axios';
import { useTheme } from '../themeProvider';


  

function Category() {


    const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { theme } = useTheme();

  const getProductsByCategory = async () => {
    try {
      const res = await axios.get('/api/v1/product/get-productBy-category');
      
      setProducts(res.data.payload);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProductsByCategory();
  }, []);
  return (
    <div className='m-4 lg:grid lg:grid-cols-4 md:grid md:grid-cols-3 grid grid-cols-1 gap-5'>
      {products.map((product) => (
            <div className='cursor-pointer'  onClick={() => navigate(`/products/${product.category.productCategory}`)}  key={product._id}>
                
              <Card
              onClick={() => navigate(`/products/${product.category.productCategory}`)}
                title={product.category.productName}
                image={product.category.productImage}
                details={product.category.productDetails}
                theme={theme} // Pass theme to Card component
              />
            </div>
          ))}

    </div>
  )
}

export default Category