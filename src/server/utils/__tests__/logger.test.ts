import { beforeEach, describe, expect, it, vi } from "vitest";
import { Logger } from "../logger";

describe("Logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods
    vi.spyOn(console, "debug").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("static methods", () => {
    it("should log debug messages", () => {
      const message = "Debug message";
      const data = { key: "value" };

      Logger.debug("TestContext", message, data);

      expect(console.debug).toHaveBeenCalledWith(
        `[DEBUG] [TestContext] ${message}`,
        data,
      );
    });

    it("should log info messages", () => {
      const message = "Info message";
      const data = { key: "value" };

      Logger.info("TestContext", message, data);

      expect(console.info).toHaveBeenCalledWith(
        `[INFO] [TestContext] ${message}`,
        data,
      );
    });

    it("should log error messages", () => {
      const message = "Error message";
      const error = new Error("Test error");

      Logger.error("TestContext", message, error);

      expect(console.error).toHaveBeenCalledWith(
        `[ERROR] [TestContext] ${message}`,
        error,
      );
    });

    it("should handle undefined data in logs", () => {
      Logger.debug("TestContext", "Message");
      Logger.info("TestContext", "Message");
      Logger.error("TestContext", "Message");

      expect(console.debug).toHaveBeenCalledWith(
        "[DEBUG] [TestContext] Message",
      );
      expect(console.info).toHaveBeenCalledWith("[INFO] [TestContext] Message");
      expect(console.error).toHaveBeenCalledWith(
        "[ERROR] [TestContext] Message",
      );
    });
  });

  describe("instance methods", () => {
    it("should create logger instance with context", () => {
      const logger = Logger.for("TestContext");
      expect(logger).toBeDefined();
    });

    it("should log debug messages with context", () => {
      const logger = Logger.for("TestContext");
      const message = "Debug message";
      const data = { key: "value" };

      logger.debug(message, data);

      expect(console.debug).toHaveBeenCalledWith(
        `[DEBUG] [TestContext] ${message}`,
        data,
      );
    });

    it("should log info messages with context", () => {
      const logger = Logger.for("TestContext");
      const message = "Info message";
      const data = { key: "value" };

      logger.info(message, data);

      expect(console.info).toHaveBeenCalledWith(
        `[INFO] [TestContext] ${message}`,
        data,
      );
    });

    it("should log error messages with context", () => {
      const logger = Logger.for("TestContext");
      const message = "Error message";
      const error = new Error("Test error");

      logger.error(message, error);

      expect(console.error).toHaveBeenCalledWith(
        `[ERROR] [TestContext] ${message}`,
        error,
      );
    });

    it("should handle undefined data in instance logs", () => {
      const logger = Logger.for("TestContext");

      logger.debug("Message");
      logger.info("Message");
      logger.error("Message");

      expect(console.debug).toHaveBeenCalledWith(
        "[DEBUG] [TestContext] Message",
      );
      expect(console.info).toHaveBeenCalledWith("[INFO] [TestContext] Message");
      expect(console.error).toHaveBeenCalledWith(
        "[ERROR] [TestContext] Message",
      );
    });
  });
});
