# Autenticação - DrCal API

## Visão Geral

A API do DrCal utiliza um sistema de autenticação híbrido que combina **Supabase Auth** (JWT) para autenticação de usuários e **API Keys** para acesso programático aos recursos.

## Sistema de Autenticação

### 1. Autenticação de Usuários (Supabase Auth)
Para operações que requerem autenticação de usuário (login, registro, regeneração de API key):

- **Login/Logout** via Supabase Auth
- **Registro** de novos usuários
- **Recuperação de senha**
- **Tokens JWT** para sessões

### 2. Autenticação Programática (API Keys)
Para acesso programático aos recursos da API:

- **API Keys** únicas por usuário
- **Autenticação via header** `x-api-key`
- **Acesso direto** aos endpoints protegidos

## Fluxo de Autenticação

### Passo 1: Registro de Usuário
```http
POST /users/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Conta criada com sucesso. Verifique seu email para confirmar.",
  "data": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@exemplo.com"
  }
}
```

### Passo 2: Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@exemplo.com",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "api_key": "sua_api_key_aqui",
    "is_active": true
  }
}
```

### Passo 3: Usar a API Key
Com a API key obtida no login, você pode acessar os recursos:

```http
GET /users/me
x-api-key: sua_api_key_aqui
```

### Passo 4: Regenerar API Key (se necessário)
Se precisar regenerar sua API key:

```http
POST /users/me/api-key
Authorization: Bearer seu_jwt_token_aqui
```

## Usando o Swagger UI

### Configurando Autenticação no Swagger

1. **Acesse a documentação Swagger**: `http://localhost:3000/docs`

2. **Para endpoints que usam API Key**:
   - Clique no botão **"Authorize"** (ícone de cadeado)
   - No campo `x-api-key`, digite sua API key
   - Clique em **"Authorize"**

3. **Para endpoints que usam JWT Bearer**:
   - Clique no botão **"Authorize"** (ícone de cadeado)
   - No campo `BearerAuth`, digite seu token JWT (sem "Bearer ")
   - Clique em **"Authorize"**

### Exemplo Prático no Swagger

1. **Faça login primeiro**:
   - Use a rota `POST /users/login`
   - Copie o `access_token` da resposta

2. **Configure autenticação Bearer**:
   - Clique em **"Authorize"**
   - Cole o token no campo `BearerAuth`
   - Clique em **"Authorize"**

3. **Teste a regeneração de API key**:
   - Use a rota `POST /users/me/api-key`
   - Agora deve funcionar com o token configurado

## Endpoints de Autenticação

### 🔐 Autenticação de Usuário
- `POST /users/register` - Registro de novo usuário
- `POST /users/login` - Login do usuário
- `POST /users/logout` - Logout do usuário
- `POST /users/forgot-password` - Recuperação de senha

### 🔑 Operações com API Key
- `POST /users/me/api-key` - Regenerar API key (requer JWT)
- `GET /users/me` - Informações do usuário (requer API key)
- `PUT /users/me/status` - Atualizar status (requer API key)

### 🔒 Endpoints Protegidos (API Key)
- `POST /appointments` - Criar agendamento
- `POST /appointments/waitlist` - Adicionar à fila de espera
- `GET /appointments/waitlist` - Listar fila de espera
- `GET /appointments/queue/stats` - Estatísticas da fila
- `GET /users` - Listar usuários (Admin)
- `GET /users/{userId}` - Obter usuário (Admin)
- `PUT /users/{userId}/status` - Atualizar usuário (Admin)
- `DELETE /users/{userId}` - Deletar usuário (Admin)

### 🔓 Endpoints Públicos
- `GET /` - Informações da API
- `GET /health` - Health check
- `GET /docs` - Documentação Swagger
- `GET /appointments/available` - Slots disponíveis
- `POST /webhooks/supabase` - Webhook do Supabase

## Recuperação de Senha

### Solicitar Recuperação
```http
POST /users/forgot-password
Content-Type: application/json

{
  "email": "usuario@exemplo.com"
}
```

O Supabase enviará um email com link para redefinir a senha.

## Regeneração de API Key

### Cenário: API Key Perdida/Comprometida
1. **Faça login** com email/senha
2. **Use o JWT token** para regenerar a API key
3. **Não precisa** da API key antiga

```http
POST /users/me/api-key
Authorization: Bearer seu_jwt_token_aqui
```

**Resposta:**
```json
{
  "success": true,
  "message": "API key regenerada com sucesso",
  "data": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "api_key": "nova_api_key_gerada",
    "is_active": true
  }
}
```

## Exemplos de Uso

### JavaScript/Node.js
```javascript
// 1. Login
const loginResponse = await fetch('/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    password: 'senha123'
  })
});

const { data: { access_token, api_key } } = await loginResponse.json();

// 2. Usar API key para recursos
const userResponse = await fetch('/users/me', {
  headers: {
    'x-api-key': api_key
  }
});

// 3. Regenerar API key se necessário
const regenerateResponse = await fetch('/users/me/api-key', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

### cURL
```bash
# Login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "password": "senha123"}'

# Usar API key
curl -X GET http://localhost:3000/users/me \
  -H "x-api-key: sua_api_key_aqui"

# Regenerar API key
curl -X POST http://localhost:3000/users/me/api-key \
  -H "Authorization: Bearer seu_jwt_token_aqui"
```

## Segurança

### Validações Implementadas
- ✅ Autenticação JWT via Supabase Auth
- ✅ API keys únicas por usuário
- ✅ Verificação de usuário ativo
- ✅ Regeneração segura de API keys
- ✅ Recuperação de senha via email
- ✅ Logs de autenticação

### Boas Práticas
1. **Mantenha o JWT token seguro** - Use HTTPS em produção
2. **Regenere API keys regularmente** - Por segurança
3. **Use senhas fortes** - Para contas de usuário
4. **Monitore o uso** - Da API e tokens
5. **Faça logout** - Quando não estiver usando

## Configuração no Supabase

### Variáveis de Ambiente
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
FRONTEND_URL=http://localhost:3000
```

### Tabela `users`
A tabela `users` é criada automaticamente pelo trigger `handle_new_user()` quando um usuário se registra no Supabase Auth.

## Códigos de Erro

### 401 - Não Autorizado
```json
{
  "success": false,
  "message": "Token de autenticação é obrigatório",
  "error": "MISSING_TOKEN"
}
```

### 401 - Token Inválido
```json
{
  "success": false,
  "message": "Token inválido ou expirado",
  "error": "INVALID_TOKEN"
}
```

### 403 - Usuário Inativo
```json
{
  "success": false,
  "message": "Usuário inativo ou não encontrado",
  "error": "INACTIVE_USER"
}
```

## Suporte

Se você tiver problemas com autenticação:
1. Verifique se o email foi confirmado no Supabase
2. Confirme se o usuário está ativo na tabela `users`
3. Teste o login via Supabase Dashboard
4. Verifique os logs da aplicação
5. Use a recuperação de senha se necessário 