const appointmentService = require('../services/appointmentService');
const { addAppointmentJob, addNotificationJob, getQueueStats } = require('../queues/appointmentsQueue');

class AppointmentController {
  /**
   * Cria um novo agendamento
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createAppointment(req, res) {
    try {
      const appointmentData = req.body;
      
      // Validação básica
      if (!appointmentData.patient_name || !appointmentData.appointment_date || !appointmentData.doctor_id) {
        return res.status(400).json({
          success: false,
          message: 'Nome do paciente, data do agendamento e ID do médico são obrigatórios'
        });
      }

      // Cria o agendamento
      const appointment = await appointmentService.createAppointment(appointmentData);
      
      // Adiciona job de processamento à fila
      await addAppointmentJob({
        type: 'process-appointment',
        data: appointment
      });

      // Adiciona job de notificação à fila
      await addNotificationJob({
        type: 'send-notification',
        data: {
          id: appointment.id,
          type: 'appointment_created',
          recipient: appointment.patient_email,
          appointment: appointment
        }
      });

      res.status(201).json({
        success: true,
        message: 'Agendamento criado com sucesso',
        data: appointment
      });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Busca slots disponíveis
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAvailableSlots(req, res) {
    try {
      const { date, doctor_id } = req.query;
      
      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Data é obrigatória'
        });
      }

      const slots = await appointmentService.getAvailableSlots(date, doctor_id);

      res.status(200).json({
        success: true,
        message: 'Slots disponíveis encontrados',
        data: slots,
        count: slots.length
      });
    } catch (error) {
      console.error('Erro ao buscar slots disponíveis:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Adiciona paciente à fila de espera
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async addToWaitlist(req, res) {
    try {
      const waitlistData = req.body;
      
      // Validação básica
      if (!waitlistData.patient_name || !waitlistData.patient_email) {
        return res.status(400).json({
          success: false,
          message: 'Nome e email do paciente são obrigatórios'
        });
      }

      const waitlistEntry = await appointmentService.addToWaitlist(waitlistData);

      // Adiciona job de notificação à fila
      await addNotificationJob({
        type: 'send-notification',
        data: {
          id: waitlistEntry.id,
          type: 'waitlist_added',
          recipient: waitlistEntry.patient_email,
          waitlist: waitlistEntry
        }
      });

      res.status(201).json({
        success: true,
        message: 'Paciente adicionado à fila de espera com sucesso',
        data: waitlistEntry
      });
    } catch (error) {
      console.error('Erro ao adicionar à fila de espera:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Lista fila de espera
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getWaitlist(req, res) {
    try {
      const waitlist = await appointmentService.getWaitlist();

      res.status(200).json({
        success: true,
        message: 'Fila de espera encontrada',
        data: waitlist,
        count: waitlist.length
      });
    } catch (error) {
      console.error('Erro ao buscar fila de espera:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Obtém estatísticas da fila
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getQueueStats(req, res) {
    try {
      const stats = await getQueueStats();

      res.status(200).json({
        success: true,
        message: 'Estatísticas da fila obtidas',
        data: stats
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas da fila:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

module.exports = new AppointmentController(); 