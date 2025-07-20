const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { authenticateApiKey } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     description: Cria um novo agendamento médico e adiciona jobs de processamento à fila
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_name
 *               - patient_email
 *               - appointment_date
 *               - doctor_id
 *             properties:
 *               patient_name:
 *                 type: string
 *                 description: Nome completo do paciente
 *                 example: "João Silva"
 *               patient_email:
 *                 type: string
 *                 format: email
 *                 description: Email do paciente
 *                 example: "joao.silva@email.com"
 *               appointment_date:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do agendamento
 *                 example: "2024-01-15T14:30:00Z"
 *               doctor_id:
 *                 type: string
 *                 description: ID do médico
 *                 example: "d123e4567-e89b-12d3-a456-426614174000"
 *               notes:
 *                 type: string
 *                 description: Observações adicionais
 *                 example: "Consulta de rotina"
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
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
 *                   example: "Agendamento criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
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
 *                   example: "Nome do paciente, data do agendamento e ID do médico são obrigatórios"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', authenticateApiKey, appointmentController.createAppointment);

/**
 * @swagger
 * /appointments/available:
 *   get:
 *     summary: Busca slots disponíveis
 *     description: Retorna slots de horários disponíveis para agendamento
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data para buscar slots (YYYY-MM-DD)
 *         example: "2024-01-15"
 *       - in: query
 *         name: doctor_id
 *         required: false
 *         schema:
 *           type: string
 *         description: ID do médico (opcional)
 *         example: "d123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Slots disponíveis encontrados
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
 *                   example: "Slots disponíveis encontrados"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AvailableSlot'
 *                 count:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Data não fornecida
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
 *                   example: "Data é obrigatória"
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/available', appointmentController.getAvailableSlots);

/**
 * @swagger
 * /appointments/waitlist:
 *   post:
 *     summary: Adiciona paciente à fila de espera
 *     description: Adiciona um paciente à fila de espera para agendamentos
 *     tags: [Waitlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_name
 *               - patient_email
 *             properties:
 *               patient_name:
 *                 type: string
 *                 description: Nome completo do paciente
 *                 example: "Maria Santos"
 *               patient_email:
 *                 type: string
 *                 format: email
 *                 description: Email do paciente
 *                 example: "maria.santos@email.com"
 *               preferred_date:
 *                 type: string
 *                 format: date
 *                 description: Data preferida para agendamento
 *                 example: "2024-01-20"
 *               phone:
 *                 type: string
 *                 description: Telefone do paciente
 *                 example: "(11) 99999-9999"
 *               notes:
 *                 type: string
 *                 description: Observações adicionais
 *                 example: "Preferência por horário da manhã"
 *     responses:
 *       201:
 *         description: Paciente adicionado à fila de espera com sucesso
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
 *                   example: "Paciente adicionado à fila de espera com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/WaitlistEntry'
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
 *                   example: "Nome e email do paciente são obrigatórios"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/waitlist', authenticateApiKey, appointmentController.addToWaitlist);

/**
 * @swagger
 * /appointments/waitlist:
 *   get:
 *     summary: Lista fila de espera
 *     description: Retorna todos os pacientes na fila de espera
 *     tags: [Waitlist]
 *     responses:
 *       200:
 *         description: Fila de espera encontrada
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
 *                   example: "Fila de espera encontrada"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WaitlistEntry'
 *                 count:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/waitlist', authenticateApiKey, appointmentController.getWaitlist);

/**
 * @swagger
 * /appointments/queue/stats:
 *   get:
 *     summary: Obtém estatísticas da fila
 *     description: Retorna estatísticas da fila de processamento de agendamentos
 *     tags: [Queue]
 *     responses:
 *       200:
 *         description: Estatísticas da fila obtidas
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
 *                   example: "Estatísticas da fila obtidas"
 *                 data:
 *                   type: object
 *                   properties:
 *                     waiting:
 *                       type: integer
 *                       description: Número de jobs aguardando
 *                       example: 5
 *                     active:
 *                       type: integer
 *                       description: Número de jobs ativos
 *                       example: 2
 *                     completed:
 *                       type: integer
 *                       description: Número de jobs completados
 *                       example: 150
 *                     failed:
 *                       type: integer
 *                       description: Número de jobs falhados
 *                       example: 3
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/queue/stats', authenticateApiKey, appointmentController.getQueueStats);

module.exports = router; 