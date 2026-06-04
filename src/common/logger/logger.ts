export class Logger {
  readonly levels: string[];
  readonly currentLevel: string;

  constructor() {
    this.levels = ['debug', 'info', 'warning', 'error'];
    this.currentLevel = process.env.LOG_LEVEL || 'warning';
  }

  shouldLog(level: string): Boolean {
    return this.levels.indexOf(level) >= this.levels.indexOf(this.currentLevel);
  }

  log(level: string, message: string) {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`);
    }
  }

  debug(message: string) { this.log('debug', message); }

  info(message: string) { this.log('info', message); }

  warning(message: string) { this.log('warning', message); }

  error(message: string) { this.log('error', message); }
}