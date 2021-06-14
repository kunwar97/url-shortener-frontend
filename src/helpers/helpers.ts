import moment from "moment";

export const URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

export const addIncludesToParams = (params: {}, include: any[]) => {
    if (include && include.length > 0) {
        params['include'] = include.join(',');
    }
    return params;
};

export const isInvalidTime = current => {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
  };

