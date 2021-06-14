import { action, computed, IObservableArray, observable } from 'mobx';
import { ModelContainer } from './ModelContainer';
import Model from './Model';

export class ModelList<T extends Model, F = {}> extends ModelContainer<T, F> {
  @observable protected _items: IObservableArray<T>;

  constructor(protected modelClass: typeof Model) {
    super(modelClass);
    this._items = observable([]);
  }

  get hasError() {
    return !!this.error;
  }

  @computed
  get items() {
    return this._items.filter((item) => !item.deleted);
  }

  @action
  setItems(items: T[]) {
    this._items.clear();
    this.appendItems(items);
  }

  @action
  appendItems(items: T[]) {
    this._items.push(...items);
  }

  @action
  appendItem(item: T) {
    this._items.push(item);
  }

  @action
  deserialize(items: any[]) {
    if (!items) {
      this.loaded = true;
      return;
    }
    const models = items.map((item) => this.modelClass.fromJson(item) as T);
    this.setItems(models);
    this.loaded = true;
  }
}
