import { Navigate } from "react-router-dom";

const AppRoute = ({children, can, redirectTo}) => {
  const able = can
  return able ? children : <Navigate to={redirectTo} />
}

export default AppRoute