# Configuração Docker para DrCal API

## 🐳 Configuração Docker

A API DrCal (sistema open source de agendamento para profissionais de saúde) está configurada para rodar em ambiente Docker com Redis sem autenticação, ideal para produção.

## 📋 Pré-requisitos

- Docker
- Docker Compose
- Arquivo `.env` configurado

## 🚀 Inicialização

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# =====================================================
# SUPABASE CONFIGURATION (OBRIGATÓRIO)
# =====================================================
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anon_do_supabase

# =====================================================
# REDIS CONFIGURATION (OBRIGATÓRIO)
# =====================================================
# Host do Redis (em Docker: use 'redis')
REDIS_HOST=redis

# Porta do Redis (padrão: 6379)
REDIS_PORT=6379

# =====================================================
# SERVER CONFIGURATION
# =====================================================
PORT=3000
NODE_ENV=production
```

### 2. Iniciar os Serviços

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f api
```

### 3. Verificar Funcionamento

```bash
# Health check da API
curl http://localhost:3000/health

# Health check do Redis
docker-compose exec redis redis-cli ping

# Verificar logs
docker-compose logs api
```

## 🔧 Serviços Disponíveis

### API (Porta 3000)
- **URL:** http://localhost:3000
- **Documentação:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/health

### Redis (Porta 6379)
- **Configuração:** Sem autenticação
- **Persistência:** AOF habilitado
- **Volume:** `redis_data`

### Redis Commander (Porta 8081) - Opcional
- **URL:** http://localhost:8081
- **Perfil:** `monitoring`
- **Uso:** Interface web para gerenciar Redis

## 📝 Comandos Úteis

### Desenvolvimento
```bash
# Iniciar com logs
docker-compose up

# Rebuild da imagem
docker-compose build

# Parar serviços
docker-compose down
```

### Produção
```bash
# Iniciar em background
docker-compose up -d

# Verificar logs
docker-compose logs -f api

# Reiniciar API
docker-compose restart api

# Parar e remover volumes
docker-compose down -v
```

### Monitoramento
```bash
# Iniciar com Redis Commander
docker-compose --profile monitoring up -d

# Verificar uso de recursos
docker stats

# Acessar container da API
docker-compose exec api sh
```

## 🔍 Troubleshooting

### API não inicia
```bash
# Verificar logs
docker-compose logs api

# Verificar se Redis está rodando
docker-compose exec redis redis-cli ping

# Reiniciar serviços
docker-compose restart
```

### Redis não conecta
```bash
# Verificar se Redis está rodando
docker-compose ps redis

# Verificar logs do Redis
docker-compose logs redis

# Testar conexão manual
docker-compose exec redis redis-cli ping
```

### Problemas de rede
```bash
# Verificar redes Docker
docker network ls

# Inspecionar rede
docker network inspect drcal_drcal-network
```

## 🧪 Testando a API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Documentação Swagger
```bash
# Abrir no navegador
open http://localhost:3000/docs
```

### 3. Testar Profissionais
```bash
# Listar profissionais (requer API key)
curl -H "x-api-key: sua-api-key" \
  http://localhost:3000/professionals
```

### 4. Verificar Redis
```bash
# Acessar Redis CLI
docker-compose exec redis redis-cli

# Verificar chaves
KEYS *

# Verificar filas BullMQ
KEYS bull:*
```

## 📊 Monitoramento

### Redis Commander
```bash
# Iniciar com monitoramento
docker-compose --profile monitoring up -d

# Acessar interface
open http://localhost:8081
```

### Logs
```bash
# Logs da API
docker-compose logs -f api

# Logs do Redis
docker-compose logs -f redis

# Todos os logs
docker-compose logs -f
```

## 🔒 Segurança

### Em Produção
1. **Rede:** Use rede Docker isolada
2. **Portas:** Exponha apenas portas necessárias
3. **Volumes:** Use volumes nomeados
4. **Logs:** Configure rotação de logs
5. **Backup:** Configure backup do Redis

### Configurações Recomendadas
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  api:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
  
  redis:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 🚀 Deploy

### 1. Build da Imagem
```bash
docker-compose build
```

### 2. Iniciar Produção
```bash
docker-compose -f docker-compose.yml up -d
```

### 3. Verificar Status
```bash
docker-compose ps
curl http://localhost:3000/health
```

## 📝 Notas Importantes

1. **Redis sem autenticação:** Configurado para ambiente Docker isolado
2. **Persistência:** Dados do Redis são persistidos em volume
3. **Networking:** Serviços comunicam via rede Docker interna
4. **Health Checks:** Configurados para monitoramento automático
5. **Logs:** Centralizados e rotacionados

## 🆘 Suporte

Se houver problemas:

1. Verificar logs: `docker-compose logs`
2. Verificar status: `docker-compose ps`
3. Verificar rede: `docker network ls`
4. Reiniciar serviços: `docker-compose restart` 