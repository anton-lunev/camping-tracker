import { isNil } from "lodash";

export const router = {
  resolve: (
    url: string,
    params?: Record<string, string | number | boolean | undefined | null>,
    queryParams?: Record<string, string | number | boolean>,
  ) => {
    let resolvedUrl = url;

    if (params) {
      resolvedUrl = url.replace(/:(\w+)/g, (_, key) => {
        if (isNil(params[key])) {
          throw new Error(`Missing param: ${key} in ${url}`);
        }
        return params[key].toString();
      });
      const missingParams = resolvedUrl.match(/:(\w+)/g);
      if (missingParams) {
        throw new Error(
          `Missing params: ${missingParams.join(", ")} in ${url}`,
        );
      }
    }

    if (queryParams) {
      const urlInstance = new URL(resolvedUrl);
      Object.entries(queryParams).forEach(([key, value]) => {
        urlInstance.searchParams.append(key, value.toString());
      });
      resolvedUrl = urlInstance.toString();
    }
    return resolvedUrl;
  },
};
