const supabase = require('../config/supabase');

class ProfessionalService {
  /**
   * Cria um novo profissional
   * @param {Object} professionalData - Dados do profissional
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Profissional criado
   */
  async createProfessional(professionalData, userId) {
    try {
      // Validar campos obrigatórios
      if (!professionalData.name || !professionalData.slug) {
        throw new Error('Nome e slug são obrigatórios');
      }

      // Verificar se o slug já existe (apenas profissionais não deletados)
      const { data: existingSlug, error: slugError } = await supabase
        .from('professionals')
        .select('id')
        .eq('slug', professionalData.slug)
        .eq('is_deleted', false)
        .maybeSingle();

      if (existingSlug) {
        throw new Error('Slug já existe');
      }

      const { data, error } = await supabase
        .from('professionals')
        .insert([{
          ...professionalData,
          user_id: userId
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar profissional: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de profissionais: ${error.message}`);
    }
  }

  /**
   * Lista todos os profissionais de um usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Array>} Lista de profissionais
   */
  async getProfessionalsByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .order('name');

      if (error) {
        throw new Error(`Erro ao buscar profissionais: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Erro no serviço de profissionais: ${error.message}`);
    }
  }

  /**
   * Busca profissional por ID
   * @param {string} id - ID do profissional
   * @param {string} userId - ID do usuário (para verificar permissão)
   * @returns {Promise<Object>} Profissional encontrado
   */
  async getProfessionalById(id, userId) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Profissional não encontrado');
        }
        throw new Error(`Erro ao buscar profissional: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de profissionais: ${error.message}`);
    }
  }

  /**
   * Busca profissional por slug
   * @param {string} slug - Slug do profissional
   * @param {string} userId - ID do usuário (para verificar permissão)
   * @returns {Promise<Object>} Profissional encontrado
   */
  async getProfessionalBySlug(slug, userId = null) {
    try {
      let query = supabase
        .from('professionals')
        .select('*')
        .eq('slug', slug)
        .eq('is_deleted', false);

      // Se userId for fornecido, filtrar por usuário
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Retorna null se não encontrar
        }
        throw new Error(`Erro ao buscar profissional: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de profissionais: ${error.message}`);
    }
  }

  /**
   * Atualiza um profissional
   * @param {string} id - ID do profissional
   * @param {Object} updateData - Dados para atualizar
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Profissional atualizado
   */
  async updateProfessional(id, updateData, userId) {
    try {
      // Verificar se o profissional existe e pertence ao usuário
      const existingProfessional = await this.getProfessionalById(id, userId);
      if (!existingProfessional) {
        throw new Error('Profissional não encontrado');
      }

      // Se estiver atualizando o slug, verificar se já existe
      if (updateData.slug && updateData.slug !== existingProfessional.slug) {
        const { data: existingSlug, error: slugError } = await supabase
          .from('professionals')
          .select('id')
          .eq('slug', updateData.slug)
          .eq('is_deleted', false)
          .neq('id', id)
          .maybeSingle();

        if (existingSlug) {
          throw new Error('Slug já existe');
        }
      }

      const { data, error } = await supabase
        .from('professionals')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar profissional: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de profissionais: ${error.message}`);
    }
  }

  /**
   * Deleta um profissional (soft delete)
   * @param {string} id - ID do profissional
   * @param {string} userId - ID do usuário
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async deleteProfessional(id, userId) {
    try {
      // Verificar se o profissional existe e pertence ao usuário
      const existingProfessional = await this.getProfessionalById(id, userId);
      if (!existingProfessional) {
        throw new Error('Profissional não encontrado');
      }

      const { error } = await supabase
        .from('professionals')
        .update({ is_deleted: true })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Erro ao deletar profissional: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Erro no serviço de profissionais: ${error.message}`);
    }
  }

  /**
   * Busca profissional por slug (público - sem verificação de usuário)
   * @param {string} slug - Slug do profissional
   * @returns {Promise<Object>} Profissional encontrado
   */
  async getProfessionalBySlugPublic(slug) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('slug', slug)
        .eq('is_deleted', false)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Profissional não encontrado');
        }
        throw new Error(`Erro ao buscar profissional: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de profissionais: ${error.message}`);
    }
  }
}

module.exports = new ProfessionalService(); 