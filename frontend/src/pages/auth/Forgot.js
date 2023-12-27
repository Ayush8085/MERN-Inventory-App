import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { forgotPassword, validateEmail } from '../../services/authServices';

const Forgot = () => {
  const [email, setEmail] = useState("");

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const forgotpassword = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error('Email field cannot be empty!!');
    }

    if (!validateEmail(email)) {
      return toast.error("Invalid email!!");
    }

    const userData = {
      email,
    }

    await forgotPassword(userData);
    setEmail("");


  }


  return (
    <div className="container">
      <div className='card'>
        <h1>Forgot Password</h1>
        <form onSubmit={forgotpassword}>
          <input type="email" name='email' placeholder='Enter email' required value={email} onChange={handleInputChange} />
          <button type="submit">Send reset email</button>
        </form>
        <div className='card-footer'>
          <p>
            Welcome to my app!
          </p>
          <div className="right-cart-footer">
            <span>
              <Link to="/login">Login</Link> ?
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forgot