const express = require('express');
const professionalController = require('../controllers/professionalController');
const { authenticateApiKey } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do profissional
 *         name:
 *           type: string
 *           description: Nome do profissional
 *           example: "Dr. João Silva"
 *         specialty:
 *           type: string
 *           description: Especialidade médica
 *           example: "Cardiologia"
 *         slug:
 *           type: string
 *           description: Identificador amigável para URL
 *           example: "dr-joao-silva"
 *         crm:
 *           type: string
 *           description: Registro do Conselho Regional de Medicina
 *           example: "12345-SP"
 *         rqe:
 *           type: string
 *           description: Registro de Qualificação de Especialista
 *           example: "67890"
 *         img_url:
 *           type: string
 *           format: uri
 *           description: URL da imagem do profissional
 *           example: "https://example.com/photo.jpg"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID do usuário proprietário
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *       required:
 *         - name
 *         - slug
 *     ProfessionalCreate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do profissional
 *           example: "Dr. João Silva"
 *         specialty:
 *           type: string
 *           description: Especialidade médica
 *           example: "Cardiologia"
 *         slug:
 *           type: string
 *           description: Identificador amigável para URL
 *           example: "dr-joao-silva"
 *         crm:
 *           type: string
 *           description: Registro do Conselho Regional de Medicina
 *           example: "12345-SP"
 *         rqe:
 *           type: string
 *           description: Registro de Qualificação de Especialista
 *           example: "67890"
 *         img_url:
 *           type: string
 *           format: uri
 *           description: URL da imagem do profissional
 *           example: "https://example.com/photo.jpg"
 *       required:
 *         - name
 *         - slug
 *     ProfessionalUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do profissional
 *         specialty:
 *           type: string
 *           description: Especialidade médica
 *         slug:
 *           type: string
 *           description: Identificador amigável para URL
 *         crm:
 *           type: string
 *           description: Registro do Conselho Regional de Medicina
 *         rqe:
 *           type: string
 *           description: Registro de Qualificação de Especialista
 *         img_url:
 *           type: string
 *           format: uri
 *           description: URL da imagem do profissional
 */

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     description: Cria um novo profissional associado ao usuário autenticado
 *     tags: [Professionals]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessionalCreate'
 *     responses:
 *       201:
 *         description: Profissional criado com sucesso
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
 *                   example: "Profissional criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Professional'
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
 *                       example: "Nome e slug são obrigatórios"
 *       409:
 *         description: Slug duplicado
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
 *                       example: "DUPLICATE_SLUG"
 *                     details:
 *                       type: string
 *                       example: "Slug já existe"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', authenticateApiKey, professionalController.createProfessional);

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Lista todos os profissionais do usuário
 *     description: Retorna todos os profissionais associados ao usuário autenticado
 *     tags: [Professionals]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Profissionais listados com sucesso
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
 *                   example: "Profissionais listados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Professional'
 *                 count:
 *                   type: integer
 *                   description: Número total de profissionais
 *                   example: 3
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', authenticateApiKey, professionalController.getProfessionals);

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Busca profissional por ID
 *     description: Retorna um profissional específico por ID (apenas do usuário autenticado)
 *     tags: [Professionals]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do profissional
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Profissional encontrado
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
 *                   example: "Profissional encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
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
 *                   example: "Profissional não encontrado"
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "NOT_FOUND"
 *                     details:
 *                       type: string
 *                       example: "Profissional não encontrado"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
/**
 * @swagger
 * /professionals/slug/{slug}:
 *   get:
 *     summary: Busca profissional por slug (privado)
 *     description: Retorna um profissional específico por slug (apenas do usuário autenticado)
 *     tags: [Professionals]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug do profissional
 *         example: "dr-joao-silva"
 *     responses:
 *       200:
 *         description: Profissional encontrado
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
 *                   example: "Profissional encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
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
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/slug/:slug', authenticateApiKey, professionalController.getProfessionalBySlug);

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Busca profissional por ID
 *     description: Retorna um profissional específico por ID (apenas do usuário autenticado)
 *     tags: [Professionals]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do profissional
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Profissional encontrado
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
 *                   example: "Profissional encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
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
 *                   example: "Profissional não encontrado"
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "NOT_FOUND"
 *                     details:
 *                       type: string
 *                       example: "Profissional não encontrado"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
/**
 * @swagger
 * /professionals/public/{slug}:
 *   get:
 *     summary: Busca profissional por slug (público)
 *     description: Retorna um profissional específico por slug (acesso público)
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug do profissional
 *         example: "dr-joao-silva"
 *     responses:
 *       200:
 *         description: Profissional encontrado
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
 *                   example: "Profissional encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/public/:slug', professionalController.getProfessionalBySlugPublic);

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Busca profissional por ID
 *     description: Retorna um profissional específico por ID (apenas do usuário autenticado)
 *     tags: [Professionals]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do profissional
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Profissional encontrado
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
 *                   example: "Profissional encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
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
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', authenticateApiKey, professionalController.getProfessionalById);

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza um profissional
 *     description: Atualiza os dados de um profissional específico
 *     tags: [Professionals]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             $ref: '#/components/schemas/ProfessionalUpdate'
 *     responses:
 *       200:
 *         description: Profissional atualizado com sucesso
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
 *                   example: "Profissional atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 *       409:
 *         description: Slug duplicado
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
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', authenticateApiKey, professionalController.updateProfessional);

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Exclui um profissional (soft delete)
 *     description: Marca um profissional como deletado (soft delete)
 *     tags: [Professionals]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do profissional
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Profissional excluído com sucesso
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
 *                   example: "Profissional excluído com sucesso"
 *       404:
 *         description: Profissional não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', authenticateApiKey, professionalController.deleteProfessional);

module.exports = router; 