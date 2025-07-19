# 🔐 Autenticação - DrCal API

## Visão Geral

A DrCal API utiliza autenticação baseada em **API Keys** para proteger os endpoints. Cada usuário possui uma API key única que deve ser incluída em todas as requisições.

## Como Funciona

### 1. Criação Automática de Usuários

Quando um usuário se registra no **Supabase Auth**, automaticamente:
- Um registro é criado na tabela `users`
- Uma API key única é gerada
- O usuário fica ativo por padrão

### 2. Autenticação via API Key

Todas as requisições devem incluir o header:
```bash
x-api-key: sua_api_key_aqui
```

### 3. Validação

A API valida:
- ✅ Existência da API key
- ✅ Usuário ativo (`is_active = true`)
- ✅ API key válida

## 🔑 Como Obter sua API Key

### Passo 1: Criar Conta
1. Acesse seu projeto Supabase
2. Vá para **Authentication > Users**
3. Crie uma nova conta ou use o sistema de registro

### Passo 2: Obter API Key
Após criar a conta, use o endpoint:
```bash
GET /users/me
x-api-key: sua_api_key_aqui
```

**Nota:** Para o primeiro acesso, você precisará obter a API key diretamente no banco de dados ou usar o Supabase Dashboard.

### Passo 3: Usar a API Key
```bash
curl -H "x-api-key: sua_api_key_aqui" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3000/appointments \
     -d '{"patient_name": "João Silva", ...}'
```

## 📋 Endpoints por Nível de Autenticação

### 🔒 Requer Autenticação
- `POST /appointments` - Criar agendamento
- `POST /appointments/waitlist` - Adicionar à fila de espera
- `GET /appointments/waitlist` - Listar fila de espera
- `GET /appointments/queue/stats` - Estatísticas da fila
- `GET /users/me` - Informações do usuário
- `POST /users/me/api-key` - Regenerar API key
- `PUT /users/me/status` - Atualizar status
- `GET /users` - Listar usuários (Admin)
- `GET /users/{userId}` - Obter usuário (Admin)
- `PUT /users/{userId}/status` - Atualizar usuário (Admin)
- `DELETE /users/{userId}` - Deletar usuário (Admin)

### 🔓 Autenticação Opcional
- `GET /appointments/available` - Slots disponíveis

### 🌐 Público
- `GET /` - Informações da API
- `GET /health` - Health check
- `GET /docs` - Documentação Swagger
- `POST /webhooks/supabase` - Webhook do Supabase

## 🛡️ Segurança

### Validações Implementadas
- ✅ API key obrigatória para endpoints protegidos
- ✅ Verificação de usuário ativo
- ✅ API key única por usuário
- ✅ Regeneração segura de API keys
- ✅ Logs de autenticação

### Boas Práticas
1. **Nunca compartilhe sua API key**
2. **Use HTTPS em produção**
3. **Regenere a API key regularmente**
4. **Monitore o uso da API**
5. **Desative usuários inativos**

## 🔄 Regeneração de API Key

Para regenerar sua API key:
```bash
POST /users/me/api-key
x-api-key: sua_api_key_atual
```

**Resposta:**
```json
{
  "success": true,
  "message": "API key regenerada com sucesso",
  "data": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "api_key": "nova_api_key_aqui",
    "is_active": true
  }
}
```

## 🚨 Códigos de Erro

### 401 - Não Autorizado
```json
{
  "success": false,
  "message": "API key é obrigatória",
  "error": "MISSING_API_KEY"
}
```

### 401 - API Key Inválida
```json
{
  "success": false,
  "message": "API key inválida",
  "error": "INVALID_API_KEY"
}
```

### 403 - Usuário Inativo
```json
{
  "success": false,
  "message": "Usuário inativo",
  "error": "INACTIVE_USER"
}
```

## 🧪 Testando Autenticação

### Swagger UI
1. Acesse: http://localhost:3000/docs
2. Clique no botão "Authorize"
3. Digite sua API key no campo `x-api-key`
4. Teste os endpoints

### cURL
```bash
# Teste de autenticação
curl -H "x-api-key: sua_api_key" \
     http://localhost:3000/users/me

# Criar agendamento
curl -H "x-api-key: sua_api_key" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3000/appointments \
     -d '{
       "patient_name": "João Silva",
       "patient_email": "joao@email.com",
       "appointment_date": "2024-01-15T14:30:00Z",
       "doctor_id": "d123e4567-e89b-12d3-a456-426614174000"
     }'
```

### Postman
1. Configure o header `x-api-key` com sua API key
2. Teste os endpoints protegidos

## 🔧 Configuração no Supabase

### Tabela `users`
```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Webhook para `auth.users`
Configure um webhook no Supabase para a tabela `auth.users`:
- **Eventos:** INSERT
- **URL:** `http://seu-dominio/webhooks/supabase`
- **Método:** POST

Isso garantirá que novos usuários tenham suas API keys geradas automaticamente.

## 📞 Suporte

Se você tiver problemas com autenticação:
1. Verifique se a API key está correta
2. Confirme se o usuário está ativo
3. Teste a regeneração da API key
4. Verifique os logs da aplicação 