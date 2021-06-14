const routes = {
    auth: {
        me: '/me',
        login: '/login',
        register: '/signup',
    },
    app: {
        create: '/urls/short-url',
        list: '/urls',
        show: (id: string | number) => `/urls/${id}`,
        logs: (id: string | number) => `/analytics/${id}`
    }
};

export default routes;
