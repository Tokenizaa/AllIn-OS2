export var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
export class LoggerService {
    static instance;
    logs = [];
    maxLogs = 1000;
    constructor() { }
    static getInstance() {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }
    log(level, message, context, metadata) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            metadata,
        };
        this.logs.push(entry);
        // Keep only the last maxLogs entries
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
        // Also log to console in development
        const isDev = import.meta.env?.DEV || process.env.NODE_ENV === 'development';
        if (isDev) {
            const consoleMethod = level === LogLevel.ERROR ? "error" : level === LogLevel.WARN ? "warn" : "log";
            console[consoleMethod](`[${entry.timestamp}] [${level.toUpperCase()}]${context ? ` [${context}]` : ""}: ${message}`, metadata || "");
        }
    }
    debug(message, context, metadata) {
        this.log(LogLevel.DEBUG, message, context, metadata);
    }
    info(message, context, metadata) {
        this.log(LogLevel.INFO, message, context, metadata);
    }
    warn(message, context, metadata) {
        this.log(LogLevel.WARN, message, context, metadata);
    }
    error(message, context, metadata) {
        this.log(LogLevel.ERROR, message, context, metadata);
    }
    getLogs(level, context) {
        let filtered = this.logs;
        if (level) {
            filtered = filtered.filter((log) => log.level === level);
        }
        if (context) {
            filtered = filtered.filter((log) => log.context === context);
        }
        return filtered;
    }
    clearLogs() {
        this.logs = [];
    }
}
export const logger = LoggerService.getInstance();
