import { action, observable, ObservableMap } from 'mobx';
import { ApiService } from '../services/ApiService';
import Model from '../models/Model';

export type EntityIdentifier = string | number;

export abstract class Store<M extends Model> {
  protected apiService = ApiService.getInstance();

  entities = new ObservableMap<EntityIdentifier, M>();

  @observable searchFilterParam: { [key: string]: any } = {};

  get(id: EntityIdentifier): M {
    return this.entities.get(id);
  }

  @action
  push(entity: M) {
    this.entities.set(entity.id, entity);
  }
}

export default Store;
