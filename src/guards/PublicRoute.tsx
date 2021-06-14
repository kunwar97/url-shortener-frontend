import React from 'react';
import { Redirect, Route } from 'react-router';
import { authService } from 'services/AuthService';

const PublicRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  if (authService.hasAuthToken) {
    return (
      <Route
        {...rest}
        render={(props) => (
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        )}
      />
    );
  }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default PublicRoute;
