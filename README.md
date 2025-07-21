# DrCal API - Open Source Scheduling System for Healthcare Professionals

## 📄 Description

Complete backend API for an open source scheduling system for healthcare professionals with asynchronous queues, Supabase integration, and Swagger documentation.

## 🚀 Technologies

- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **Supabase** - Database and Authentication
- **BullMQ** - Queue system with Redis
- **Swagger** - API Documentation
- **Docker** - Containerization
- **Redis** - Cache and queues

## 📁 Project Structure

```
src/
├── config/
│   ├── supabase.js      # Supabase client configuration
│   └── redis.js         # Redis configuration
├── controllers/
│   ├── appointmentController.js  # Appointments controller
│   └── webhookController.js      # Webhooks controller
├── routes/
│   ├── appointments.js   # Appointments routes
│   └── webhooks.js       # Webhooks routes
├── services/
│   └── appointmentService.js     # Business logic
├── queues/
│   └── appointmentsQueue.js      # BullMQ queue configuration
├── jobs/
│   └── appointmentWorker.js      # Worker for processing
├── docs/
│   └── swagger.js        # Swagger configuration
├── utils/
│   └── logger.js         # Logging utility
└── index.js              # Application entry point
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- Redis
- Supabase account

### 1. Clone the repository

```bash
git clone <repository-url>
cd drcal-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and set your variables:

```bash
cp env.example .env
```

Edit the `.env` file with your settings:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Set up Supabase

Create the following tables in your Supabase project (see `supabase-setup.sql`):

### 5. Run the application

#### Development
```bash
npm run dev
```

#### Production
```bash
npm start
```

## 🐳 Docker

### Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Run with monitoring (includes Redis Commander)

```bash
docker-compose --profile monitoring up -d
```

## 📚 API Documentation

Swagger documentation is available at:
- **Development**: http://localhost:3000/docs
- **Production**: http://your-domain/docs

## 🔌 Endpoints

### Authentication

The API uses API Key authentication. Include the `x-api-key` header in all requests:

```bash
x-api-key: your_api_key_here
```

### Appointments

- `POST /appointments` - Create appointment (requires authentication)
- `GET /appointments/available` - Get available slots (authentication optional)
- `POST /appointments/waitlist` - Add to waitlist (requires authentication)
- `GET /appointments/waitlist` - List waitlist (requires authentication)
- `GET /appointments/queue/stats` - Queue statistics (requires authentication)

### Users

- `GET /users/me` - Get current user info
- `POST /users/me/api-key` - Regenerate API key
- `PUT /users/me/status` - Update user status
- `GET /users` - List all users (Admin)
- `GET /users/{userId}` - Get specific user (Admin)
- `PUT /users/{userId}/status` - Update user status (Admin)
- `DELETE /users/{userId}` - Delete user (Admin)

### Webhooks

- `POST /webhooks/supabase` - Supabase webhook

### System

- `GET /` - API info
- `GET /health` - Health check
- `GET /docs` - Swagger documentation

## 🔄 Queue System

The system uses BullMQ with Redis for asynchronous processing:

### Job Types

1. **process-appointment** - Processes appointments with advisory lock
2. **send-notification** - Sends notifications

### Monitoring

- **Redis Commander**: http://localhost:8081 (when using monitoring profile)
- **Statistics**: `GET /appointments/queue/stats`

## 🔧 Webhook Configuration

Set up webhooks in Supabase for the following tables:
- `appointments` (INSERT, UPDATE, DELETE)
- `waitlist` (INSERT)
- `auth.users` (INSERT) - For automatic user creation

Webhook URL: `http://your-domain/webhooks/supabase`

## 🔑 How to Get Your API Key

1. **Create an account in Supabase Auth** (if you don't have one)
2. **The API key will be generated automatically** when you register
3. **Access your API key** via the `/users/me` endpoint (after first login)
4. **Use the API key** in the `x-api-key` header in all requests

### Usage example:
```bash
curl -H "x-api-key: your_api_key_here" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3000/appointments \
     -d '{"patient_name": "John Smith", ...}'
```

## 🚀 Deploy

### Production Environment Variables

```env
NODE_ENV=production
SUPABASE_URL=your_production_url
SUPABASE_KEY=your_production_key
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
PORT=3000
```

### Docker Production

```bash
# Build production image
docker build -t drcal-api .

# Run container
docker run -d \
  --name drcal-api \
  -p 3000:3000 \
  --env-file .env \
  drcal-api
```

## 📝 Logs

The application uses structured logging:
- **Development**: Colored logs in the console
- **Production**: JSON formatted logs

## 🔒 Security

- Helmet.js for security headers
- CORS configured
- Input validation
- Non-root user in Docker
- Advisory locks for safe processing

## 🤝 Contribution

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under **AGPLv3**.

This means you can use, modify, and redistribute the system freely, as long as you keep this license and publish modifications if running as a service.

### ❗ Commercial License

If you want to use this system **without disclosing the source code of your modifications**, we offer a **commercial license**.

**Contact us:** comercial@caresys.com.br

### 📋 What AGPLv3 allows:

✅ **Use** the software freely  
✅ **Modify** the source code  
✅ **Redistribute** the software  
✅ **Use commercially**  

### ⚠️ What AGPLv3 requires:

🔒 **Keep the AGPLv3 license**  
🔒 **Make the source code** of modifications available  
🔒 **License modifications** under AGPLv3  
🔒 **Inform users** about their rights  

### 🏢 For Companies:

If you are a company and need to:
- Keep modifications private
- Use without disclosing source code
- Commercial support
- Permissive license

**Consider our commercial license** - contact: comercial@caresys.com.br

## 📝 Applying the License to New Files

When adding new files to the project, include the following header:

```javascript
/**
 * DrCal API - Open Source Scheduling System for Healthcare Professionals
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

See the `LICENSE_HEADER.txt` file for the full text.

## 🆘 Support

For support, email contato@drcal.com or open an issue in the repository. 