# Docker Setup for DrCal API

## 🐳 Docker Configuration

The DrCal API (open source scheduling system for healthcare professionals) is configured to run in a Docker environment with Redis (no authentication), ideal for production.

## 📋 Prerequisites

- Docker
- Docker Compose
- Configured `.env` file

## 🚀 Getting Started

### 1. Configure Environment Variables

Copy the example file and configure:

```bash
cp env.example .env
```

Edit the `.env` file with your settings:

```env
# =====================================================
# SUPABASE CONFIGURATION (REQUIRED)
# =====================================================
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# =====================================================
# REDIS CONFIGURATION (REQUIRED)
# =====================================================
# Redis host (in Docker: use 'redis')
REDIS_HOST=redis

# Redis port (default: 6379)
REDIS_PORT=6379

# =====================================================
# SERVER CONFIGURATION
# =====================================================
PORT=3000
NODE_ENV=production
```

### 2. Start Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
```

### 3. Check Functionality

```bash
# API health check
curl http://localhost:3000/health

# Redis health check
docker-compose exec redis redis-cli ping

# View logs
docker-compose logs api
```

## 🛠️ Available Services

### API (Port 3000)
- **URL:** http://localhost:3000
- **Documentation:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/health

### Redis (Port 6379)
- **Configuration:** No authentication
- **Persistence:** AOF enabled
- **Volume:** `redis_data`

### Redis Commander (Port 8081) - Optional
- **URL:** http://localhost:8081
- **Profile:** `monitoring`
- **Usage:** Web interface to manage Redis

## 📝 Useful Commands

### Development
```bash
# Start with logs
docker-compose up

# Rebuild image
docker-compose build

# Stop services
docker-compose down
```

### Production
```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f api

# Restart API
docker-compose restart api

# Stop and remove volumes
docker-compose down -v
```

### Monitoring
```bash
# Start with Redis Commander
docker-compose --profile monitoring up -d

# Check resource usage
docker stats

# Access API container
docker-compose exec api sh
```

## 🔍 Troubleshooting

### API does not start
```bash
# View logs
docker-compose logs api

# Check if Redis is running
docker-compose exec redis redis-cli ping

# Restart services
docker-compose restart
```

### Redis does not connect
```bash
# Check if Redis is running
docker-compose ps redis

# View Redis logs
docker-compose logs redis

# Test manual connection
docker-compose exec redis redis-cli ping
```

### Network issues
```bash
# List Docker networks
docker network ls

# Inspect network
docker network inspect drcal_drcal-network
```

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Swagger Documentation
```bash
# Open in browser
open http://localhost:3000/docs
```

### 3. Test Professionals
```bash
# List professionals (requires API key)
curl -H "x-api-key: your-api-key" \
  http://localhost:3000/professionals
```

### 4. Check Redis
```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# List keys
KEYS *

# Check BullMQ queues
KEYS bull:*
```

## 📈 Monitoring

### Redis Commander
```bash
# Start with monitoring
docker-compose --profile monitoring up -d

# Access interface
open http://localhost:8081
```

### Logs
```bash
# API logs
docker-compose logs -f api

# Redis logs
docker-compose logs -f redis

# All logs
docker-compose logs -f
```

## 🔒 Security

### In Production
1. **Network:** Use isolated Docker network
2. **Ports:** Expose only necessary ports
3. **Volumes:** Use named volumes
4. **Logs:** Set up log rotation
5. **Backup:** Set up Redis backup

### Recommended Settings
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

### 1. Build the Image
```bash
docker-compose build
```

### 2. Start Production
```bash
docker-compose -f docker-compose.yml up -d
```

### 3. Check Status
```bash
docker-compose ps
curl http://localhost:3000/health
```

## 📝 Important Notes

1. **Redis without authentication:** Configured for isolated Docker environment
2. **Persistence:** Redis data is persisted in a volume
3. **Networking:** Services communicate via internal Docker network
4. **Health Checks:** Configured for automatic monitoring
5. **Logs:** Centralized and rotated

## 🆘 Support

If you have issues:

1. Check logs: `docker-compose logs`
2. Check status: `docker-compose ps`
3. Check network: `docker network ls`
4. Restart services: `docker-compose restart` 