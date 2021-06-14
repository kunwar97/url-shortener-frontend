import { observable } from "mobx";
import Model from '../Model';
import {AuthStore} from "../../stores/AuthStore";

export class User extends Model {
  static _store: AuthStore;

  @observable first_name: string;

  @observable last_name?: string;

  @observable email: string;

  get fullname() {
    if (this.last_name) {
      return this.first_name + ' ' + this.last_name;
    }
    return this.first_name;
  }
}