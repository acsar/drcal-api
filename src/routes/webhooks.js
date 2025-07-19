const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

/**
 * @swagger
 * /webhooks/supabase:
 *   post:
 *     summary: Webhook do Supabase
 *     description: Recebe webhooks do Supabase e adiciona jobs à fila de processamento
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - table
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [INSERT, UPDATE, DELETE]
 *                 description: Tipo de evento
 *                 example: "INSERT"
 *               table:
 *                 type: string
 *                 description: Nome da tabela afetada
 *                 example: "appointments"
 *               record:
 *                 type: object
 *                 description: Registro atual (para INSERT e UPDATE)
 *                 example:
 *                   id: "123e4567-e89b-12d3-a456-426614174000"
 *                   patient_name: "João Silva"
 *                   patient_email: "joao.silva@email.com"
 *                   appointment_date: "2024-01-15T14:30:00Z"
 *                   status: "scheduled"
 *               old_record:
 *                 type: object
 *                 description: Registro anterior (para UPDATE e DELETE)
 *                 example:
 *                   id: "123e4567-e89b-12d3-a456-426614174000"
 *                   status: "confirmed"
 *     responses:
 *       200:
 *         description: Webhook processado com sucesso
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
 *                   example: "Webhook processado com sucesso"
 *       400:
 *         description: Webhook inválido
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
 *                   example: "Webhook inválido: tipo e tabela são obrigatórios"
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/supabase', webhookController.handleSupabaseWebhook);

module.exports = router; 