const { addAppointmentJob, addNotificationJob } = require('../queues/appointmentsQueue');
const userService = require('../services/userService');

class WebhookController {
  /**
   * Recebe webhook do Supabase e adiciona job à fila
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async handleSupabaseWebhook(req, res) {
    try {
      const webhookData = req.body;
      
      console.log('Webhook recebido do Supabase:', JSON.stringify(webhookData, null, 2));

      // Validação básica do webhook
      if (!webhookData.type || !webhookData.table) {
        return res.status(400).json({
          success: false,
          message: 'Webhook inválido: tipo e tabela são obrigatórios'
        });
      }

      // Processa diferentes tipos de eventos
      switch (webhookData.type) {
        case 'INSERT':
          await this.handleInsertEvent(webhookData);
          break;
        
        case 'UPDATE':
          await this.handleUpdateEvent(webhookData);
          break;
        
        case 'DELETE':
          await this.handleDeleteEvent(webhookData);
          break;
        
        default:
          console.log(`Tipo de evento não suportado: ${webhookData.type}`);
      }

      // Tratamento especial para auth.users (criação automática na tabela users)
      if (webhookData.table === 'auth.users' && webhookData.type === 'INSERT') {
        await this.handleAuthUserCreated(webhookData);
      }

      res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Processa eventos de INSERT
   * @param {Object} webhookData - Dados do webhook
   */
  async handleInsertEvent(webhookData) {
    const { table, record } = webhookData;

    switch (table) {
      case 'appointments':
        await addAppointmentJob({
          type: 'process-appointment',
          data: record
        });
        console.log(`Job de processamento adicionado para agendamento: ${record.id}`);
        break;

      case 'waitlist':
        await addNotificationJob({
          type: 'send-notification',
          data: {
            id: record.id,
            type: 'waitlist_added',
            recipient: record.patient_email,
            waitlist: record
          }
        });
        console.log(`Job de notificação adicionado para fila de espera: ${record.id}`);
        break;

      default:
        console.log(`Tabela não suportada para INSERT: ${table}`);
    }
  }

  /**
   * Processa eventos de UPDATE
   * @param {Object} webhookData - Dados do webhook
   */
  async handleUpdateEvent(webhookData) {
    const { table, record, old_record } = webhookData;

    switch (table) {
      case 'appointments':
        // Verifica se o status mudou
        if (record.status !== old_record.status) {
          await addNotificationJob({
            type: 'send-notification',
            data: {
              id: record.id,
              type: 'appointment_status_changed',
              recipient: record.patient_email,
              appointment: record,
              old_status: old_record.status,
              new_status: record.status
            }
          });
          console.log(`Job de notificação de mudança de status adicionado: ${record.id}`);
        }
        break;

      default:
        console.log(`Tabela não suportada para UPDATE: ${table}`);
    }
  }

  /**
   * Processa eventos de DELETE
   * @param {Object} webhookData - Dados do webhook
   */
  async handleDeleteEvent(webhookData) {
    const { table, old_record } = webhookData;

    switch (table) {
      case 'appointments':
        await addNotificationJob({
          type: 'send-notification',
          data: {
            id: old_record.id,
            type: 'appointment_cancelled',
            recipient: old_record.patient_email,
            appointment: old_record
          }
        });
        console.log(`Job de notificação de cancelamento adicionado: ${old_record.id}`);
        break;

      default:
        console.log(`Tabela não suportada para DELETE: ${table}`);
    }
  }

  /**
   * Trata criação de usuário no auth.users
   * @param {Object} webhookData - Dados do webhook
   */
  async handleAuthUserCreated(webhookData) {
    try {
      const { record } = webhookData;
      
      // Cria automaticamente um registro na tabela users
      const user = await userService.createUser(record.id);
      
      console.log(`Usuário criado automaticamente na tabela users: ${user.user_id}`);
      
      // Adiciona job de notificação
      await addNotificationJob({
        type: 'send-notification',
        data: {
          id: user.user_id,
          type: 'user_created',
          recipient: record.email,
          user: user
        }
      });
      
    } catch (error) {
      console.error('Erro ao criar usuário automaticamente:', error);
    }
  }
}

module.exports = new WebhookController(); 