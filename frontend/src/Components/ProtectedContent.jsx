import { useContext } from "react";
import { Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "./userContext";

export const ProtectedContent = ({children}) => {
    const context = useContext(UserContext);
    const location = useLocation();
    console.log(context.userData);
    if(context.userData?.user_id){
        return children
    } else {
        return <>Please login...</>
        // <Navigate to={'/login'} state={{from: location.pathname}}/> race condition unsolved
    }
    
    
  };
