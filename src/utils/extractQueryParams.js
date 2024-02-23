export function extractQueryParams(query) {
  return query && query.substr(1).split("&").reduce((queryParams, param) => {
    const [key, value] = param.split("=");
    queryParams[key] = value;
    return queryParams;
  }, {});
}