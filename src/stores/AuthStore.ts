import { action, observable } from 'mobx';
import { ApiService } from '../services/ApiService';
import ApiRoutes from '../routes/ApiRoutes';
import { User } from '../models/entities/UserModel';
import { authService } from '../services/AuthService';
import Store from './Store';
import { ModelItem } from "../models/ModelItem";

export class AuthStore extends Store<User> {
  @observable isLoadingLoggedInUser: boolean;

  @action setIsLoadingLoggedInUser = loading =>
    (this.isLoadingLoggedInUser = loading);

  @observable
  loggedInUser = new ModelItem<User>(User);

  protected apiService = ApiService.getInstance();

  constructor() {
    super();
    User._store = this;
  }

  @action
  setLoggedInUser = (user: any) => {
    this.loggedInUser.setItem(User.fromJson(user) as User);
  };
  @action
  async login(email: string, password: string) {
    const response = await this.apiService.post(ApiRoutes.auth.login, {
      email,
      password,
    });
    console.log(response);
    authService.setAuthToken(response.token);
    this.setLoggedInUser(response.user);
  }

  @action
  async me() {
    try {
      this.setIsLoadingLoggedInUser(true);
      const response = await this.apiService.get(ApiRoutes.auth.me);
      this.setLoggedInUser(response.data);
    } catch (e) {
      authService.clearAuthToken();
      throw e;
    } finally {
      this.setIsLoadingLoggedInUser(false);
    }
  }

  @action
  async signup(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) {
    const response = await this.apiService.post(ApiRoutes.auth.register, {
      first_name,
      last_name,
      email,
      password,
    });
    authService.setAuthToken(response.token);
    this.setLoggedInUser(response.user);
  }
}
