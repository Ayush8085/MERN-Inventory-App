import { Link, useNavigate } from "react-router-dom";
import './header.css';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../services/authServices";
import { SET_LOGIN, selectName } from "../../redux/features/auth/authSlice";


const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = useSelector(selectName);

    const logout = async () => {
        await logoutUser();
        await dispatch(SET_LOGIN(false));
        navigate("/login");
    }

    return (
        <>
            <header>
                <div className="left-header">
                    <span className="left-header-span">
                        Welcome,
                    </span>
                    <span className="right-header-span">
                        {name}
                    </span>
                </div>
                <div className="right-header">
                    <button onClick={logout}>
                        <Link to="/logout">
                            Logout
                        </Link>
                    </button>
                </div>
            </header>
            <hr />
        </>
    )
}

export default Header