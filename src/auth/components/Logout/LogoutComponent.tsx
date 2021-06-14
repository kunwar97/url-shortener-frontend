import React from "react";
import { Redirect } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import WebRoutes from "routes/WebRoutes";

export const LogoutComponent: React.FC<RouteComponentProps> = (props) => {
  localStorage.clear();
  return (
    <Redirect
      to = {{
        pathname: WebRoutes.auth.login,
        state   : { from: props.location }
      }}
    />
  );
};
