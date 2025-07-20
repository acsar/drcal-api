const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Importações de configuração
const swaggerSpecs = require('./docs/swagger');

// Importações de rotas
const appointmentRoutes = require('./routes/appointments');
const webhookRoutes = require('./routes/webhooks');
const userRoutes = require('./routes/users');
const professionalRoutes = require('./routes/professionals');
const professionalServicesRoutes = require('./routes/professionalServices');

// Importação do worker (inicia o processamento de filas apenas se Redis estiver disponível)
require('./jobs/appointmentWorker');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(helmet());
app.use(cors());

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'DrCal API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
  }
}));

// Rotas da API
app.use('/appointments', appointmentRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/users', userRoutes);
app.use('/professionals', professionalRoutes);
app.use('/professionals', professionalServicesRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DrCal API - Sistema Open Source de Agendamento para Profissionais de Saúde',
    version: '1.0.0',
    documentation: '/docs',
    health: '/health'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor DrCal API rodando na porta ${PORT}`);
  console.log(`📚 Documentação disponível em: http://localhost:${PORT}/docs`);
  console.log(`🏥 Health check em: http://localhost:${PORT}/health`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Tratamento de sinais para graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido, encerrando servidor...');
  process.exit(0);
});

module.exports = app; 