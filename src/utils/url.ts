/** Constructs a URL with query parameters. */
export function constructUrl(
  baseUrl: string,
  queryParams: Record<string, string | number | boolean> = {},
) {
  const url = new URL(baseUrl);
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return url.toString();
}
