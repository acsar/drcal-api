const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DrCal API',
      version: '1.0.0',
      description: 'API para sistema open source de agendamento para profissionais de saúde',
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
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key para autenticação'
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT do Supabase para autenticação'
        }
      },

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
         },
         Professional: {
           type: 'object',
           properties: {
             id: {
               type: 'string',
               format: 'uuid',
               description: 'ID único do profissional'
             },
             name: {
               type: 'string',
               description: 'Nome do profissional'
             },
             specialty: {
               type: 'string',
               description: 'Especialidade médica'
             },
             slug: {
               type: 'string',
               description: 'Identificador amigável para URL'
             },
             crm: {
               type: 'string',
               description: 'Registro do Conselho Regional de Medicina'
             },
             rqe: {
               type: 'string',
               description: 'Registro de Qualificação de Especialista'
             },
             img_url: {
               type: 'string',
               format: 'uri',
               description: 'URL da imagem do profissional'
             },
             user_id: {
               type: 'string',
               format: 'uuid',
               description: 'ID do usuário proprietário'
             },
             created_at: {
               type: 'string',
               format: 'date-time',
               description: 'Data de criação'
             },
             updated_at: {
               type: 'string',
               format: 'date-time',
               description: 'Data da última atualização'
             }
           }
         },
         ProfessionalService: {
           type: 'object',
           properties: {
             id: {
               type: 'string',
               format: 'uuid',
               description: 'ID único do serviço'
             },
             professional_id: {
               type: 'string',
               format: 'uuid',
               description: 'ID do profissional'
             },
             service_name: {
               type: 'string',
               description: 'Nome do serviço'
             },
             duration_minutes: {
               type: 'integer',
               description: 'Duração em minutos'
             },
             is_deleted: {
               type: 'boolean',
               description: 'Status de exclusão (soft delete)'
             },
             created_at: {
               type: 'string',
               format: 'date-time',
               description: 'Data de criação'
             },
             updated_at: {
               type: 'string',
               format: 'date-time',
               description: 'Data da última atualização'
             }
           }
         }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos de rota
};

const specs = swaggerJsdoc(options);

module.exports = specs; 