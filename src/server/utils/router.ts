import { isNil } from "lodash";

export const router = {
  resolve: (
    url: string,
    params?: Record<string, string | number | boolean | undefined | null>,
    queryParams?: Record<string, string | number | boolean>,
  ) => {
    let resolvedUrl = url;

    if (params) {
      const { pathname } = new URL(url, "https://test.io"); // Use a dummy base URL to parse relative URLs
      const resolvedPathname = pathname
        .split("/")
        .map((segment) => {
          if (segment.startsWith(":")) {
            const paramName = segment.substring(1);
            const value = params[paramName];
            if (isNil(value)) {
              throw new Error(`Missing parameter: ${paramName}`);
            }
            return value;
          }
          return segment;
        })
        .join("/");
      resolvedUrl = resolvedUrl.replace(pathname, resolvedPathname);
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
