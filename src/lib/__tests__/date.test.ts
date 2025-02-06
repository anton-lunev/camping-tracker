import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  formatDate,
  formatRange,
  getDayOfWeek,
  getFormattedDateWithoutTz,
  groupConsecutiveDates,
  toDate,
} from "../date";

describe("date utilities", () => {
  describe("getDayOfWeek", () => {
    it("returns correct weekday index for dates with timezone", () => {
      expect(getDayOfWeek("2024-03-15T00:00:00Z")).toBe(5); // Friday
    });

    it("returns correct weekday index for dates without timezone", () => {
      expect(getDayOfWeek("2024-03-15")).toBe(5);
    });

    it("returns null for invalid date format", () => {
      expect(getDayOfWeek("invalid-date")).toBeNull();
    });
  });

  describe("getFormattedDateWithoutTz", () => {
    beforeAll(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-01-01T00:00:00")); // Mock fallback date
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it("strips timezone from ISO date", () => {
      expect(getFormattedDateWithoutTz("2024-03-15T12:34:56Z")).toBe(
        "2024-03-15",
      );
    });

    it("handles dates with timezone offsets", () => {
      expect(getFormattedDateWithoutTz("2024-03-15T00:00:00-05:00")).toBe(
        "2024-03-15",
      );
    });

    it("returns same date for already clean date", () => {
      expect(getFormattedDateWithoutTz("2024-03-15")).toBe("2024-03-15");
    });

    it("falls back to current date for invalid input", () => {
      expect(getFormattedDateWithoutTz("garbage")).toBe("2024-01-01");
    });
  });

  describe("formatRange", () => {
    it("handles empty input", () => {
      expect(formatRange([])).toBe("");
    });

    it("formats single date", () => {
      expect(formatRange([toDate("2024-03-15")])).toBe("Mar 15, 2024");
    });

    it("formats multi-date ranges", () => {
      const dates = [
        toDate("2024-03-15"),
        toDate("2024-03-16"),
        toDate("2024-03-17"),
      ];
      expect(formatRange(dates)).toBe("Mar 15 – 17, 2024");
    });

    it("handles cross-year ranges", () => {
      const dates = [toDate("2023-12-31"), toDate("2024-01-01")];
      expect(formatRange(dates)).toBe("Dec 31, 2023 – Jan 1, 2024");
    });
  });

  describe("groupConsecutiveDates", () => {
    it("handles empty/null/undefined input", () => {
      expect(groupConsecutiveDates([])).toEqual([]);
      expect(groupConsecutiveDates(null)).toEqual([]);
      expect(groupConsecutiveDates(undefined)).toEqual([]);
    });

    it("groups consecutive calendar days", () => {
      const input = ["2024-03-15", "2024-03-16", "2024-03-18"];
      const result = groupConsecutiveDates(input);
      expect(result.map((group) => group.map((d) => formatDate(d)))).toEqual([
        ["2024-03-15", "2024-03-16"],
        ["2024-03-18"],
      ]);
    });

    it("sorts dates before grouping", () => {
      const input = ["2024-03-18", "2024-03-15", "2024-03-16"];
      const result = groupConsecutiveDates(input);
      expect(result[0].map((d) => formatDate(d))).toEqual([
        "2024-03-15",
        "2024-03-16",
      ]);
    });

    it("handles month boundaries", () => {
      const input = ["2024-02-28", "2024-02-29", "2024-03-01"];
      const result = groupConsecutiveDates(input);
      expect(result[0].map((d) => formatDate(d))).toEqual([
        "2024-02-28",
        "2024-02-29",
        "2024-03-01",
      ]);
    });

    it("groups dates with different times", () => {
      const input = ["2024-03-15T23:59:59", "2024-03-16T00:00:00"];
      const result = groupConsecutiveDates(input);
      expect(result[0].map((d) => formatDate(d))).toEqual([
        "2024-03-15",
        "2024-03-16",
      ]);
    });
  });

  describe("toDate", () => {
    it("handles dates without timezone", () => {
      const result = toDate("2024-03-15");
      expect(formatDate(result)).toBe("2024-03-15");
    });

    it("preserves full ISO dates", () => {
      const result = toDate("2024-03-15T12:34:56Z");
      expect(result.toISOString()).toMatch(/2024-03-15T12:34:56.000Z/);
    });
  });

  describe("formatDate", () => {
    it("uses default format", () => {
      expect(formatDate(toDate("2024-03-15"))).toBe("2024-03-15");
    });

    it("allows custom formatting", () => {
      expect(formatDate(toDate("2024-03-15"), "dd/MM/yyyy")).toBe("15/03/2024");
    });
  });
});
