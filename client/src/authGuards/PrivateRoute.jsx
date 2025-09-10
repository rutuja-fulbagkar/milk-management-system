import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/UseAuth';

const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
