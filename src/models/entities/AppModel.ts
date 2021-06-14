import { observable } from "mobx";
import Model from "../Model";
import {AppStore} from "../../stores/AppStore";

export class AppModel extends Model {
    static _store: AppStore;

    @observable original_url: string;

    @observable short_url: string;

    @observable url_code: string;

    @observable user_id: string;

    @observable expiry_time: string;

}
