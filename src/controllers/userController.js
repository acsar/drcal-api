const userService = require('../services/userService');

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