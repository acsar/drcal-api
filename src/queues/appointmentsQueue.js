const { Queue } = require('bullmq');
const redis = require('../config/redis');

// Criando a fila de agendamentos
const appointmentsQueue = new Queue('appointments', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 10, // Remove jobs completados após 10 jobs
    removeOnFail: 5, // Remove jobs falhados após 5 jobs
    attempts: 3, // Número de tentativas em caso de falha
    backoff: {
      type: 'exponential',
      delay: 2000, // Delay inicial de 2 segundos
    },
  },
});

// Eventos da fila
appointmentsQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completado com sucesso`);
});

appointmentsQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} falhou:`, err.message);
});

appointmentsQueue.on('error', (err) => {
  console.error('Erro na fila de agendamentos:', err);
});

/**
 * Adiciona um job de processamento de agendamento à fila
 * @param {Object} appointmentData - Dados do agendamento
 * @param {Object} options - Opções do job
 * @returns {Promise<Job>} Job criado
 */
async function addAppointmentJob(appointmentData, options = {}) {
  try {
    const job = await appointmentsQueue.add('process-appointment', appointmentData, {
      priority: options.priority || 1,
      delay: options.delay || 0,
      ...options,
    });

    console.log(`Job de agendamento adicionado à fila: ${job.id}`);
    return job;
  } catch (error) {
    console.error('Erro ao adicionar job à fila:', error);
    throw error;
  }
}

/**
 * Adiciona um job de notificação à fila
 * @param {Object} notificationData - Dados da notificação
 * @param {Object} options - Opções do job
 * @returns {Promise<Job>} Job criado
 */
async function addNotificationJob(notificationData, options = {}) {
  try {
    const job = await appointmentsQueue.add('send-notification', notificationData, {
      priority: options.priority || 2,
      delay: options.delay || 0,
      ...options,
    });

    console.log(`Job de notificação adicionado à fila: ${job.id}`);
    return job;
  } catch (error) {
    console.error('Erro ao adicionar job de notificação à fila:', error);
    throw error;
  }
}

/**
 * Obtém estatísticas da fila
 * @returns {Promise<Object>} Estatísticas da fila
 */
async function getQueueStats() {
  try {
    const waiting = await appointmentsQueue.getWaiting();
    const active = await appointmentsQueue.getActive();
    const completed = await appointmentsQueue.getCompleted();
    const failed = await appointmentsQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas da fila:', error);
    throw error;
  }
}

module.exports = {
  appointmentsQueue,
  addAppointmentJob,
  addNotificationJob,
  getQueueStats,
}; 