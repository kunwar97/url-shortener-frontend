import { action, computed, observable } from "mobx";
import Store from "./Store";
import { ModelItem } from "../models/ModelItem";
import {AppModel} from "../models/entities/AppModel";
import ApiRoutes from "routes/ApiRoutes";
import {ModelList} from "../models/ModelList";

export class AppStore extends Store<AppModel> {
    @observable appList = new ModelList<AppModel>(AppModel);

    @observable appItem = new ModelItem<AppModel>(AppModel);

    constructor() {
        super();
        AppModel._store = this;
    }

    @computed get apps() {
        return this.appList.items;
    }

    @computed get app() {
        return this.appItem.item;
    }

    async fetchApps(params?: { [key: string]: any }) {
        return this.appList.load(ApiRoutes.app.list, params);
    }

     async fetchAppFromId(id: string) {
        return this.appItem.load(ApiRoutes.app.show(id));
    }

    @action
    async fetchAppLogs(id: string) {
        return this.apiService.get(ApiRoutes.app.logs(id));
    }

    @action
    async createApp(body: { [key: string]: any }) {
        const response = await this.apiService.post(ApiRoutes.app.create, body);
        let app: AppModel = AppModel.fromJson(response.data) as AppModel;
        this.appItem.setItem(app);
        return app;
    }

    @action
    async updateApp(app: AppModel) {
        app.setUpdating(true);
        const response = await this.apiService.patch(ApiRoutes.app.show(app.id), app);
        app.setUpdating(false);
        app.updateFromJson(response.data);
        return app;
    }

    @action
    async deleteApp(app: AppModel) {
        app.setDeleting(true);
        await this.apiService.delete(ApiRoutes.app.show(app.id));
        app.setDeleting(false);
        app.delete();
        this.appList.setItems(this.appList.items.filter(item => item.id !== app.id));
    }
}
