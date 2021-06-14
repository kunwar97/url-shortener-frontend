class AuthService {
  static getInstance(): AuthService {
    return new AuthService();
  }

  get authToken() {
    return localStorage.getItem('auth_token');
  }

  setAuthToken = (token: string) => {
    localStorage.setItem('auth_token', `bearer ${token}`);
  };

  clearAuthToken(){
    localStorage.removeItem('auth_token');
  }

  get hasAuthToken() {
    return !!this.authToken;
  }
}

export const authService = AuthService.getInstance();
