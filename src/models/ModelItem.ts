import { action, computed, observable } from 'mobx';
import { ModelContainer } from './ModelContainer';
import Model from './Model';

export class ModelItem<T extends Model, F = {}> extends ModelContainer<T, F> {
  @observable private _item: T;

  @computed
  get item(): T {
    return this._item;
  }

  @action
  setItem(item: T) {
    this._item = item;
  }

  @action
  deserialize(item: any) {
    const model = this.modelClass.fromJson(item) as T;
    this.setItem(model);
    this.setLoaded(true);
    this.setError(null);
  }

  async load(
    url: string,
    params?: { [p: string]: any },
    config?: {
      dataKey?: string;
      forceRefresh?: boolean;
      itemId?: number | string;
    },
  ) {
    const forceRefresh = config && config.forceRefresh;
    const itemId = config && config.itemId;

    const item = this.modelClass.get(itemId) as T;

    if (item && !forceRefresh) {
      this.setItem(item);
      this.setLoaded(true);
      return;
    }
    return super.load(url, params, config);
  }
}
