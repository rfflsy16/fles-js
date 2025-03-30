import chalk from "chalk";

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

export class Logger {
    private level: LogLevel;
    private prefix: string;

    constructor(prefix: string = "", level: LogLevel = LogLevel.INFO) {
        this.level = level;
        this.prefix = prefix ? `[${prefix}] ` : "";
    }

    public debug(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(chalk.cyan(`${this.prefix}[DEBUG] ${message}`), ...args);
        }
    }

    public info(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.INFO) {
            console.info(chalk.green(`${this.prefix}[INFO] ${message}`), ...args);
        }
    }

    public warn(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.WARN) {
            console.warn(chalk.yellow(`${this.prefix}[WARN] ${message}`), ...args);
        }
    }

    public error(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.ERROR) {
            console.error(chalk.red(`${this.prefix}[ERROR] ${message}`), ...args);
        }
    }

    // Create a child logger with an additional prefix
    public child(prefix: string): Logger {
        return new Logger(`${this.prefix}${prefix}`, this.level);
    }

    // Update the log level
    public setLevel(level: LogLevel): void {
        this.level = level;
    }
}

// Create a default shared logger instance
export const logger = new Logger();
