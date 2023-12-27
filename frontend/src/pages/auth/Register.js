import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { registerUser, validateEmail } from '../../services/authServices';
import { useDispatch } from 'react-redux';
import { SET_LOGIN, SET_NAME } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
}

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const { name, email, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !password2) {
      return toast.error("All fields are required!!");
    }

    if (password.length < 6) {
      return toast.error("Password must be atleast 6 characters!!");
    }

    if (!validateEmail(email)) {
      return toast.error("Enter a valid email!!");
    }

    if (password !== password2) {
      return toast.error("Password must match!!");
    }

    const userData = {
      name, email, password
    }

    setIsLoading(true);

    try {
      const data = await registerUser(userData);
      // console.log("USER_DATA_FROM_BACKEND: ", data);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return toast.error(error.message);
    }

  };

  return (
    <div className="container">
      {isLoading && <Loader />}
      <div className='card'>
        <h1>Register</h1>
        <form onSubmit={register}>
          <input type="text" name='name' placeholder='Enter name' required value={name} onChange={handleInputChange} />
          <input type="email" name='email' placeholder='Enter email' required value={email} onChange={handleInputChange} />
          <input type="password" name='password' placeholder='Enter password' required value={password} onChange={handleInputChange} />
          <input type="password" name='password2' placeholder='Confirm password' required value={password2} onChange={handleInputChange} />
          <button type="submit">Register</button>
        </form>
        <div className='card-footer'>
          <p>
            Welcome to my app!
          </p>
          <div className="right-cart-footer">
            <p>Already have an account?</p>
            <span>
              <Link to="/login">Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register