const supabase = require('../config/supabase');
const crypto = require('crypto');

class UserService {
  /**
   * Gera uma nova API key
   * @returns {string} API key gerada
   */
  generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Cria um novo usuário na tabela users
   * @param {string} userId - ID do usuário do auth.users
   * @returns {Promise<Object>} Usuário criado
   */
  async createUser(userId) {
    try {
      const apiKey = this.generateApiKey();
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          user_id: userId,
          api_key: apiKey,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar usuário: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de usuários: ${error.message}`);
    }
  }

  /**
   * Busca usuário por ID
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Usuário encontrado
   */
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar usuário: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de usuários: ${error.message}`);
    }
  }

  /**
   * Busca usuário por API key
   * @param {string} apiKey - API key do usuário
   * @returns {Promise<Object>} Usuário encontrado
   */
  async getUserByApiKey(apiKey) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('api_key', apiKey)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar usuário: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de usuários: ${error.message}`);
    }
  }

  /**
   * Atualiza o status de um usuário
   * @param {string} userId - ID do usuário
   * @param {boolean} isActive - Status ativo/inativo
   * @returns {Promise<Object>} Usuário atualizado
   */
  async updateUserStatus(userId, isActive) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar usuário: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de usuários: ${error.message}`);
    }
  }

  /**
   * Regenera a API key de um usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Usuário com nova API key
   */
  async regenerateApiKey(userId) {
    try {
      const newApiKey = this.generateApiKey();
      
      const { data, error } = await supabase
        .from('users')
        .update({ api_key: newApiKey })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao regenerar API key: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de usuários: ${error.message}`);
    }
  }

  /**
   * Lista todos os usuários (apenas para admin)
   * @returns {Promise<Array>} Lista de usuários
   */
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, api_key, is_active')
        .order('user_id');

      if (error) {
        throw new Error(`Erro ao listar usuários: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Erro no serviço de usuários: ${error.message}`);
    }
  }

  /**
   * Deleta um usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async deleteUser(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Erro ao deletar usuário: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Erro no serviço de usuários: ${error.message}`);
    }
  }
}

module.exports = new UserService(); 