import useAuth from '../Hooks/useAuth'
import { Navigate } from 'react-router';

export default function ProtectedRoute({children}) {

    const {isAuthenticated, loading} = useAuth();

    if(loading) return <div>Loading...</div>;
    
    return (isAuthenticated) ? children : <Navigate to="/login" replace />;

}
