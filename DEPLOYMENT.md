# Deployment Guide - Production Deployment

Complete guide for deploying the ATS Resume Analyzer to production environments.

## Deployment Options

### Option 1: Docker Compose (Recommended for Small-Medium Scale)

#### Prerequisites
- Docker and Docker Compose installed
- MongoDB Atlas account (cloud) OR MongoDB instance

#### Steps

1. **Prepare production .env files**

Backend `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ats-resume-scorer?retryWrites=true&w=majority
ML_SERVICE_URL=http://ml-service:8000
NODE_ENV=production
```

2. **Build and run**
```bash
docker-compose -f docker-compose.yml up -d
```

3. **Verify services**
```bash
docker ps
docker logs ats-ml-service
docker logs ats-backend
```

### Option 2: Cloud Platforms

#### AWS (Recommended)

**Architecture**: ECS + ALB + RDS + S3

1. **ML Service (ECR + ECS)**
```bash
# Push to ECR
aws ecr create-repository --repository-name ats-ml-service
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker build -t ats-ml-service ml_service/
docker tag ats-ml-service <account>.dkr.ecr.<region>.amazonaws.com/ats-ml-service:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/ats-ml-service:latest

# Create ECS task definition
# Run on ECS cluster with load balancer
```

2. **Backend (Node.js)**
```bash
# Similar to ML service
# OR use Elastic Beanstalk for simpler deployment
eb create ats-backend --instance-type t3.micro
```

3. **Frontend (S3 + CloudFront)**
```bash
# Build
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://ats-resume-scorer-frontend/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

#### Azure (Alternative)

1. **ML Service (Container Instances)**
```bash
az container create \
  --resource-group ats-rg \
  --name ats-ml-service \
  --image <registry>.azurecr.io/ats-ml-service:latest \
  --ports 8000
```

2. **Backend (App Service)**
```bash
az webapp create \
  --resource-group ats-rg \
  --plan ats-app-service-plan \
  --name ats-backend
```

3. **Frontend (Static Web App)**
```bash
az staticwebapp create \
  --name ats-frontend \
  --resource-group ats-rg \
  --source ./frontend/dist
```

#### Heroku (Quick Deployment)

1. **Create apps**
```bash
heroku create ats-ml-service
heroku create ats-backend
heroku create ats-frontend
```

2. **Deploy ML Service**
```bash
cd ml_service
heroku git:remote -a ats-ml-service
git push heroku main
heroku config:set ML_SERVICE_PORT=8000
```

3. **Deploy Backend**
```bash
cd ../backend
heroku create ats-backend
heroku addons:create mongolab
git push heroku main
```

4. **Deploy Frontend**
```bash
cd ../frontend
npm run build
# Use Netlify or Vercel for easy React deployment
```

### Option 3: Kubernetes (Enterprise Scale)

#### Setup

1. **Create cluster**
```bash
# GKE
gcloud container clusters create ats-cluster

# AKS
az aks create --resource-group <rg> --name ats-cluster

# EKS
eksctl create cluster --name ats-cluster
```

2. **Create namespace**
```bash
kubectl create namespace ats
```

3. **Configure MongoDB**
```bash
kubectl create secret generic mongo-secret \
  --from-literal=connection-string='mongodb://...' \
  -n ats
```

4. **Deploy services**
```bash
# ML Service
kubectl apply -f ml-service-deployment.yaml -n ats

# Backend
kubectl apply -f backend-deployment.yaml -n ats

# Frontend
kubectl apply -f frontend-deployment.yaml -n ats
```

## Environment Configuration for Production

### ML Service
```
ML_SERVICE_PORT=8000
ML_SERVICE_RELOAD=false  # Always false in production
WORKERS=4  # Number of uvicorn workers
```

### Backend
```
PORT=5000
NODE_ENV=production
MONGODB_URI=<production-mongodb-uri>
ML_SERVICE_URL=<ml-service-url>
JWT_SECRET=<secure-random-string>
CORS_ORIGIN=<frontend-domain>
```

### Frontend
```
VITE_API_URL=<backend-api-url>
```

## Security Best Practices

### API Security
1. **Use HTTPS/TLS**
   - Get SSL certificate (Let's Encrypt or AWS Certificate Manager)
   - Enforce HTTPS redirects
   - Use HSTS headers

2. **CORS Configuration**
```javascript
// In backend
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST'],
  maxAge: 3600
};
app.use(cors(corsOptions));
```

3. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per minute
});
app.use(limiter);
```

4. **Input Validation**
   - Validate all file uploads
   - Sanitize file names
   - Check file size limits
   - Verify file types

### Database Security
1. Use MongoDB connection string with authentication
2. Enable IP whitelist in MongoDB Atlas
3. Use strong passwords
4. Enable database-level encryption
5. Regular backups

### Secrets Management
1. Use environment variables (never commit secrets)
2. Use AWS Secrets Manager or Azure Key Vault
3. Rotate secrets regularly
4. Use different credentials for each environment

### File Upload Security
```python
# In ML service
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

# Validate before processing
if file_size > MAX_FILE_SIZE:
    raise ValueError("File too large")
if file_extension not in ALLOWED_EXTENSIONS:
    raise ValueError("Invalid file type")
```

## Performance Optimization

### Caching
```javascript
// Redis caching for frequent analyses
const redis = require('redis');
const client = redis.createClient();

app.post('/api/analyze/resume', async (req, res) => {
  const cacheKey = generateKey(resume, jobDescription);
  
  // Check cache first
  const cached = await client.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  
  // Process and cache
  const result = await analyzeResume(resume, jobDescription);
  await client.setEx(cacheKey, 3600, JSON.stringify(result));
  res.json(result);
});
```

### Load Balancing
```nginx
upstream backend {
  server backend1:5000;
  server backend2:5000;
  server backend3:5000;
}

server {
  listen 80;
  server_name api.example.com;
  
  location / {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### Database Optimization
1. Index frequently queried fields
2. Use pagination for large datasets
3. Archive old data
4. Monitor query performance

### Frontend Optimization
```bash
# Build with optimizations
npm run build

# Components will be code-split by React Router
# CSS is minified by Tailwind
# JS is minified by Vite
```

## Monitoring & Logging

### Application Monitoring
```python
# FastAPI
from prometheus_client import Counter
request_count = Counter('requests_total', 'Total requests')

@app.post("/analyze")
def analyze():
    request_count.inc()
    # ... rest of code
```

### Log Management
```bash
# Use cloud logging services
# AWS CloudWatch
# Google Cloud Logging
# Datadog
# New Relic

# Example: CloudWatch
import watchtower
logger = logging.getLogger('ats')
logger.addHandler(watchtower.CloudWatchLogHandler())
```

### Health Checks
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    mongodb: mongoConnected ? 'connected' : 'disconnected'
  });
});
```

## Scaling Strategy

### Vertical Scaling
```yaml
# Increase resources in docker-compose
services:
  ml-service:
    # Increase CPU/Memory limits
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

### Horizontal Scaling
```yaml
# Run multiple instances with load balancer
services:
  ml-service-1:
    image: ats-ml-service
  ml-service-2:
    image: ats-ml-service
  ml-service-3:
    image: ats-ml-service
  
  load-balancer:
    image: nginx
    ports:
      - "8000:8000"
```

## Disaster Recovery

### Backup Strategy
1. **Database Backups**
   - Daily automated backups
   - Store in different regions
   - Test restore procedures

2. **File Storage**
   - Use cloud storage (S3, Azure Blob)
   - Enable versioning
   - Cross-region replication

### Recovery Plan
1. Document RTO (Recovery Time Objective)
2. Document RPO (Recovery Point Objective)
3. Test failover procedures monthly
4. Maintain failover infrastructure

## Cost Optimization

### Recommendations
1. Use spot instances for non-critical workloads
2. Auto-scale services based on demand
3. Use reserved instances for baseline capacity
4. Monitor and optimize database queries
5. Store older data in cheaper storage tiers

### Cost Monitoring
```bash
# AWS
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31

# Azure
az costmanagement query --scope /subscriptions/...

# GCP
gcloud billing accounts list
```

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build ML Service
        run: |
          docker build -t ats-ml-service ml_service/
          docker push <registry>/ats-ml-service:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/ml-service \
            ml-service=<registry>/ats-ml-service:${{ github.sha }}
```

## Post-Deployment Checklist

- [ ] HTTPS/SSL configured
- [ ] Database backups enabled
- [ ] Monitoring and alerts set up
- [ ] Log aggregation configured
- [ ] Secrets securely managed
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Health checks working
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Rollback plan documented
- [ ] Performance baseline established
- [ ] Security audit completed

## Support & Troubleshooting

### Common Issues

**Services can't communicate**
- Check network/VPC configuration
- Verify service discovery DNS
- Check firewall rules

**High latency**
- Monitor database performance
- Check network bandwidth
- Review code for bottlenecks
- Increase resources if needed

**Memory leaks**
- Monitor memory usage
- Check for event listener cleanup
- Review third-party library updates

### Getting Help
- Check service logs: `docker logs <service>`
- Monitor dashboard: CloudWatch, DataDog, New Relic
- Run performance profiling
- Review recent code changes

---

**Deployment Ready!** 🚀

For questions, refer to cloud provider documentation or create an issue on GitHub.
