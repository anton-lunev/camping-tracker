type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  static currentLevel: LogLevel =
    (process.env.LOG_LEVEL as LogLevel) || "debug";

  static setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  // Static methods for direct usage
  static debug(context: string, message: string, ...args: unknown[]) {
    if (Logger.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", context, message), ...args);
    }
  }

  static info(context: string, message: string, ...args: unknown[]) {
    if (Logger.shouldLog("info")) {
      console.info(this.formatMessage("info", context, message), ...args);
    }
  }

  static warn(context: string, message: string, ...args: unknown[]) {
    if (Logger.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", context, message), ...args);
    }
  }

  static error(
    context: string,
    message: string,
    error?: unknown,
    ...args: unknown[]
  ) {
    if (this.shouldLog("error")) {
      console.error(
        this.formatMessage("error", context, message),
        ...[error, ...args].filter(Boolean),
      );
    }
  }

  // Factory method to create contextualized logger instance
  static for(context: string) {
    return {
      debug: Logger.debug.bind(Logger, context),
      info: Logger.info.bind(Logger, context),
      warn: Logger.warn.bind(Logger, context),
      error: Logger.error.bind(Logger, context),
    };
  }

  private static shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.currentLevel];
  }

  private static formatMessage(
    level: LogLevel,
    context: string,
    message: string,
  ): string {
    return `[${level.toUpperCase()}] [${context}] ${message}`;
  }
}
