const userService = require('../services/userService');
const supabase = require('../config/supabase');

class UserController {
  /**
   * Obtém informações do usuário atual
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.user_id;
      const user = await userService.getUserById(userId);

      res.status(200).json({
        success: true,
        message: 'Informações do usuário obtidas',
        data: {
          user_id: user.user_id,
          is_active: user.is_active,
          api_key: user.api_key.substring(0, 8) + '...' // Mostra apenas parte da API key
        }
      });
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Regenera a API key do usuário atual
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async regenerateApiKey(req, res) {
    try {
      const userId = req.user.user_id;
      const user = await userService.regenerateApiKey(userId);

      res.status(200).json({
        success: true,
        message: 'API key regenerada com sucesso',
        data: {
          user_id: user.user_id,
          api_key: user.api_key,
          is_active: user.is_active
        }
      });
    } catch (error) {
      console.error('Erro ao regenerar API key:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Atualiza o status do usuário atual
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateUserStatus(req, res) {
    try {
      const userId = req.user.user_id;
      const { is_active } = req.body;

      if (typeof is_active !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Campo is_active deve ser um boolean'
        });
      }

      const user = await userService.updateUserStatus(userId, is_active);

      res.status(200).json({
        success: true,
        message: 'Status do usuário atualizado com sucesso',
        data: {
          user_id: user.user_id,
          is_active: user.is_active
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Lista todos os usuários (apenas para admin)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        success: true,
        message: 'Usuários listados com sucesso',
        data: users.map(user => ({
          user_id: user.user_id,
          api_key: user.api_key.substring(0, 8) + '...',
          is_active: user.is_active
        })),
        count: users.length
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Obtém informações de um usuário específico (apenas para admin)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);

      res.status(200).json({
        success: true,
        message: 'Usuário encontrado',
        data: {
          user_id: user.user_id,
          api_key: user.api_key,
          is_active: user.is_active
        }
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Atualiza o status de um usuário específico (apenas para admin)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateUserStatusById(req, res) {
    try {
      const { userId } = req.params;
      const { is_active } = req.body;

      if (typeof is_active !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Campo is_active deve ser um boolean'
        });
      }

      const user = await userService.updateUserStatus(userId, is_active);

      res.status(200).json({
        success: true,
        message: 'Status do usuário atualizado com sucesso',
        data: {
          user_id: user.user_id,
          is_active: user.is_active
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Login do usuário via Supabase Auth
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas',
          error: error.message
        });
      }

      // Buscar informações do usuário na tabela users
      const user = await userService.getUserById(data.user.id);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user_id: data.user.id,
          email: data.user.email,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          api_key: user.api_key,
          is_active: user.is_active
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Registro de novo usuário via Supabase Auth
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async register(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao criar conta',
          error: error.message
        });
      }

      // O trigger handle_new_user() criará automaticamente o registro na tabela users
      // com a API key gerada

      res.status(201).json({
        success: true,
        message: 'Conta criada com sucesso. Verifique seu email para confirmar.',
        data: {
          user_id: data.user.id,
          email: data.user.email
        }
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Recuperação de senha via Supabase Auth
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao enviar email de recuperação',
          error: error.message
        });
      }

      res.status(200).json({
        success: true,
        message: 'Email de recuperação enviado com sucesso'
      });
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Logout do usuário
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async logout(req, res) {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao fazer logout',
          error: error.message
        });
      }

      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Deleta um usuário (apenas para admin)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      await userService.deleteUser(userId);

      res.status(200).json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

module.exports = new UserController(); 