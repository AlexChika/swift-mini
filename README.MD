# 💬 Chat App — Architecture Decisions

This chat application is a **portfolio project** with **production-grade implementation**, but running on **free-tier infrastructure**.
The idea: keep it **cheap to run** but **easy to scale later**.

---

## ⚙️ Current Setup (Portfolio Stage)

- **Hosting** → Render free instance (single region, no horizontal scaling)
- **Database** → MongoDB Atlas (Shared Free Cluster)
- **Cache Layer** → Local in-memory cache (`Map`)
  - Demonstrates caching logic
  - Abstracted so Redis can replace it with no major refactor
- **Real-time** → Socket.IO (WebSocket-based)
- **Security** →
  - Input sanitization
  - Schema validation
  - Auth middleware
  - Basic rate limiting

---

## 🚀 Production Principles Applied

- **Database Indexes** → Queries optimized with proper indexes
- **Caching Layer Abstraction** → Local `Map` now, Redis later
- **Regional Latency Awareness** → DB + app colocated when scaling
- **Stateless App** → Prepared for multiple instances

---

## 🔮 Upgrade Path

- **Hosting** from Render Free to → AWS EC2 / Fly.io (autoscaling infra)
- **Database** from Atlas Free to → Dedicated M10 cluster (more resources, higher IOPS)
- **Cache** from Local Map to → Redis (managed or self-hosted)
- **Monitoring** → Prometheus / Grafana or SaaS monitoring
- **Async Workloads** → RabbitMQ, Kafka, or AWS SQS

---

## 🎯 Rationale

- Free-tier infra → **portfolio-grade deployment**
- Modular architecture → **production-ready with upgrades**
- Separation of concerns → swap infra **without code rewrite**
