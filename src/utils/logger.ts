import chalk from "chalk";

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

export class Logger {
    private level: LogLevel;

    constructor(level: LogLevel = LogLevel.INFO) {
        this.level = level;
    }

    public debug(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.DEBUG) {
            console.log(chalk.blue(`[DEBUG] ${message}`), ...args);
        }
    }

    public info(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.INFO) {
            console.log(chalk.green(`[INFO] ${message}`), ...args);
        }
    }

    public warn(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.WARN) {
            console.log(chalk.yellow(`[WARN] ${message}`), ...args);
        }
    }

    public error(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.ERROR) {
            console.error(chalk.red(`[ERROR] ${message}`), ...args);
        }
    }
} 