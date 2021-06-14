import { action, observable } from 'mobx';
import Store, { EntityIdentifier } from 'stores/Store';

export interface ModelJson {
  id: string;

  [key: string]: any;
}

export abstract class Model {
  protected omittedKeys: string[] = [];

  @observable deleting = false;

  @observable deleted = false;

  @observable updating = false;

  @observable updated = false;

  @observable selected = false;

  @observable created_at: string;

  @observable updated_at: string;

  @action delete() {
    this.deleted = true;
  }

  @action setIsSelected(selected) {
    this.selected = selected;
  }

  @action
  setDeleting(value) {
    this.deleting = value;
  }

  @action
  setUpdating(value) {
    this.updating = value;
  }

  toggleSelected() {
    this.setIsSelected(!this.selected);
  }

  constructor(readonly id: EntityIdentifier) {}

  static getStore(): Store<Model> {
    const store = (this as any)._store;
    if (!store) {
      console.error(`_store not defined in ${this}
            Please define _store and assign 'this' to it in parent store's constructor`);
    }
    return store;
  }

  static fromJson(json: ModelJson, identifierKey = 'id'): Model | null {
    if (!json) {
      return null;
    }
    const id = json[identifierKey] as EntityIdentifier;
    const entity = this.getOrNew(id);
    entity.updateFromJson(json);
    return entity;
  }

  static getOrNew(id: EntityIdentifier): Model {
    let entity = this.getStore().get(id);

    if (!entity) {
      entity = new (this as any)(id);
      this.getStore().push(entity!);
    }

    return entity!;
  }

  static get(id: EntityIdentifier) {
    return this.getStore().get(id);
  }

  @action
  updateFromJson(json: ModelJson) {
    for (const k in json) {
      if (!json.hasOwnProperty(k)) {
        continue;
      }
      if (this.omittedKeys && this.omittedKeys.indexOf(k) !== -1) {
        continue;
      }
      const deserializer = this.getDeserializer(k);
      if (deserializer) {
        json[k] && deserializer.bind(this)(json[k]);
      } else if (this[k] && this[k].deserialize) {
        this[k].deserialize(json[k]?.hasOwnProperty("data") ? json[k].data: json[k]);
      } else {
        this[k] = json[k];
      }
    }
  }

  private getDeserializer(prop: string) {
    const _methodName = `deserialize_${prop}`;
    return this[_methodName];
  }
}

export default Model;
