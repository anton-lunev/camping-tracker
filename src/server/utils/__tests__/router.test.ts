import { describe, expect, test } from "vitest";
import { router } from "../router";

describe("router.resolve()", () => {
  describe("path parameters", () => {
    test("replaces single path parameter", () => {
      const result = router.resolve("https://example.com/users/:id", {
        id: 123,
      });
      expect(result).toBe("https://example.com/users/123");
    });

    test("replaces multiple path parameters", () => {
      const result = router.resolve("/api/:version/:resource", {
        version: "v1",
        resource: "posts",
      });
      expect(result).toBe("/api/v1/posts");
    });

    test("handles numeric parameter values", () => {
      const result = router.resolve("/user/:id", { id: 42 });
      expect(result).toBe("/user/42");
    });

    test("throws error for missing parameter", () => {
      expect(() => router.resolve("/users/:id", {})).toThrowError(
        "Missing param: id",
      );
    });

    test("preserves special characters in parameters", () => {
      const result = router.resolve("/search/:query", { query: "hello world" });
      expect(result).toBe("/search/hello world");
    });
  });

  describe("query parameters", () => {
    test("adds query parameters to absolute URL", () => {
      const result = router.resolve("https://example.com/search", undefined, {
        q: "test",
        page: 2,
      });
      expect(result).toBe("https://example.com/search?q=test&page=2");
    });

    test("merges with existing query parameters", () => {
      const result = router.resolve(
        "https://example.com?filter=new",
        undefined,
        { sort: "date" },
      );
      expect(result).toBe("https://example.com/?filter=new&sort=date");
    });

    test("handles boolean query parameters", () => {
      const result = router.resolve("https://example.com", undefined, {
        active: true,
      });
      expect(result).toBe("https://example.com/?active=true");
    });

    test("handles numeric query parameters", () => {
      const result = router.resolve("https://example.com", undefined, {
        count: 42,
      });
      expect(result).toBe("https://example.com/?count=42");
    });

    test("preserves hash fragment", () => {
      const result = router.resolve("https://example.com/#section", undefined, {
        param: "value",
      });
      expect(result).toBe("https://example.com/?param=value#section");
    });

    test("throws when adding query params to relative URL", () => {
      expect(() =>
        router.resolve("/relative", undefined, { param: "value" }),
      ).toThrow();
    });
  });

  describe("edge cases", () => {
    test("returns original URL when no parameters", () => {
      const url = "https://example.com";
      expect(router.resolve(url)).toBe(url);
    });

    test("handles combined path and query parameters", () => {
      const result = router.resolve(
        "https://example.com/:type",
        { type: "posts" },
        { page: 2 },
      );
      expect(result).toBe("https://example.com/posts?page=2");
    });

    test("handles complex URL structure", () => {
      const result = router.resolve(
        "https://example.com/:category/:id?existing=1#section",
        { category: "books", id: 42 },
        { newParam: "value" },
      );
      expect(result).toBe(
        "https://example.com/books/42?existing=1&newParam=value#section",
      );
    });

    test("handles empty query parameters object", () => {
      const result = router.resolve("https://example.com", undefined, {});
      expect(result).toBe("https://example.com/");
    });
  });
});
