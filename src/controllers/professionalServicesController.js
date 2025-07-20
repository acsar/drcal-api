const professionalServicesService = require('../services/professionalServicesService');
const professionalService = require('../services/professionalService');

class ProfessionalServicesController {
  /**
   * Cria um novo serviço profissional
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createProfessionalService(req, res) {
    try {
      const userId = req.user.user_id;
      const { professionalId } = req.params;
      const serviceData = req.body;

      // Validação básica
      if (!serviceData.service_name || !serviceData.duration_minutes) {
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Nome do serviço e duração são obrigatórios'
          }
        });
      }

      // Validar duração
      if (serviceData.duration_minutes <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Duração deve ser maior que zero'
          }
        });
      }

      // Verificar se o profissional pertence ao usuário
      const professional = await professionalService.getProfessionalById(professionalId, userId);
      if (!professional) {
        return res.status(404).json({
          success: false,
          message: 'Profissional não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Profissional não encontrado'
          }
        });
      }

      const service = await professionalServicesService.createProfessionalService(serviceData, professionalId);

      res.status(201).json({
        success: true,
        message: 'Serviço criado com sucesso',
        data: service
      });
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: {
          code: 'INTERNAL_ERROR',
          details: error.message
        }
      });
    }
  }

  /**
   * Lista todos os serviços de um profissional
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProfessionalServices(req, res) {
    try {
      const userId = req.user.user_id;
      const { professionalId } = req.params;

      // Verificar se o profissional pertence ao usuário
      const professional = await professionalService.getProfessionalById(professionalId, userId);
      if (!professional) {
        return res.status(404).json({
          success: false,
          message: 'Profissional não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Profissional não encontrado'
          }
        });
      }

      const services = await professionalServicesService.getProfessionalServicesByProfessionalId(professionalId);

      res.status(200).json({
        success: true,
        message: 'Serviços listados com sucesso',
        data: services,
        count: services.length
      });
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: {
          code: 'INTERNAL_ERROR',
          details: error.message
        }
      });
    }
  }

  /**
   * Busca serviço por ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProfessionalServiceById(req, res) {
    try {
      const userId = req.user.user_id;
      const { professionalId, serviceId } = req.params;

      // Validação de UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(serviceId)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido',
          error: {
            code: 'INVALID_ID',
            details: 'O ID deve ser um UUID válido'
          }
        });
      }

      // Verificar se o profissional pertence ao usuário
      const professional = await professionalService.getProfessionalById(professionalId, userId);
      if (!professional) {
        return res.status(404).json({
          success: false,
          message: 'Profissional não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Profissional não encontrado'
          }
        });
      }

      const service = await professionalServicesService.getProfessionalServiceById(serviceId, professionalId);

      res.status(200).json({
        success: true,
        message: 'Serviço encontrado',
        data: service
      });
    } catch (error) {
      console.error('Erro ao buscar serviço:', error);
      
      if (error.message.includes('Serviço não encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Serviço não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Serviço não encontrado'
          }
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: {
          code: 'INTERNAL_ERROR',
          details: error.message
        }
      });
    }
  }

  /**
   * Atualiza um serviço profissional
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateProfessionalService(req, res) {
    try {
      const userId = req.user.user_id;
      const { professionalId, serviceId } = req.params;
      const updateData = req.body;

      // Validação de UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(serviceId)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido',
          error: {
            code: 'INVALID_ID',
            details: 'O ID deve ser um UUID válido'
          }
        });
      }

      // Validar duração se estiver sendo atualizada
      if (updateData.duration_minutes && updateData.duration_minutes <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Duração deve ser maior que zero'
          }
        });
      }

      // Verificar se o profissional pertence ao usuário
      const professional = await professionalService.getProfessionalById(professionalId, userId);
      if (!professional) {
        return res.status(404).json({
          success: false,
          message: 'Profissional não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Profissional não encontrado'
          }
        });
      }

      const service = await professionalServicesService.updateProfessionalService(serviceId, updateData, professionalId);

      res.status(200).json({
        success: true,
        message: 'Serviço atualizado com sucesso',
        data: service
      });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      
      if (error.message.includes('Serviço não encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Serviço não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Serviço não encontrado'
          }
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: {
          code: 'INTERNAL_ERROR',
          details: error.message
        }
      });
    }
  }

  /**
   * Deleta um serviço profissional
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteProfessionalService(req, res) {
    try {
      const userId = req.user.user_id;
      const { professionalId, serviceId } = req.params;

      // Validação de UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(serviceId)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido',
          error: {
            code: 'INVALID_ID',
            details: 'O ID deve ser um UUID válido'
          }
        });
      }

      // Verificar se o profissional pertence ao usuário
      const professional = await professionalService.getProfessionalById(professionalId, userId);
      if (!professional) {
        return res.status(404).json({
          success: false,
          message: 'Profissional não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Profissional não encontrado'
          }
        });
      }

      await professionalServicesService.deleteProfessionalService(serviceId, professionalId);

      res.status(200).json({
        success: true,
        message: 'Serviço excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      
      if (error.message.includes('Serviço não encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Serviço não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Serviço não encontrado'
          }
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: {
          code: 'INTERNAL_ERROR',
          details: error.message
        }
      });
    }
  }
}

module.exports = new ProfessionalServicesController(); 