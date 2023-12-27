import React, { useEffect } from 'react';
import { AiFillDollarCircle } from 'react-icons/ai';  // earning icon
import { BiCategory } from 'react-icons/bi';  // cateforyicon
import { BsCart4, BsCartX } from 'react-icons/bs';  // productIcon
import InfoBox from '../../infobox/InfoBox';
import './productSummary.css';
import { useDispatch, useSelector } from 'react-redux';
import { CALC_STORE_VALUE, selectTotalStoreValue } from '../../../redux/features/product/productSlice';


const ProductSummary = ({ products }) => {
  const dispatch = useDispatch();
  const totalStoreValue = useSelector(selectTotalStoreValue);

  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products));
  }, [dispatch, products]);

  return (
    <div className='product-summary'>
      <h3>Inventory Stats</h3>
      <div className='info-summary'>
        <InfoBox icon={<BsCart4 size={40} color='#fff' />} title={"Total Products"} count={products.length} bgColor='purple' />
        <InfoBox icon={<AiFillDollarCircle size={40} color='#fff' />} title={"Total Store Value"} count={''} bgColor='green' />
        <InfoBox icon={<BsCartX size={40} color='#fff' />} title={"Out of Stock"} count={''} bgColor='red' />
        <InfoBox icon={<BiCategory size={40} color='#fff' />} title={"All Categories"} count={''} bgColor='blue' />
      </div>
    </div>
  )
}

export default ProductSummary;