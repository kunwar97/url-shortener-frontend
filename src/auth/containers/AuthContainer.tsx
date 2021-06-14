import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WebRoutes from '../../routes/WebRoutes';

export const LazyLoadedLoginPage = React.lazy(
  () => import('../components/Login/Login')
);

export const LazyLoadedRegisterPage = React.lazy(
    () => import('../components/Register/Register')
);

const AuthContainer = () => (
  <Switch>
    <Route path={WebRoutes.auth.login} component={LazyLoadedLoginPage} />
    <Route path={WebRoutes.auth.register} component={LazyLoadedRegisterPage} />
  </Switch>
);

export default AuthContainer;
