# 🚀 Guia de Inicialização Rápida - DrCal API (Sistema Open Source de Agendamento para Profissionais de Saúde)

## ⚡ Início Rápido (5 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp env.example .env
# Edite o arquivo .env com suas credenciais do Supabase
```

### 3. Configurar Supabase
- Execute o arquivo `supabase-setup.sql` no seu projeto Supabase
- Configure os webhooks conforme instruções no arquivo SQL

### 4. Iniciar Redis
```bash
# Com Docker
docker run -d -p 6379:6379 redis:7-alpine

# Ou instale Redis localmente
```

### 5. Executar a API
```bash
npm run dev
```

### 6. Obter API Key
- Crie uma conta no Supabase Auth
- A API key será gerada automaticamente
- Use o endpoint `/users/me` para obter sua API key

### 7. Testar
- Acesse: http://localhost:3000/docs
- Configure sua API key no Swagger UI
- Teste os endpoints usando a documentação Swagger

## 🐳 Docker (Recomendado)

### Iniciar com Docker Compose
```bash
docker-compose up -d
```

### Acessar serviços:
- **API**: http://localhost:3000
- **Documentação**: http://localhost:3000/docs
- **Redis Commander**: http://localhost:8081 (com profile monitoring)

## 📋 Checklist de Configuração

- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Supabase configurado (tabelas, views, funções)
- [ ] Webhooks configurados no Supabase
- [ ] Redis rodando
- [ ] API iniciada e respondendo
- [ ] Conta criada no Supabase Auth
- [ ] API key obtida e configurada
- [ ] Documentação Swagger acessível

## 🔧 Troubleshooting

### Erro de conexão com Supabase
- Verifique `SUPABASE_URL` e `SUPABASE_KEY` no `.env`
- Confirme se as tabelas foram criadas no Supabase

### Erro de conexão com Redis
- Verifique se o Redis está rodando na porta 6379
- Confirme as configurações no `.env`

### Erro de webhook
- Verifique se os webhooks estão configurados no Supabase
- Confirme se a URL está acessível publicamente

## 📞 Suporte

- 📚 Documentação completa: `README.md`
- 🗄️ Configuração Supabase: `supabase-setup.sql`
- 🧪 Exemplos de uso: `examples/api-tests.http` 