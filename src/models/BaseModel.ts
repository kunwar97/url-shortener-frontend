import Model from './Model';

// This model will go away once all models starts using new model structure.

export abstract class BaseModel extends Model {
  static _fromJson(json: Record<string, any>): BaseModel {
    const entity = new (this as any)();
    entity.updateFromJson(json as any);
    return entity;
  }

  static _get(id: string | number): BaseModel | null {
    return null;
  }
}

export default BaseModel;
