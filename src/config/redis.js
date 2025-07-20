const Redis = require('ioredis');
require('dotenv').config();

// Configuração do Redis para BullMQ
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: null, // BullMQ requer que seja null
  lazyConnect: true,
  retryDelayOnClusterDown: 300,
  enableReadyCheck: false,
  maxLoadingTimeout: 10000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Criar conexão Redis
const redis = new Redis(redisConfig);

redis.on('error', (error) => {
  console.error('❌ Erro na conexão Redis:', error.message);
  if (error.message.includes('ECONNREFUSED')) {
    console.error('🔌 Redis não está rodando. Verifique:');
    console.error('   - Redis está instalado e rodando');
    console.error('   - REDIS_HOST e REDIS_PORT estão corretos');
    console.error('   - Em Docker: verifique se o container Redis está rodando');
  }
});

redis.on('connect', () => {
  console.log('✅ Conectado ao Redis com sucesso');
});

module.exports = {
  redis
}; 