import { LogoutComponent } from "auth/components/Logout/LogoutComponent";
import React from "react";
import { Route } from "react-router";

import { authService } from "services/AuthService";

const ProtectedRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  if (!authService.hasAuthToken) {
    return (
      <Route
        {...rest}
        render = {(props) => (
          <LogoutComponent {...props}/>
        )}
      />
    );
  }

  return <Route {...rest} render = {(props) => <Component {...props} />}/>;
};

export default ProtectedRoute;
