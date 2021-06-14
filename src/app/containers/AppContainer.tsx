import React from 'react';
import { RouteComponentProps, Switch } from 'react-router-dom';
import { Button, Layout, notification, Typography } from 'antd';
import WebRoutes from '../../routes/WebRoutes';
import { ProtectedRoute } from '../../guards';
import { inject, observer } from 'mobx-react';
import { AUTH_STORE } from '../../constants/stores';
import { AuthStore } from '../../stores/AuthStore';
import Loader from 'shared-components/Loader/Loader';

const { Header, Content } = Layout;
const { Title } = Typography;

const LazyLoadedCreateTinyUrlPage = React.lazy(
  () => import('../components/CreateTinyUrl/CreateTinyUrl')
);
const LazyLoadedMyUrlsListPage = React.lazy(
  () => import('../components/MyUrlsList/MyUrlsList')
);

const LazyLoadedUrlLogsPage = React.lazy(
  () => import('../components/Analytics/Analytics')
);

interface AppContainerProps extends RouteComponentProps {
  [AUTH_STORE]?: AuthStore;
}

class AppContainer extends React.Component<AppContainerProps, any> {
  get authStore() {
    return this.props.authStore;
  }

  get loggedInUser() {
    return this.authStore?.loggedInUser;
  }

  get loading() {
    return this.authStore?.isLoadingLoggedInUser;
  }

  componentDidMount() {
    try {
      if (!this.loggedInUser) {
        this.authStore.me();
      }
    } catch (e) {
      notification.error({ message: e.message, duration: 2 });
    }
  }

  handleCreateUrls = () => {
    this.props.history.push(WebRoutes.app.home);
  };

  handleMyUrls = () => {
    this.props.history.push(WebRoutes.app.myUrls.list);
  };

  get dashboardRoutes() {
    return (
      <Switch>
        <ProtectedRoute
          exact
          path={WebRoutes.app.home}
          component={LazyLoadedCreateTinyUrlPage}
        />
        <ProtectedRoute
          exact
          path={WebRoutes.app.myUrls.list}
          component={LazyLoadedMyUrlsListPage}
        />
        <ProtectedRoute
          path={WebRoutes.app.myUrls.logs}
          component={LazyLoadedUrlLogsPage}
        />
      </Switch>
    );
  }

  render() {
    if (this.loading || !this.loggedInUser) {
      return <Loader />;
    }

    return (
      <Layout className="w-full h-full">
        <Header className="flex items-center bg-white px-8">
          <Title level={3} onClick={this.handleCreateUrls}>
            Url Shortener
          </Title>
          <div className="flex-grow" />
          <Button type="link" onClick={this.handleCreateUrls}>
            Create Tiny URL
          </Button>
          <Button type="link" onClick={this.handleMyUrls}>
            My Urls
          </Button>
        </Header>
        <Content className="bg-white p-8">{this.dashboardRoutes}</Content>
      </Layout>
    );
  }
}

export default inject(AUTH_STORE)(observer(AppContainer));
