# Gestão de Profissionais de Saúde

Este módulo implementa a gestão completa de profissionais de saúde na API DrCal (sistema open source de agendamento para profissionais de saúde), permitindo criar, listar, buscar, atualizar e excluir profissionais associados aos usuários autenticados.

## 📋 Estrutura da Tabela

A tabela `public.professionals` possui os seguintes campos:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | ✅ | ID único (gerado automaticamente) |
| `name` | TEXT | ✅ | Nome do profissional |
| `specialty` | TEXT | ❌ | Especialidade médica |
| `slug` | TEXT | ✅ | Identificador amigável para URL (único) |
| `crm` | TEXT | ❌ | Registro do Conselho Regional de Medicina |
| `rqe` | TEXT | ❌ | Registro de Qualificação de Especialista |
| `img_url` | TEXT | ❌ | URL da imagem do profissional |
| `user_id` | UUID | ✅ | Vínculo com o usuário logado |
| `created_at` | TIMESTAMPTZ | ✅ | Data de criação (automático) |
| `updated_at` | TIMESTAMPTZ | ✅ | Data de atualização (automático) |

## 🔗 Rotas Disponíveis

### Autenticadas (requer API Key)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/professionals` | Criar novo profissional |
| `GET` | `/professionals` | Listar todos os profissionais do usuário |
| `GET` | `/professionals/:id` | Buscar profissional por ID |
| `GET` | `/professionals/slug/:slug` | Buscar profissional por slug (privado) |
| `PUT` | `/professionals/:id` | Atualizar profissional |
| `DELETE` | `/professionals/:id` | Excluir profissional |

### Públicas (sem autenticação)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/professionals/public/:slug` | Buscar profissional por slug (público) |

## 🔐 Autenticação

Todas as rotas autenticadas requerem o header `x-api-key` com a API key do usuário:

```http
x-api-key: sua-api-key-aqui
```

## 📝 Exemplos de Uso

### Criar Profissional

```http
POST /professionals
Content-Type: application/json
x-api-key: sua-api-key

{
  "name": "Dr. João Silva",
  "specialty": "Cardiologia",
  "slug": "dr-joao-silva",
  "crm": "12345-SP",
  "rqe": "67890",
  "img_url": "https://example.com/photo.jpg"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Profissional criado com sucesso",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Dr. João Silva",
    "specialty": "Cardiologia",
    "slug": "dr-joao-silva",
    "crm": "12345-SP",
    "rqe": "67890",
    "img_url": "https://example.com/photo.jpg",
    "user_id": "user-uuid-here",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

### Listar Profissionais

```http
GET /professionals
x-api-key: sua-api-key
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Profissionais listados com sucesso",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Dr. João Silva",
      "specialty": "Cardiologia",
      "slug": "dr-joao-silva",
      "crm": "12345-SP",
      "rqe": "67890",
      "img_url": "https://example.com/photo.jpg",
      "user_id": "user-uuid-here",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    }
  ],
  "count": 1
}
```

### Buscar por Slug (Público)

```http
GET /professionals/public/dr-joao-silva
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Profissional encontrado",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Dr. João Silva",
    "specialty": "Cardiologia",
    "slug": "dr-joao-silva",
    "crm": "12345-SP",
    "rqe": "67890",
    "img_url": "https://example.com/photo.jpg",
    "user_id": "user-uuid-here",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

## ⚠️ Tratamento de Erros

### Erro de Validação (400)
```json
{
  "success": false,
  "message": "Erro de validação",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "Nome e slug são obrigatórios"
  }
}
```

### Slug Duplicado (409)
```json
{
  "success": false,
  "message": "Erro de validação",
  "error": {
    "code": "DUPLICATE_SLUG",
    "details": "Slug já existe"
  }
}
```

### Profissional Não Encontrado (404)
```json
{
  "success": false,
  "message": "Profissional não encontrado",
  "error": {
    "code": "NOT_FOUND",
    "details": "Profissional não encontrado"
  }
}
```

### Não Autorizado (401)
```json
{
  "success": false,
  "message": "API key é obrigatória",
  "error": "MISSING_API_KEY"
}
```

## 🧪 Testes

Use o arquivo `examples/professionals-tests.http` para testar todas as funcionalidades:

1. Substitua `{{API_KEY}}` pela sua API key real
2. Substitua `{{PROFESSIONAL_ID}}` pelo ID retornado ao criar um profissional
3. Execute os testes na ordem para verificar todas as funcionalidades

## 📚 Documentação Swagger

Acesse a documentação interativa em:
```
http://localhost:3000/docs
```

## 🔧 Arquivos do Módulo

- **Service**: `src/services/professionalService.js`
- **Controller**: `src/controllers/professionalController.js`
- **Rotas**: `src/routes/professionals.js`
- **Documentação**: `src/docs/swagger.js` (schema adicionado)
- **Testes**: `examples/professionals-tests.http`

## 🚀 Funcionalidades Implementadas

✅ **CRUD Completo**
- Criar profissional
- Listar profissionais do usuário
- Buscar por ID
- Buscar por slug (privado e público)
- Atualizar profissional
- Excluir profissional

✅ **Validações**
- Campos obrigatórios (name, slug)
- Slug único por usuário
- Verificação de permissões (usuário só acessa seus profissionais)

✅ **Tratamento de Erros**
- Validação de dados
- Profissional não encontrado
- Slug duplicado
- Erros de autenticação

✅ **Documentação**
- Swagger completo
- Exemplos de uso
- Códigos de erro padronizados

✅ **Segurança**
- Autenticação via API key
- Isolamento por usuário
- Validação de permissões 