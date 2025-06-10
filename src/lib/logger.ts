// Centralized logging utility

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

const log = (level: LogLevel, message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, you might want to send logs to a logging service
    if (level === LogLevel.ERROR) {
      console.error(`[${level.toUpperCase()}]`, message, ...args);
    } else if (level === LogLevel.WARN) {
      console.warn(`[${level.toUpperCase()}]`, message, ...args);
    } else {
      console.log(`[${level.toUpperCase()}]`, message, ...args);
    }
  } else {
    // In development, log everything with more detail
    const timestamp = new Date().toISOString();
    const style = 'background: #222; color: #bada55; padding: 2px 4px; border-radius: 3px;';
    
    console.group(`%c${timestamp} [${level.toUpperCase()}]`, style);
    console.log(message, ...args);
    
    // For errors, include the stack trace
    if (level === LogLevel.ERROR && args[0] instanceof Error) {
      console.error(args[0].stack);
    }
    
    console.groupEnd();
  }
};

export const logger = {
  error: (message: string, ...args: any[]) => log(LogLevel.ERROR, message, ...args),
  warn: (message: string, ...args: any[]) => log(LogLevel.WARN, message, ...args),
  info: (message: string, ...args: any[]) => log(LogLevel.INFO, message, ...args),
  debug: (message: string, ...args: any[]) => log(LogLevel.DEBUG, message, ...args),
};

export default logger;
