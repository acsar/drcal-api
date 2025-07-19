const Redis = require('ioredis');
require('dotenv').config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
};

const redis = new Redis(redisConfig);

redis.on('error', (error) => {
  console.error('Erro na conexão Redis:', error);
});

redis.on('connect', () => {
  console.log('Conectado ao Redis com sucesso');
});

module.exports = redis; 