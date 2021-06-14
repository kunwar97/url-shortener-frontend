import { action, computed, observable } from "mobx";
import { isEqual } from "lodash";
import { CustomError } from "./CustomError";
import Model from "./Model";
import { ApiService } from "../services/ApiService";

export abstract class ModelContainer<T extends Model, F = {}> {
  @observable error: CustomError;

  @action setError = (e: CustomError) => (this.error = e);

  @observable loading = false;

  @action setLoading = (loading: boolean) => (this.loading = loading);

  @observable loaded = false;

  @action setLoaded = (loaded: boolean) => (this.loaded = loaded);

  protected url: string;

  protected params: { [key: string]: any };

  protected requestId: string;

  constructor(
    protected modelClass: typeof Model,
    protected apiService = ApiService.getInstance()
  ) {
  }

  @computed
  get hasError() {
    return !!this.error;
  }

  @action
  async load(
    url: string,
    params?: { [key: string]: any },
    config?: { dataKey?: string; forceRefresh?: boolean }
  ) {
    const dataKey      = config?.dataKey === undefined ? "data" : config.dataKey;
    const forceRefresh = config && config.forceRefresh;

    const isSameUrl     = this.url === url;
    const areSameParams =
            (!this.params && !params) || isEqual(this.params, params);
    const isSameRequest = isSameUrl && areSameParams;

    if (isSameRequest && this.loaded && !forceRefresh) {
      return;
    }

    if (this.loading) {
      if (isSameRequest) {
        return;
      }
      this.apiService.cancelRequest(this.requestId);
    }

    this.setError(null);
    this.setLoaded(false);
    this.setLoading(true);
    this.url       = url;
    this.params    = params;
    this.requestId = this.apiService.generateRequsetId();

    try {
      const response = await this.apiService.get(
        url,
        params,
        null,
        this.requestId
      );
      const data     = dataKey ? response[dataKey] : response;
      this.onSuccess(data);
    } catch (e) {
      this.onError(e);
    }
  }

  abstract deserialize(data: any);

  @action
  protected onSuccess(response) {
    this.setLoaded(true);
    this.setLoading(false);
    this.deserialize(response);
  }

  @action
  protected onError(error) {
    this.setLoaded(true);
    this.setLoading(false);
    this.setError(error);
    throw error;
  }
}
