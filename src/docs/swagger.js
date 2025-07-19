const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DrCal API',
      version: '1.0.0',
      description: 'API para sistema de agendamentos médicos',
      contact: {
        name: 'DrCal Team',
        email: 'contato@drcal.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Appointment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do agendamento'
            },
            patient_name: {
              type: 'string',
              description: 'Nome do paciente'
            },
            patient_email: {
              type: 'string',
              format: 'email',
              description: 'Email do paciente'
            },
            appointment_date: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora do agendamento'
            },
            doctor_id: {
              type: 'string',
              description: 'ID do médico'
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
              description: 'Status do agendamento'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            }
          }
        },
        AvailableSlot: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
              description: 'Data do slot'
            },
            time: {
              type: 'string',
              description: 'Horário do slot'
            },
            doctor_id: {
              type: 'string',
              description: 'ID do médico'
            },
            available: {
              type: 'boolean',
              description: 'Se o slot está disponível'
            }
          }
        },
                 WaitlistEntry: {
           type: 'object',
           properties: {
             id: {
               type: 'string',
               description: 'ID único da entrada na fila'
             },
             patient_name: {
               type: 'string',
               description: 'Nome do paciente'
             },
             patient_email: {
               type: 'string',
               format: 'email',
               description: 'Email do paciente'
             },
             preferred_date: {
               type: 'string',
               format: 'date',
               description: 'Data preferida'
             },
             created_at: {
               type: 'string',
               format: 'date-time',
               description: 'Data de criação'
             }
           }
         },
         User: {
           type: 'object',
           properties: {
             user_id: {
               type: 'string',
               format: 'uuid',
               description: 'ID do usuário'
             },
             api_key: {
               type: 'string',
               description: 'API key do usuário'
             },
             is_active: {
               type: 'boolean',
               description: 'Status ativo/inativo do usuário'
             }
           }
         }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos de rota
};

const specs = swaggerJsdoc(options);

module.exports = specs; 