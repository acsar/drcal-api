const express = require('express');
const userController = require('../controllers/userController');
const { authenticateApiKey } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 *       description: API key para autenticação
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtém informações do usuário atual
 *     description: Retorna informações do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário obtidas
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
 *                   example: "Informações do usuário obtidas"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID do usuário
 *                     is_active:
 *                       type: boolean
 *                       description: Status do usuário
 *                     api_key:
 *                       type: string
 *                       description: API key (parcial)
 *       401:
 *         description: Não autorizado
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
 *                   example: "API key é obrigatória"
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/me', authenticateApiKey, userController.getCurrentUser);

/**
 * @swagger
 * /users/me/api-key:
 *   post:
 *     summary: Regenera a API key do usuário atual
 *     description: Gera uma nova API key para o usuário autenticado
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: API key regenerada com sucesso
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
 *                   example: "API key regenerada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID do usuário
 *                     api_key:
 *                       type: string
 *                       description: Nova API key completa
 *                     is_active:
 *                       type: boolean
 *                       description: Status do usuário
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/me/api-key', authenticateApiKey, userController.regenerateApiKey);

/**
 * @swagger
 * /users/me/status:
 *   put:
 *     summary: Atualiza o status do usuário atual
 *     description: Ativa ou desativa o usuário autenticado
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_active
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 description: Status ativo/inativo do usuário
 *                 example: true
 *     responses:
 *       200:
 *         description: Status do usuário atualizado com sucesso
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
 *                   example: "Status do usuário atualizado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID do usuário
 *                     is_active:
 *                       type: boolean
 *                       description: Novo status do usuário
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/me/status', authenticateApiKey, userController.updateUserStatus);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários (Admin)
 *     description: Retorna lista de todos os usuários do sistema
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Usuários listados com sucesso
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
 *                   example: "Usuários listados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                         description: ID do usuário
 *                       api_key:
 *                         type: string
 *                         description: API key (parcial)
 *                       is_active:
 *                         type: boolean
 *                         description: Status do usuário
 *                 count:
 *                   type: integer
 *                   description: Número total de usuários
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', authenticateApiKey, userController.getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Obtém informações de um usuário específico (Admin)
 *     description: Retorna informações detalhadas de um usuário
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
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
 *                   example: "Usuário encontrado"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID do usuário
 *                     api_key:
 *                       type: string
 *                       description: API key completa
 *                     is_active:
 *                       type: boolean
 *                       description: Status do usuário
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:userId', authenticateApiKey, userController.getUserById);

/**
 * @swagger
 * /users/{userId}/status:
 *   put:
 *     summary: Atualiza o status de um usuário específico (Admin)
 *     description: Ativa ou desativa um usuário específico
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_active
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 description: Status ativo/inativo do usuário
 *                 example: true
 *     responses:
 *       200:
 *         description: Status do usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:userId/status', authenticateApiKey, userController.updateUserStatusById);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Deleta um usuário (Admin)
 *     description: Remove um usuário do sistema
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
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
 *                   example: "Usuário deletado com sucesso"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:userId', authenticateApiKey, userController.deleteUser);

module.exports = router; 