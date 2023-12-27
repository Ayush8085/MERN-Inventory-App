import { useDispatch, useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../customHooks/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import { useEffect } from "react";
import { getProducts } from "../../redux/features/product/productSlice";
import ProductList from "../product/productList/ProductList";
import ProductSummary from "../product/productSummary/ProductSummary";
import './dashboard.css'


const Dashboard = () => {
  useRedirectLoggedOutUser('/login');

  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { products, isLoading, isError, message } = useSelector((state) => state.product);

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProducts());
    }
    console.log("PRODUCTS: ", products);

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  return (
    <div className="dashboard">
      <ProductSummary products={products} />
      <ProductList products={products} isLoading={isLoading} />
    </div>
  )
}

export default Dashboard;