/**
 * Utilitário de logging para a aplicação
 */

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Log de informação
   * @param {string} message - Mensagem a ser logada
   * @param {Object} data - Dados adicionais (opcional)
   */
  info(message, data = null) {
    const logEntry = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      ...(data && { data })
    };

    if (this.isDevelopment) {
      console.log(`📝 ${message}`, data ? data : '');
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  /**
   * Log de erro
   * @param {string} message - Mensagem de erro
   * @param {Error} error - Objeto de erro (opcional)
   */
  error(message, error = null) {
    const logEntry = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      ...(error && { 
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
    };

    if (this.isDevelopment) {
      console.error(`❌ ${message}`, error ? error : '');
    } else {
      console.error(JSON.stringify(logEntry));
    }
  }

  /**
   * Log de warning
   * @param {string} message - Mensagem de warning
   * @param {Object} data - Dados adicionais (opcional)
   */
  warn(message, data = null) {
    const logEntry = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      ...(data && { data })
    };

    if (this.isDevelopment) {
      console.warn(`⚠️ ${message}`, data ? data : '');
    } else {
      console.warn(JSON.stringify(logEntry));
    }
  }

  /**
   * Log de debug (apenas em desenvolvimento)
   * @param {string} message - Mensagem de debug
   * @param {Object} data - Dados adicionais (opcional)
   */
  debug(message, data = null) {
    if (this.isDevelopment) {
      console.debug(`🐛 ${message}`, data ? data : '');
    }
  }

  /**
   * Log de sucesso
   * @param {string} message - Mensagem de sucesso
   * @param {Object} data - Dados adicionais (opcional)
   */
  success(message, data = null) {
    const logEntry = {
      level: 'SUCCESS',
      timestamp: new Date().toISOString(),
      message,
      ...(data && { data })
    };

    if (this.isDevelopment) {
      console.log(`✅ ${message}`, data ? data : '');
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }
}

module.exports = new Logger(); 