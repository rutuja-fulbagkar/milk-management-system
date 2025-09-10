import { useAuthContext } from './AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutRedux } from '../redux/slices/auth/authSlice';

export const useAuth = () => {
  const { user, role, login, logout } = useAuthContext();
  const reduxUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const fullLogout = () => {
    logout(); // Clear context
    dispatch(logoutRedux()); // Clear redux
  };

  return { user: user || reduxUser, role, login, logout: fullLogout };
};
