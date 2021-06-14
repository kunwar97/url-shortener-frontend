import { AuthStore } from './AuthStore';
import {AppStore} from "./AppStore";
import {
  APP_STORE,
  AUTH_STORE,
} from '../constants/stores';


let stores = null;

export function createStores() {
  if (!stores) {
    stores = createStoresInstance();
  }
  return stores;
}

export function createStoresInstance() {
  return {
    [APP_STORE]: new AppStore(),
    [AUTH_STORE]: new AuthStore(),
  };
}