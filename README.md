# DrCal API - Sistema Open Source de Agendamento para Profissionais de Saúde

## 📄 Descrição

API backend completa para sistema open source de agendamento para profissionais de saúde com filas assíncronas, integração Supabase e documentação Swagger.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Supabase** - Banco de dados e autenticação
- **BullMQ** - Sistema de filas com Redis
- **Swagger** - Documentação da API
- **Docker** - Containerização
- **Redis** - Cache e filas

## 📁 Estrutura do Projeto

```
src/
├── config/
│   ├── supabase.js      # Configuração do cliente Supabase
│   └── redis.js         # Configuração do Redis
├── controllers/
│   ├── appointmentController.js  # Controller de agendamentos
│   └── webhookController.js      # Controller de webhooks
├── routes/
│   ├── appointments.js   # Rotas de agendamentos
│   └── webhooks.js       # Rotas de webhooks
├── services/
│   └── appointmentService.js     # Lógica de negócio
├── queues/
│   └── appointmentsQueue.js      # Configuração das filas BullMQ
├── jobs/
│   └── appointmentWorker.js      # Worker para processamento
├── docs/
│   └── swagger.js        # Configuração Swagger
├── utils/
│   └── logger.js         # Utilitário de logging
└── index.js              # Ponto de entrada da aplicação
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+
- Redis
- Conta no Supabase

### 1. Clone o repositório

```bash
git clone <repository-url>
cd drcal-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Supabase Configuration
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anon_do_supabase

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Configure o Supabase

Crie as seguintes tabelas no seu projeto Supabase (veja arquivo `supabase-setup.sql`):

### 5. Execute a aplicação

#### Desenvolvimento
```bash
npm run dev
```

#### Produção
```bash
npm start
```

## 🐳 Docker

### Executar com Docker Compose

```bash
# Construir e iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar serviços
docker-compose down
```

### Executar com monitoramento (inclui Redis Commander)

```bash
docker-compose --profile monitoring up -d
```

## 📚 Documentação da API

A documentação Swagger está disponível em:
- **Desenvolvimento**: http://localhost:3000/docs
- **Produção**: http://seu-dominio/docs

## 🔌 Endpoints

### Autenticação

A API utiliza autenticação via API Key. Inclua o header `x-api-key` em todas as requisições:

```bash
x-api-key: sua_api_key_aqui
```

### Agendamentos

- `POST /appointments` - Criar agendamento (requer autenticação)
- `GET /appointments/available` - Buscar slots disponíveis (autenticação opcional)
- `POST /appointments/waitlist` - Adicionar à fila de espera (requer autenticação)
- `GET /appointments/waitlist` - Listar fila de espera (requer autenticação)
- `GET /appointments/queue/stats` - Estatísticas da fila (requer autenticação)

### Usuários

- `GET /users/me` - Obter informações do usuário atual
- `POST /users/me/api-key` - Regenerar API key
- `PUT /users/me/status` - Atualizar status do usuário
- `GET /users` - Listar todos os usuários (Admin)
- `GET /users/{userId}` - Obter usuário específico (Admin)
- `PUT /users/{userId}/status` - Atualizar status de usuário (Admin)
- `DELETE /users/{userId}` - Deletar usuário (Admin)

### Webhooks

- `POST /webhooks/supabase` - Webhook do Supabase

### Sistema

- `GET /` - Informações da API
- `GET /health` - Health check
- `GET /docs` - Documentação Swagger

## 🔄 Sistema de Filas

O sistema utiliza BullMQ com Redis para processamento assíncrono:

### Tipos de Jobs

1. **process-appointment** - Processa agendamentos com advisory lock
2. **send-notification** - Envia notificações

### Monitoramento

- **Redis Commander**: http://localhost:8081 (quando usando profile monitoring)
- **Estatísticas**: `GET /appointments/queue/stats`

## 🔧 Configuração de Webhooks

Configure webhooks no Supabase para as seguintes tabelas:
- `appointments` (INSERT, UPDATE, DELETE)
- `waitlist` (INSERT)
- `auth.users` (INSERT) - Para criação automática de usuários

URL do webhook: `http://seu-dominio/webhooks/supabase`

## 🔑 Como Obter sua API Key

1. **Crie uma conta no Supabase Auth** (se ainda não tiver)
2. **A API key será gerada automaticamente** quando você se registrar
3. **Acesse sua API key** através do endpoint `/users/me` (após primeiro login)
4. **Use a API key** no header `x-api-key` em todas as requisições

### Exemplo de uso:
```bash
curl -H "x-api-key: sua_api_key_aqui" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3000/appointments \
     -d '{"patient_name": "João Silva", ...}'
```

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
SUPABASE_URL=sua_url_producao
SUPABASE_KEY=sua_chave_producao
REDIS_HOST=seu_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=sua_senha_redis
PORT=3000
```

### Docker Production

```bash
# Construir imagem de produção
docker build -t drcal-api .

# Executar container
docker run -d \
  --name drcal-api \
  -p 3000:3000 \
  --env-file .env \
  drcal-api
```

## 📝 Logs

A aplicação utiliza logging estruturado:
- **Desenvolvimento**: Logs coloridos no console
- **Produção**: Logs em formato JSON

## 🔒 Segurança

- Helmet.js para headers de segurança
- CORS configurado
- Validação de entrada
- Usuário não-root no Docker
- Advisory locks para processamento seguro

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a **AGPLv3**.

Isso significa que você pode usar, modificar e redistribuir o sistema livremente, desde que mantenha esta licença e publique as modificações se rodar como serviço.

### ❗ Licença Comercial

Se deseja usar este sistema **sem abrir o código-fonte das modificações**, oferecemos uma **licença comercial**.

**Entre em contato:** comercial@caresys.com.br

### 📋 O que a AGPLv3 permite:

✅ **Usar** o software livremente  
✅ **Modificar** o código-fonte  
✅ **Redistribuir** o software  
✅ **Usar comercialmente**  

### ⚠️ O que a AGPLv3 exige:

🔒 **Manter a licença** AGPLv3  
🔒 **Disponibilizar o código-fonte** das modificações  
🔒 **Licenciar modificações** sob AGPLv3  
🔒 **Informar usuários** sobre seus direitos  

### 🏢 Para Empresas:

Se você é uma empresa e precisa:
- Manter modificações privadas
- Usar sem abrir o código-fonte
- Suporte comercial
- Licença permissiva

**Considere nossa licença comercial** - entre em contato: comercial@caresys.com.br

## 📝 Aplicando a Licença em Novos Arquivos

Ao adicionar novos arquivos ao projeto, inclua o seguinte cabeçalho:

```javascript
/**
 * DrCal API - Sistema Open Source de Agendamento para Profissionais de Saúde
 * Copyright (C) 2024 CareSys
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * For commercial licensing options, contact: comercial@caresys.com.br
 */
```

Veja o arquivo `LICENSE_HEADER.txt` para o texto completo.

## 🆘 Suporte

Para suporte, envie um email para contato@drcal.com ou abra uma issue no repositório. 