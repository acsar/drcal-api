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
 * Middleware para autenticação via JWT do Supabase
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
async function authenticateJWT(req, res, next) {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação é obrigatório',
        error: 'MISSING_TOKEN'
      });
    }

    // Verificar o token JWT do Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado',
        error: 'INVALID_TOKEN'
      });
    }

    // Verificar se o usuário está ativo na tabela users
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('user_id, is_active')
      .eq('user_id', user.id)
      .single();

    if (userError || !userRecord || !userRecord.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo ou não encontrado',
        error: 'INACTIVE_USER'
      });
    }

    // Adicionar informações do usuário ao request
    req.user = {
      user_id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação JWT:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno na autenticação',
      error: 'AUTH_ERROR'
    });
  }
}

module.exports = {
  authenticateApiKey,
  authenticateJWT
}; 