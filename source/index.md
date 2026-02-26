---
title: Robin Mollah
date: 2026-02-26 21:00:18
type: "page"
---

I am Robin Mollah, a Senior Software Engineer architecting and building scalable software systems across cloud, frontend, and AI. And probably some stories worth sharing.

## Extreme Constraint Engineering Challenges Solved

Delivered software under extreme hardware constraints

👉 **100KB web server on a 64MB RAM wifi router:** Built complex web servers with custom security layers and TCP tunneling inside tightly constrained Wi‑Fi router environments. ([Bonton Connect](https://bonton.app))

👉 **36MB game engine on 512MB RAM:** Engineered and optimized a LibGDX framework-based game engine and full open-world game to operate within strict memory and storage limits. Reworked asset management, minimized runtime footprint, streamlined execution paths, and restructured architecture for stability under hard caps. ([71: Hit & Run](https://apkpure.com/71-hit-run/net.properbd.hitnrun))

👉 **Single digit(<=9ms) real-time streaming:** Engineered and optimized a real-time streaming system to operate under controlled environment. ([Eagle 3D Streaming](https://eagle3dstreaming.com/))

<style>
details[open] summary ~ * {
  animation: detailsFadeIn 0.8s ease-in-out forwards;
}
@keyframes detailsFadeIn {
  0%    { opacity: 0; }
  100%  { opacity: 1; }
}
.details-fade-out summary ~ * {
  animation: detailsFadeOut 0.8s ease-in-out forwards !important;
}
@keyframes detailsFadeOut {
  0%    { opacity: 1; }
  100%  { opacity: 0; }
}
</style>
<details id="more-challenges-details">
<summary class="btn" style="margin: 15px auto; display: block; width: fit-content; cursor: pointer;">Show More Challenges...</summary>
<div style="margin-top: 15px;">

👉 **100GB+ high-speed file uploads:** Optimized end-to-end throughput for massive payloads by engineering across browser limitations, network constraints, and cloud I/O. ([Eagle 3D Streaming](https://eagle3dstreaming.com/))

👉 **Custom internet protocol & binary‑level TCP optimization:** Designed and implemented a custom webserver communication protocol enabling real-time device-to-device communication applying low-level TCP and binary payload optimizations.

👉 **Custom web server protocol:** Built a custom webserver protocol for real-time communication between devices through several proxies and binary level optimisations on TCP protocol. ([Bonton Connect](https://bonton.app))

</div>
</details>



## Experience

### SaaS Platforms & High-Traffic APIs

Designed and delivered SaaS platforms and backend systems serving millions of requests per day. Owned architecture decisions, technology selection, database design, deployment strategy, and operational monitoring. Onboarding, mentoring and managing engineers

Organizations: [Eagle 3D Streaming](https://eagle3dstreaming.com/) & [Freedom2Hear](https://freedom2hear.com)
Main Tech Stack: Python(FastAPI), MongoDB, PostGres, Kubernetes, Terraform, Redis, Kafka

---

### Data Pipelines at Scale


Designed and implemented data pipelines processing TB-scale datasets in production environments. Ensured throughput, fault tolerance, and long-term maintainability under real operational load. Ran complex analytics on scale with minimum cost.
Organizations: [Freedom2Hear](https://freedom2hear.com)<br>
Main techstack: Snowflake, Airflow, Python, MongoDB, PostGres, AWS, GCP

---

### Cloud Infrastructure & Reliability

Architected and deployed cloud-native infrastructure from scratch, including CI/CD pipelines, containerization, monitoring, and autoscaling strategies. Resolved scaling failures, stabilized production environments under load, and reduced infrastructure cost exposure through architectural redesign and optimization.

Organizations: [Eagle 3D Streaming](https://eagle3dstreaming.com/) & [Freedom2Hear](https://freedom2hear.com)
Main techstack: AWS, GCP, Docker, Kubernetes, Terraform and various cloud services.

---







<!-- 
---

## Engineering Challenges Solved

- Eliminated performance bottlenecks in high-traffic services  
- Stabilized systems during scaling failures under production load  
- Reduced cloud infrastructure cost through architectural redesign  
- Rewrote legacy systems into scalable cloud-native architectures  
- Mitigated AI latency issues in live environments  

---

## Writing

I occasionally document engineering decisions, system design lessons, cloud architecture practices, and practical AI integration challenges.

[View Articles](/archives/) -->

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const details = document.getElementById('more-challenges-details');
    const summary = details.querySelector('summary');

    summary.addEventListener('click', function(e) {
      if (details.open) {
        e.preventDefault();
        details.classList.add('details-fade-out');
        summary.innerText = "Show More Challenges...";
        
        setTimeout(function() {
          details.removeAttribute('open');
          details.classList.remove('details-fade-out');
        }, 800);
      } else {
        summary.innerText = "Collapse challenges";
      }
    });
  });
</script>
