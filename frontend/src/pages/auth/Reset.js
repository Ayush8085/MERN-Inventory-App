import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { resetPassword } from '../../services/authServices';

const initialState = {
  password: "",
  password2: "",
}

const Reset = () => {
  const [formData, setFormData] = useState(initialState);
  const { password, password2 } = formData;
  const {resetToken} = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be atleast 6 characters!!");
    }
  
    if (password !== password2) {
      return toast.error("Password must match!!");
    }

    const userData = {
      password, password2
    }

    try {
      const data = await resetPassword(userData, resetToken);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
    }
  }
  


  return (
    <div className="container">
      <div className='card'>
        <h1>Reset Password</h1>
        <form onSubmit={reset}>
          <input type="password" name='password' placeholder='Enter password' required value={password} onChange={handleInputChange} />
          <input type="password" name='password2' placeholder='Confirm password' required value={password2} onChange={handleInputChange} />
          <button type="submit">Reset password</button>
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

export default Reset;