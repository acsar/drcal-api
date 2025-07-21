# 🚀 Quickstart Guide - DrCal API (Open Source Scheduling System for Healthcare Professionals)

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp env.example .env
# Edit the .env file with your Supabase credentials
```

### 3. Set Up Supabase
- Run the `supabase-setup.sql` file in your Supabase project
- Set up webhooks as instructed in the SQL file

### 4. Start Redis
```bash
# With Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or install Redis locally
```

### 5. Run the API
```bash
npm run dev
```

### 6. Get Your API Key
- Create an account in Supabase Auth
- The API key will be generated automatically
- Use the `/users/me` endpoint to get your API key

### 7. Test
- Access: http://localhost:3000/docs
- Set your API key in Swagger UI
- Test endpoints using the Swagger documentation

## 🐳 Docker (Recommended)

### Start with Docker Compose
```bash
docker-compose up -d
```

### Access services:
- **API**: http://localhost:3000
- **Documentation**: http://localhost:3000/docs
- **Redis Commander**: http://localhost:8081 (with monitoring profile)

## 📋 Setup Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Supabase set up (tables, views, functions)
- [ ] Webhooks set up in Supabase
- [ ] Redis running
- [ ] API started and responding
- [ ] Account created in Supabase Auth
- [ ] API key obtained and configured
- [ ] Swagger documentation accessible

## 🛠️ Troubleshooting

### Supabase connection error
- Check `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Make sure tables were created in Supabase

### Redis connection error
- Check if Redis is running on port 6379
- Confirm settings in `.env`

### Webhook error
- Check if webhooks are set up in Supabase
- Confirm the URL is publicly accessible

## 📞 Support

- 📚 Full documentation: `README.md`
- 📝 Supabase setup: `supabase-setup.sql`
- 🧪 Usage examples: `examples/api-tests.http` 