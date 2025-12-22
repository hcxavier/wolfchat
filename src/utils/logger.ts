type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private static formatMessage(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  static info(message: string, data?: unknown) {
    const entry = this.formatMessage('info', message, data);
    console.info(`[INFO] ${entry.timestamp}: ${entry.message}`, entry.data || '');
  }

  static warn(message: string, data?: unknown) {
    const entry = this.formatMessage('warn', message, data);
    console.warn(`[WARN] ${entry.timestamp}: ${entry.message}`, entry.data || '');
  }

  static error(message: string, data?: unknown) {
    const entry = this.formatMessage('error', message, data);
    console.error(`[ERROR] ${entry.timestamp}: ${entry.message}`, entry.data || '');
  }

  static debug(message: string, data?: unknown) {
    if (import.meta.env.DEV) {
      const entry = this.formatMessage('debug', message, data);
      console.debug(`[DEBUG] ${entry.timestamp}: ${entry.message}`, entry.data || '');
    }
  }
}

export default Logger;
