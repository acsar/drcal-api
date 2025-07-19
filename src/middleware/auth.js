const supabase = require('../config/supabase');

/**
 * Middleware de autenticação para validar API keys
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
async function authenticateApiKey(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key é obrigatória',
        error: 'MISSING_API_KEY'
      });
    }

    // Buscar usuário pela API key
    const { data: user, error } = await supabase
      .from('users')
      .select('user_id, api_key, is_active')
      .eq('api_key', apiKey)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'API key inválida',
        error: 'INVALID_API_KEY'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo',
        error: 'INACTIVE_USER'
      });
    }

    // Adicionar informações do usuário ao request
    req.user = {
      user_id: user.user_id,
      api_key: user.api_key
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno na autenticação',
      error: 'AUTH_ERROR'
    });
  }
}

/**
 * Middleware opcional de autenticação (não bloqueia se não houver API key)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
async function optionalAuth(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (apiKey) {
      // Buscar usuário pela API key
      const { data: user, error } = await supabase
        .from('users')
        .select('user_id, api_key, is_active')
        .eq('api_key', apiKey)
        .single();

      if (!error && user && user.is_active) {
        req.user = {
          user_id: user.user_id,
          api_key: user.api_key
        };
      }
    }

    next();
  } catch (error) {
    console.error('Erro na autenticação opcional:', error);
    next(); // Continua mesmo com erro
  }
}

module.exports = {
  authenticateApiKey,
  optionalAuth
}; 