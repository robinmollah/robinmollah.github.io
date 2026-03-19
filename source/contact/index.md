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
  border-radius: 22px;
  border: 1px solid rgba(145, 107, 78, 0.16);
  background: linear-gradient(180deg, rgba(251, 244, 235, 0.96), rgba(239, 223, 205, 0.92));
  color: #342820 !important;
  box-shadow: 0 14px 34px rgba(82, 57, 36, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.45);
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  min-width: 200px;
  color: #342820 !important;
}
.contact-card:hover {
  background: linear-gradient(180deg, rgba(255, 248, 240, 0.98), rgba(241, 225, 207, 0.94));
  border-color: rgba(145, 107, 78, 0.3);
  transform: translateY(-8px);
  box-shadow: 0 18px 36px rgba(82, 57, 36, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.45);
  color: #2a1f18 !important;
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
  color: #2f241d;
}
.contact-value {
  font-size: 0.95em;
  color: #6f4a32;
  font-weight: 600;
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
