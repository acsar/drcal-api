const express = require('express');
const professionalServicesController = require('../controllers/professionalServicesController');
const { authenticateApiKey } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfessionalService:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do serviço
 *         professional_id:
 *           type: string
 *           format: uuid
 *           description: ID do profissional
 *         service_name:
 *           type: string
 *           description: Nome do serviço
 *           example: "Consulta"
 *         duration_minutes:
 *           type: integer
 *           description: Duração em minutos
 *           example: 30
 *         is_deleted:
 *           type: boolean
 *           description: Status de exclusão (soft delete)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *       required:
 *         - service_name
 *         - duration_minutes
 *     ProfessionalServiceCreate:
 *       type: object
 *       properties:
 *         service_name:
 *           type: string
 *           description: Nome do serviço
 *           example: "Consulta"
 *         duration_minutes:
 *           type: integer
 *           description: Duração em minutos
 *           example: 30
 *       required:
 *         - service_name
 *         - duration_minutes
 *     ProfessionalServiceUpdate:
 *       type: object
 *       properties:
 *         service_name:
 *           type: string
 *           description: Nome do serviço
 *         duration_minutes:
 *           type: integer
 *           description: Duração em minutos
 */

/**
 * @swagger
 * /professionals/{professionalId}/services:
 *   post:
 *     summary: Cria um novo serviço profissional
 *     description: Cria um novo serviço para um profissional específico
 *     tags: [Professional Services]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: professionalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do profissional
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessionalServiceCreate'
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Serviço criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ProfessionalService'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro de validação"
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                       enum: ["VALIDATION_ERROR"]
 *                     details:
 *                       type: string
 *                       example: "Nome do serviço e duração são obrigatórios"
 *       404:
 *         description: Profissional não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:professionalId/services', authenticateApiKey, professionalServicesController.createProfessionalService);

/**
 * @swagger
 * /professionals/{professionalId}/services:
 *   get:
 *     summary: Lista todos os serviços de um profissional
 *     description: Retorna todos os serviços de um profissional específico
 *     tags: [Professional Services]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: professionalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do profissional
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Serviços listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Serviços listados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProfessionalService'
 *                 count:
 *                   type: integer
 *                   description: Número total de serviços
 *                   example: 3
 *       404:
 *         description: Profissional não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:professionalId/services', authenticateApiKey, professionalServicesController.getProfessionalServices);

/**
 * @swagger
 * /professionals/{professionalId}/services/{serviceId}:
 *   get:
 *     summary: Busca serviço por ID
 *     description: Retorna um serviço específico de um profissional
 *     tags: [Professional Services]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: professionalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do profissional
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do serviço
 *         example: "456e7890-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Serviço encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/ProfessionalService'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "ID inválido"
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INVALID_ID"
 *                     details:
 *                       type: string
 *                       example: "O ID deve ser um UUID válido"
 *       404:
 *         description: Profissional ou serviço não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:professionalId/services/:serviceId', authenticateApiKey, professionalServicesController.getProfessionalServiceById);

/**
 * @swagger
 * /professionals/{professionalId}/services/{serviceId}:
 *   put:
 *     summary: Atualiza um serviço profissional
 *     description: Atualiza os dados de um serviço específico
 *     tags: [Professional Services]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: professionalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do profissional
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do serviço
 *         example: "456e7890-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessionalServiceUpdate'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Serviço atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ProfessionalService'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro de validação"
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                       enum: ["VALIDATION_ERROR", "INVALID_ID"]
 *                     details:
 *                       type: string
 *                       example: "Duração deve ser maior que zero"
 *       404:
 *         description: Profissional ou serviço não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:professionalId/services/:serviceId', authenticateApiKey, professionalServicesController.updateProfessionalService);

/**
 * @swagger
 * /professionals/{professionalId}/services/{serviceId}:
 *   delete:
 *     summary: Exclui um serviço profissional (soft delete)
 *     description: Marca um serviço como deletado (soft delete)
 *     tags: [Professional Services]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: professionalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do profissional
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do serviço
 *         example: "456e7890-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Serviço excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Serviço excluído com sucesso"
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "ID inválido"
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INVALID_ID"
 *                     details:
 *                       type: string
 *                       example: "O ID deve ser um UUID válido"
 *       404:
 *         description: Profissional ou serviço não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:professionalId/services/:serviceId', authenticateApiKey, professionalServicesController.deleteProfessionalService);

module.exports = router; 