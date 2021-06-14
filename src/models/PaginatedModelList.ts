import { action, computed, observable } from "mobx";
import { debounce } from "lodash";

import Model from "./Model";
import { ModelList } from "./ModelList";

export interface LinksProps {
  first?: string;
  last?: string;
  prev?: string;
  next?: string;
}

export interface MetaProps {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
  search?: string;
}

export class PaginatedModelList<T extends Model, F = {}> extends ModelList<T,
  F> {
  @observable isLoadingNextPage: boolean;
  @action setIsLoadingNextPage = (loading) => this.isLoadingNextPage = loading;

  @observable private _links?: LinksProps;

  @observable private _meta?: MetaProps;

  constructor(protected modelClass: typeof Model) {
    super(modelClass);
  }

  @computed
  get totalPages() {
    return this._meta?.total || 1;
  }

  @computed
  get perPage() {
    return this._meta?.per_page || 10;
  }

  @computed
  get lastPage() {
    return this._meta?.last_page || 1;
  }

  @computed
  get currentPage() {
    return this._meta?.current_page || 1;
  }

  @computed
  get firstPageUrl() {
    return this._links?.first || "";
  }

  @computed
  get lastPageUrl() {
    return this._links?.last || "";
  }

  @computed
  get isFirstPage() {
    return this.currentPage === 1;
  }

  @computed
  get isLastPage() {
    return this.lastPage === this.currentPage;
  }

  @computed
  get isLoadedAll() {
    return this.lastPage && this.loaded;
  }

  @computed
  get nextPage() {
    return this.currentPage + 1;
  }

  @computed
  get prevPage() {
    return this.currentPage - 1;
  }

  async loadNext() {
    if (this.isLastPage) {
      return;
    }
    this.setIsLoadingNextPage(true);
    await super.load(
      this.url,
      { ...this.params, page: this.nextPage },
      { dataKey: null }
    );
  }

  async load(url: string, params?: { [key: string]: any; page?: number }, config?: { dataKey?: string; forceRefresh?: boolean }) {
    await super.load(url, params, { dataKey: config?.dataKey || null, forceRefresh: config?.forceRefresh });
  }

  search = debounce(async (searchQuery, searchKey = "search_query") => {
    this.loading && this.cancelRequest();
    await super.load(this.url, { ...this.params, page: 1, [searchKey]: searchQuery }, { dataKey: null });
  }, 500);

  @action
  protected onSuccess(response) {
    this._meta  = response.meta;
    this._links = response.links;
    super.onSuccess(response.data);
  }

  @action
  deserialize(items: any[]) {
    if (!items) {
      this.setLoaded(true);
      return;
    }
    const models = items.map((item) => this.modelClass.fromJson(item) as T);
    if (this.isLoadingNextPage) {
      this.appendItems(models);
      this.setIsLoadingNextPage(false);
    } else {
      this.setItems(models);
    }
    this.setLoaded(true);
  }

  @action
  cancelRequest() {
    this.setLoading(false);
    this.setIsLoadingNextPage(false);
    this.apiService.cancelRequest(this.requestId);
  }
}
