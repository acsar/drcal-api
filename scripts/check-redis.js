#!/usr/bin/env node

/**
 * Script para verificar a configuração do Redis
 * Uso: node scripts/check-redis.js
 */

require('dotenv').config();
const Redis = require('ioredis');

console.log('🔍 Verificando configuração do Redis...\n');

// Verificar variáveis de ambiente
console.log('📋 Variáveis de ambiente:');
console.log(`   REDIS_HOST: ${process.env.REDIS_HOST || 'localhost (padrão)'}`);
console.log(`   REDIS_PORT: ${process.env.REDIS_PORT || '6379 (padrão)'}`);
console.log(`   Configuração: Sem autenticação (adequado para Docker)`);

// Configuração para teste (sem autenticação)
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  connectTimeout: 5000,
  commandTimeout: 3000,
  lazyConnect: false,
};

console.log('\n🔌 Tentando conectar ao Redis...');

const redis = new Redis(redisConfig);

redis.on('connect', () => {
  console.log('✅ Conectado ao Redis com sucesso!');
  
  // Testar operações básicas
  testRedisOperations();
});

redis.on('error', (error) => {
  console.log('❌ Erro na conexão Redis:');
  console.log(`   ${error.message}`);
  
  if (error.message.includes('ECONNREFUSED')) {
    console.log('\n🔌 Redis não está rodando:');
    console.log('   - Verifique se Redis está instalado');
    console.log('   - Inicie o Redis: redis-server');
    console.log('   - Em Docker: verifique se o container Redis está rodando');
    console.log('   - Verifique se REDIS_HOST e REDIS_PORT estão corretos');
  }
  
  process.exit(1);
});

async function testRedisOperations() {
  try {
    console.log('\n🧪 Testando operações básicas...');
    
    // Teste 1: PING
    const pingResult = await redis.ping();
    console.log(`   ✅ PING: ${pingResult}`);
    
    // Teste 2: SET/GET
    await redis.set('test_key', 'test_value');
    const getResult = await redis.get('test_key');
    console.log(`   ✅ SET/GET: ${getResult}`);
    
    // Teste 3: DEL
    await redis.del('test_key');
    console.log('   ✅ DEL: chave removida');
    
    // Teste 4: Verificar configuração
    const configResult = await redis.config('GET', 'requirepass');
    console.log(`   ✅ Config requirepass: ${configResult[1] || 'não definida'}`);
    
    console.log('\n🎉 Todos os testes passaram! Redis está funcionando corretamente.');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Inicie a API: npm start');
    console.log('   2. Verifique os logs de conexão');
    console.log('   3. Teste as funcionalidades da API');
    
    process.exit(0);
    
  } catch (error) {
    console.log(`❌ Erro nos testes: ${error.message}`);
    process.exit(1);
  }
}

// Timeout para evitar travamento
setTimeout(() => {
  console.log('\n⏰ Timeout: Redis não respondeu em 10 segundos');
  process.exit(1);
}, 10000); 