import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SET_LOGIN } from '../redux/features/auth/authSlice';
import { getLoginStatus } from '../services/authServices';
import { toast } from 'react-toastify';

const useRedirectLoggedOutUser = (path) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const redirectLoggedOutUser = async () => {
            const status = await getLoginStatus();
            dispatch(SET_LOGIN(status));

            if (!status) {
                toast.info("Session expired, please login to continue!!");
                navigate(path);
                return;
            }
        }
        redirectLoggedOutUser();
    }, [dispatch, navigate, path]);
}

export default useRedirectLoggedOutUser;