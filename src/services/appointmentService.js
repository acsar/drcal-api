const supabase = require('../config/supabase');

class AppointmentService {
  /**
   * Cria um novo agendamento
   * @param {Object} appointmentData - Dados do agendamento
   * @returns {Promise<Object>} Agendamento criado
   */
  async createAppointment(appointmentData) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar agendamento: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de agendamentos: ${error.message}`);
    }
  }

  /**
   * Busca slots disponíveis
   * @param {string} date - Data para buscar slots (YYYY-MM-DD)
   * @param {string} doctorId - ID do médico (opcional)
   * @returns {Promise<Array>} Lista de slots disponíveis
   */
  async getAvailableSlots(date, doctorId = null) {
    try {
      let query = supabase
        .from('available_slots')
        .select('*')
        .eq('date', date)
        .eq('available', true);

      if (doctorId) {
        query = query.eq('doctor_id', doctorId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erro ao buscar slots disponíveis: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Erro no serviço de slots: ${error.message}`);
    }
  }

  /**
   * Adiciona paciente à fila de espera
   * @param {Object} waitlistData - Dados do paciente para fila de espera
   * @returns {Promise<Object>} Entrada criada na fila de espera
   */
  async addToWaitlist(waitlistData) {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([waitlistData])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao adicionar à fila de espera: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no serviço de fila de espera: ${error.message}`);
    }
  }

  /**
   * Lista todos os pacientes na fila de espera
   * @returns {Promise<Array>} Lista de pacientes na fila de espera
   */
  async getWaitlist() {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Erro ao buscar fila de espera: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Erro no serviço de fila de espera: ${error.message}`);
    }
  }

  /**
   * Executa RPC para obter advisory lock do Postgres
   * @param {string} lockKey - Chave do lock
   * @returns {Promise<Object>} Resultado do lock
   */
  async getAdvisoryLock(lockKey) {
    try {
      const { data, error } = await supabase.rpc('get_advisory_lock', {
        lock_key: lockKey
      });

      if (error) {
        throw new Error(`Erro ao obter advisory lock: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Erro no advisory lock: ${error.message}`);
    }
  }
}

module.exports = new AppointmentService(); 