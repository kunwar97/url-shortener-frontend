import { ProtectedRoute, PublicRoute } from 'guards';
import { Provider } from 'mobx-react';
import React, { Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { createStores } from 'stores';
import WebRoutes from './routes/WebRoutes';
import Loader from './shared-components/Loader/Loader';

const LazyLoadedAuthContainer = React.lazy(
  () => import('./auth/containers/AuthContainer')
);

const LazyLoadedAppContainer = React.lazy(
  () => import('./app/containers/AppContainer')
);

const App = () => {
  return (
    <Provider {...createStores()}>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Redirect to={WebRoutes.app.home} />}
            />
            <PublicRoute path="/auth" component={LazyLoadedAuthContainer} />
            <ProtectedRoute path="/app/*" component={LazyLoadedAppContainer} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
