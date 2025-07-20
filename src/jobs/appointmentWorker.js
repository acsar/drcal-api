const { Worker } = require('bullmq');
const { bullMQRedis } = require('../config/redis');
const appointmentService = require('../services/appointmentService');

// Verificar se o Redis está disponível
let appointmentWorker = null;

async function initializeWorker() {
  try {
    // Testar conexão com Redis
    await bullMQRedis.ping();
    
    // Worker para processamento de agendamentos
    appointmentWorker = new Worker('appointments', async (job) => {
      const { type, data } = job.data;
      
      console.log(`Processando job ${job.id} do tipo: ${type}`);
      
      try {
        switch (type) {
          case 'process-appointment':
            return await processAppointment(data);
          
          case 'send-notification':
            return await sendNotification(data);
          
          default:
            throw new Error(`Tipo de job desconhecido: ${type}`);
        }
      } catch (error) {
        console.error(`Erro no processamento do job ${job.id}:`, error);
        throw error;
      }
    }, {
      connection: bullMQRedis,
      concurrency: 5, // Processa até 5 jobs simultaneamente
    });

    // Eventos do worker
    appointmentWorker.on('completed', (job) => {
      console.log(`Worker completou job ${job.id} com sucesso`);
    });

    appointmentWorker.on('failed', (job, err) => {
      console.error(`Worker falhou no job ${job.id}:`, err.message);
    });

    appointmentWorker.on('error', (err) => {
      console.error('Erro no worker de agendamentos:', err);
    });

    console.log('✅ Worker de agendamentos inicializado com sucesso');
    return appointmentWorker;
    
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      console.error('🔌 Redis não está rodando:');
      console.error('   - Verifique se o Redis está instalado e rodando');
      console.error('   - Verifique se REDIS_HOST e REDIS_PORT estão corretos');
      console.error('   - Em Docker: verifique se o container Redis está rodando');
    } else {
      console.warn('⚠️  Redis não disponível, worker não será inicializado:', error.message);
    }
    console.log('ℹ️  A API funcionará sem processamento de filas');
    return null;
  }
}

/**
 * Processa um agendamento usando advisory lock
 * @param {Object} appointmentData - Dados do agendamento
 * @returns {Promise<Object>} Resultado do processamento
 */
async function processAppointment(appointmentData) {
  const lockKey = `appointment_${appointmentData.id || Date.now()}`;
  
  try {
    // Tenta obter advisory lock
    const lockResult = await appointmentService.getAdvisoryLock(lockKey);
    
    if (!lockResult.locked) {
      console.log(`Não foi possível obter lock para agendamento: ${lockKey}`);
      throw new Error('Agendamento já está sendo processado');
    }
    
    console.log(`Lock obtido para agendamento: ${lockKey}`);
    
    // Simula processamento do agendamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Aqui você pode adicionar lógica específica do processamento
    // Por exemplo: validação, notificações, etc.
    
    const result = {
      appointmentId: appointmentData.id,
      status: 'processed',
      processedAt: new Date().toISOString(),
      lockKey: lockKey
    };
    
    console.log(`Agendamento processado com sucesso: ${appointmentData.id}`);
    return result;
    
  } catch (error) {
    console.error(`Erro no processamento do agendamento: ${error.message}`);
    throw error;
  }
}

/**
 * Envia notificação
 * @param {Object} notificationData - Dados da notificação
 * @returns {Promise<Object>} Resultado do envio
 */
async function sendNotification(notificationData) {
  try {
    // Simula envio de notificação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = {
      notificationId: notificationData.id,
      type: notificationData.type,
      recipient: notificationData.recipient,
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    
    console.log(`Notificação enviada: ${notificationData.type} para ${notificationData.recipient}`);
    return result;
    
  } catch (error) {
    console.error(`Erro no envio da notificação: ${error.message}`);
    throw error;
  }
}

// Inicializar o worker
initializeWorker();

module.exports = appointmentWorker; 