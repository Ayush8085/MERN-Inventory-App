import { Link, useNavigate } from "react-router-dom";
import "./authStyle.css";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { SET_LOGIN, SET_NAME } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';
import { loginUser, validateEmail } from "../../services/authServices";
import { useState } from "react";

const initialState = {
  email: "",
  password: "",
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const { email, password } = formData;


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required!!");
    }

    if (password.length < 6) {
      return toast.error("Password must be atleast 6 characters!!");
    }

    if (!validateEmail(email)) {
      return toast.error("Enter a valid email!!");
    }


    const userData = {
      email, password
    }

    setIsLoading(true);

    try {
      const data = await loginUser(userData);
      // console.log("USER_DATA_FROM_BACKEND: ", data);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log((error.message));
    }
  }


  return (
    <div className="container">
      {isLoading && <Loader />}
      <div className='card'>
        <h1>Login</h1>
        <form onSubmit={login}>
          <input type="email" name='email' placeholder='Enter email' required value={email} onChange={handleInputChange} />
          <input type="password" name='password' placeholder='Enter password' required value={password} onChange={handleInputChange} />
          <button type="submit">Login</button>
        </form>
        <div className='card-footer'>
          <p>
            <Link to="/forgot">
              Forgot Password
            </Link>
          </p>
          <div className="right-cart-footer">
            <p>Don't have an account?</p>
            <span>
              <Link to="/register">Register</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;