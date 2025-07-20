const professionalService = require('../services/professionalService');

class ProfessionalController {
  /**
   * Cria um novo profissional
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createProfessional(req, res) {
    try {
      const userId = req.user.user_id;
      const professionalData = req.body;

      // Validação básica
      if (!professionalData.name || !professionalData.slug) {
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Nome e slug são obrigatórios'
          }
        });
      }

      // Validação do slug (apenas letras, números, hífens e underscores)
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(professionalData.slug)) {
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Slug deve conter apenas letras minúsculas, números, hífens e underscores'
          }
        });
      }

      const professional = await professionalService.createProfessional(professionalData, userId);

      res.status(201).json({
        success: true,
        message: 'Profissional criado com sucesso',
        data: professional
      });
    } catch (error) {
      console.error('Erro ao criar profissional:', error);
      
      if (error.message.includes('Slug já existe')) {
        return res.status(409).json({
          success: false,
          message: 'Erro de validação',
          error: {
            code: 'DUPLICATE_SLUG',
            details: 'Slug já existe'
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
   * Lista todos os profissionais do usuário
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProfessionals(req, res) {
    try {
      const userId = req.user.user_id;
      const professionals = await professionalService.getProfessionalsByUserId(userId);

      res.status(200).json({
        success: true,
        message: 'Profissionais listados com sucesso',
        data: professionals,
        count: professionals.length
      });
    } catch (error) {
      console.error('Erro ao listar profissionais:', error);
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
   * Busca profissional por ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProfessionalById(req, res) {
    try {
      const userId = req.user.user_id;
      const { id } = req.params;

      // Validação de UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido',
          error: {
            code: 'INVALID_ID',
            details: 'O ID deve ser um UUID válido'
          }
        });
      }

      const professional = await professionalService.getProfessionalById(id, userId);

      res.status(200).json({
        success: true,
        message: 'Profissional encontrado',
        data: professional
      });
    } catch (error) {
      console.error('Erro ao buscar profissional:', error);
      
      if (error.message.includes('Profissional não encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Profissional não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Profissional não encontrado'
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
   * Busca profissional por slug (privado - apenas do usuário)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProfessionalBySlug(req, res) {
    try {
      const userId = req.user.user_id;
      const { slug } = req.params;

      const professional = await professionalService.getProfessionalBySlug(slug, userId);

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

      res.status(200).json({
        success: true,
        message: 'Profissional encontrado',
        data: professional
      });
    } catch (error) {
      console.error('Erro ao buscar profissional por slug:', error);
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
   * Busca profissional por slug (público)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProfessionalBySlugPublic(req, res) {
    try {
      const { slug } = req.params;

      const professional = await professionalService.getProfessionalBySlugPublic(slug);

      res.status(200).json({
        success: true,
        message: 'Profissional encontrado',
        data: professional
      });
    } catch (error) {
      console.error('Erro ao buscar profissional por slug público:', error);
      
      if (error.message.includes('Profissional não encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Profissional não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Profissional não encontrado'
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
   * Atualiza um profissional
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateProfessional(req, res) {
    try {
      const userId = req.user.user_id;
      const { id } = req.params;
      const updateData = req.body;

      // Validação de UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido',
          error: {
            code: 'INVALID_ID',
            details: 'O ID deve ser um UUID válido'
          }
        });
      }

      // Validação do slug se estiver sendo atualizado
      if (updateData.slug) {
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(updateData.slug)) {
          return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            error: {
              code: 'VALIDATION_ERROR',
              details: 'Slug deve conter apenas letras minúsculas, números, hífens e underscores'
            }
          });
        }
      }

      const professional = await professionalService.updateProfessional(id, updateData, userId);

      res.status(200).json({
        success: true,
        message: 'Profissional atualizado com sucesso',
        data: professional
      });
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      
      if (error.message.includes('Profissional não encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Profissional não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Profissional não encontrado'
          }
        });
      }

      if (error.message.includes('Slug já existe')) {
        return res.status(409).json({
          success: false,
          message: 'Erro de validação',
          error: {
            code: 'DUPLICATE_SLUG',
            details: 'Slug já existe'
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
   * Deleta um profissional
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteProfessional(req, res) {
    try {
      const userId = req.user.user_id;
      const { id } = req.params;

      // Validação de UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido',
          error: {
            code: 'INVALID_ID',
            details: 'O ID deve ser um UUID válido'
          }
        });
      }

      await professionalService.deleteProfessional(id, userId);

      res.status(200).json({
        success: true,
        message: 'Profissional excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar profissional:', error);
      
      if (error.message.includes('Profissional não encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Profissional não encontrado',
          error: {
            code: 'NOT_FOUND',
            details: 'Profissional não encontrado'
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

module.exports = new ProfessionalController(); 