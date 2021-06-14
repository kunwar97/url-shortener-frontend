const routes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  app: {
    home: '/app/',
    myUrls: {
      list: '/app/my-urls',
      details: '/app/my-urls/:id',
      logs: '/app/url-logs/:id'
    }
  }
};

export default routes;
