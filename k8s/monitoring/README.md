# Monitoring Setup with Prometheus and Grafana

This directory contains Kubernetes manifests for deploying Prometheus and Grafana to monitor the MERN application.

## Prerequisites

- Kubernetes cluster (Minikube, Kind, or cloud provider)
- kubectl configured to access your cluster
- Sufficient resources (at least 2GB RAM recommended)

## Deployment Steps

### 1. Deploy Prometheus

```bash
# Apply Prometheus configuration
kubectl apply -f prometheus-configmap.yaml

# Deploy Prometheus
kubectl apply -f prometheus-deployment.yaml

# Create Prometheus service
kubectl apply -f prometheus-service.yaml
```

### 2. Deploy Grafana

```bash
# Create Grafana secrets (change password in production!)
kubectl apply -f grafana-secrets.yaml

# Create Grafana datasources configuration
kubectl apply -f grafana-datasources.yaml

# Create Grafana dashboards configuration
kubectl apply -f grafana-dashboards.yaml

# Deploy Grafana
kubectl apply -f grafana-deployment.yaml

# Create Grafana service
kubectl apply -f grafana-service.yaml
```

### 3. Access the Services

#### Port Forward Prometheus

```bash
kubectl port-forward -n mern-app svc/prometheus-service 9090:9090
```

Access Prometheus at: http://localhost:9090

#### Port Forward Grafana

```bash
kubectl port-forward -n mern-app svc/grafana-service 3000:3000
```

Access Grafana at: http://localhost:3000
- Username: `admin`
- Password: `admin123` (change in production!)

## Adding Metrics to Backend

To expose metrics from your backend application, you can use the `prom-client` library:

```bash
npm install prom-client
```

Then add metrics endpoint to your backend:

```javascript
const promClient = require('prom-client');

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);

// Add metrics endpoint
app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Middleware to track requests
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe(
      { method: req.method, route: req.route?.path || req.path, status_code: res.statusCode },
      duration
    );
    httpRequestTotal.inc({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  
  next();
});
```

## Grafana Dashboard Setup

### 1. Import Pre-built Dashboards

Grafana provides several pre-built dashboards:
- Node Exporter Full: ID `1860`
- Kubernetes Cluster Monitoring: ID `7249`
- Kubernetes Pod Monitoring: ID `6417`

### 2. Create Custom Dashboard

1. Go to Grafana → Dashboards → New Dashboard
2. Add panels for:
   - HTTP Request Rate
   - HTTP Request Duration
   - Error Rate
   - Active Connections
   - Memory Usage
   - CPU Usage

### 3. Example Queries

- **Request Rate**: `rate(http_requests_total[5m])`
- **Request Duration (95th percentile)**: `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))`
- **Error Rate**: `rate(http_requests_total{status_code=~"5.."}[5m])`

## Troubleshooting

### Prometheus not scraping metrics

1. Check Prometheus targets: http://localhost:9090/targets
2. Verify service discovery is working
3. Check pod annotations: `prometheus.io/scrape: "true"`

### Grafana cannot connect to Prometheus

1. Verify Prometheus service is running: `kubectl get svc -n mern-app prometheus-service`
2. Check Grafana datasource configuration
3. Verify network policies allow communication

## Production Recommendations

1. **Change default passwords** in `grafana-secrets.yaml`
2. **Enable TLS** for Prometheus and Grafana
3. **Set up alerting** with Alertmanager
4. **Configure persistent storage** with appropriate storage classes
5. **Set resource limits** based on your cluster capacity
6. **Enable authentication** for Grafana
7. **Set up backup** for Grafana dashboards and Prometheus data
