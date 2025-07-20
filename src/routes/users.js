const express = require('express');
const userController = require('../controllers/userController');
const { authenticateApiKey, authenticateJWT } = require('../middleware/auth');

const router = express.Router();



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
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login do usuário
 *     description: Autentica o usuário com email e senha via Supabase Auth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "usuario@exemplo.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
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
 *                   example: "Login realizado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID do usuário
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Email do usuário
 *                     access_token:
 *                       type: string
 *                       description: Token de acesso JWT
 *                     refresh_token:
 *                       type: string
 *                       description: Token de refresh
 *                     api_key:
 *                       type: string
 *                       description: API key do usuário
 *                     is_active:
 *                       type: boolean
 *                       description: Status do usuário
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registro de novo usuário
 *     description: Cria uma nova conta de usuário via Supabase Auth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "usuario@exemplo.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
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
 *                   example: "Conta criada com sucesso. Verifique seu email para confirmar."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID do usuário
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Email do usuário
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Recuperação de senha
 *     description: Envia email de recuperação de senha via Supabase Auth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "usuario@exemplo.com"
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
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
 *                   example: "Email de recuperação enviado com sucesso"
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/forgot-password', userController.forgotPassword);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout do usuário
 *     description: Faz logout do usuário via Supabase Auth
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
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
 *                   example: "Logout realizado com sucesso"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/logout', authenticateJWT, userController.logout);

/**
 * @swagger
 * /users/test-jwt:
 *   get:
 *     summary: Teste de autenticação JWT
 *     description: Endpoint de teste para verificar se o BearerAuth está funcionando
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Autenticação JWT funcionando
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
 *                   example: "JWT funcionando!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                       format: email
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/test-jwt', authenticateJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JWT funcionando!',
    user: req.user
  });
});

router.get('/me', authenticateApiKey, userController.getCurrentUser);

/**
 * @swagger
 * /users/me/api-key:
 *   post:
 *     summary: Regenera a API key do usuário
 *     description: Gera uma nova API key para o usuário logado via JWT
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
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
 *         description: Token de autenticação inválido ou expirado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/me/api-key', authenticateJWT, userController.regenerateApiKey);

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