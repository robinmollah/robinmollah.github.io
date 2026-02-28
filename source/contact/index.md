---
title: Contact
date: 2026-02-28 12:26:00
type: "page"
---

<style>
.contact-container {
  text-align: center;
  margin-top: 50px;
}
.contact-intro {
  font-size: 1.2em;
  margin-bottom: 50px;
  line-height: 1.6;
}
.contact-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}
.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none !important;
  border-bottom: none !important;
  padding: 30px 20px;
  border-radius: 12px;
  background: rgba(128, 128, 128, 0.05);
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  min-width: 200px;
}
.contact-card:hover {
  background: rgba(128, 128, 128, 0.1);
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}
.contact-icon {
  font-size: 2em;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}
.contact-card:hover .contact-icon {
  transform: scale(1.1);
}
.contact-label {
  font-weight: 600;
  font-size: 1.2em;
}
.contact-value {
  font-size: 0.95em;
  opacity: 0.8;
  margin-top: 8px;
}
</style>

<div class="contact-container">
<p class="contact-intro">
Connect for serious conversation here!
</p>

<div class="contact-cards">
<a href="mailto:contact@robinmollah.com" class="contact-card">
<i class="fa fa-envelope contact-icon" style="color: #ea4335;"></i>
<span class="contact-label">Email</span>
<span class="contact-value">contact@robinmollah.com</span>
</a>

<a href="https://linkedin.com/in/robinmollah" target="_blank" rel="noopener" class="contact-card">
<i class="fab fa-linkedin contact-icon" style="color: #0077b5;"></i>
<span class="contact-label">LinkedIn</span>
<span class="contact-value">in/robinmollah</span>
</a>
</div>
</div>
