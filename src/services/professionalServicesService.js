const supabase = require('../config/supabase');

class ProfessionalServicesService {
  /**
   * Cria um novo serviço profissional
   * @param {Object} serviceData - Dados do serviço
   * @param {string} professionalId - ID do profissional
   * @returns {Promise<Object>} Serviço criado
   */
  async createProfessionalService(serviceData, professionalId) {
    try {
      // Validar campos obrigatórios
      if (!serviceData.service_name || !serviceData.duration_minutes) {
        throw new Error('Nome do serviço e duração são obrigatórios');
      }

      // Validar duração
      if (serviceData.duration_minutes <= 0) {
        throw new Error('Duração deve ser maior que zero');
      }

      const { data, error } = await supabase
        .from('professional_services')
        .insert([{
          ...serviceData,
          professional_id: professionalId
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar serviço: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de serviços profissionais: ${error.message}`);
    }
  }

  /**
   * Lista todos os serviços de um profissional
   * @param {string} professionalId - ID do profissional
   * @returns {Promise<Array>} Lista de serviços
   */
  async getProfessionalServicesByProfessionalId(professionalId) {
    try {
      const { data, error } = await supabase
        .from('professional_services')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('is_deleted', false)
        .order('service_name');

      if (error) {
        throw new Error(`Erro ao buscar serviços: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Erro no serviço de serviços profissionais: ${error.message}`);
    }
  }

  /**
   * Busca serviço por ID
   * @param {string} id - ID do serviço
   * @param {string} professionalId - ID do profissional (para verificar permissão)
   * @returns {Promise<Object>} Serviço encontrado
   */
  async getProfessionalServiceById(id, professionalId) {
    try {
      const { data, error } = await supabase
        .from('professional_services')
        .select('*')
        .eq('id', id)
        .eq('professional_id', professionalId)
        .eq('is_deleted', false)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Serviço não encontrado');
        }
        throw new Error(`Erro ao buscar serviço: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de serviços profissionais: ${error.message}`);
    }
  }

  /**
   * Atualiza um serviço profissional
   * @param {string} id - ID do serviço
   * @param {Object} updateData - Dados para atualizar
   * @param {string} professionalId - ID do profissional
   * @returns {Promise<Object>} Serviço atualizado
   */
  async updateProfessionalService(id, updateData, professionalId) {
    try {
      // Verificar se o serviço existe e pertence ao profissional
      const existingService = await this.getProfessionalServiceById(id, professionalId);
      if (!existingService) {
        throw new Error('Serviço não encontrado');
      }

      // Validar duração se estiver sendo atualizada
      if (updateData.duration_minutes && updateData.duration_minutes <= 0) {
        throw new Error('Duração deve ser maior que zero');
      }

      const { data, error } = await supabase
        .from('professional_services')
        .update(updateData)
        .eq('id', id)
        .eq('professional_id', professionalId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar serviço: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de serviços profissionais: ${error.message}`);
    }
  }

  /**
   * Deleta um serviço profissional (soft delete)
   * @param {string} id - ID do serviço
   * @param {string} professionalId - ID do profissional
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async deleteProfessionalService(id, professionalId) {
    try {
      // Verificar se o serviço existe e pertence ao profissional
      const existingService = await this.getProfessionalServiceById(id, professionalId);
      if (!existingService) {
        throw new Error('Serviço não encontrado');
      }

      const { error } = await supabase
        .from('professional_services')
        .update({ is_deleted: true })
        .eq('id', id)
        .eq('professional_id', professionalId);

      if (error) {
        throw new Error(`Erro ao deletar serviço: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Erro no serviço de serviços profissionais: ${error.message}`);
    }
  }

  /**
   * Lista todos os serviços de um profissional (incluindo deletados)
   * @param {string} professionalId - ID do profissional
   * @returns {Promise<Array>} Lista de serviços
   */
  async getAllProfessionalServicesByProfessionalId(professionalId) {
    try {
      const { data, error } = await supabase
        .from('professional_services')
        .select('*')
        .eq('professional_id', professionalId)
        .order('service_name');

      if (error) {
        throw new Error(`Erro ao buscar serviços: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Erro no serviço de serviços profissionais: ${error.message}`);
    }
  }
}

module.exports = new ProfessionalServicesService(); 