/**
 * Compliance Enforcement - WhatsApp Widget
 * Embed this file in your WordPress <head> or footer:
 * <script src="https://complianceenforcement.app/whatsapp-widget.js" defer></script>
 */

(function() {
    // Prevent multiple initializations
    if (window.ComplianceWhatsAppWidgetInitialized) return;
    window.ComplianceWhatsAppWidgetInitialized = true;
  
    // Config
    const WHATSAPP_NUMBER = '5512996590801';
    const API_URL = 'https://compliance-sigma.vercel.app/api/leads'; // Replace/ensure this matches the prod url
  
    // Parse URL to inject base domain dynamically if script is hosted on the same API domain
    const scriptTag = document.currentScript;
    let baseUrl = 'https://compliance-sigma.vercel.app';
    if (scriptTag && scriptTag.src) {
        try {
            const url = new URL(scriptTag.src);
            baseUrl = url.origin;
        } catch(e) {}
    }
    const finalApiUrl = `${baseUrl}/api/leads`;
  
    // Inject Styles
    const style = document.createElement('style');
    style.innerHTML = `
      .cce-wa-widget-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        background-color: #25D366;
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.3);
        cursor: pointer;
        transition: transform 0.3s ease, background-color 0.3s ease;
        animation: cce-bounce 2s infinite;
        border: none;
      }
      .cce-wa-widget-btn:hover {
        transform: scale(1.1);
        background-color: #128C7E;
      }
      .cce-wa-widget-btn svg {
        width: 28px;
        height: 28px;
      }
      
      .cce-wa-popup {
        position: fixed;
        bottom: 100px;
        right: 24px;
        z-index: 999999;
        width: 320px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        font-family: system-ui, -apple-system, sans-serif;
        display: none;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        border: 1px solid #f1f5f9;
      }
      .cce-wa-popup.cce-open {
        display: block;
        opacity: 1;
        transform: translateY(0);
      }
      
      .cce-wa-header {
        background-color: #128C7E;
        padding: 12px 16px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .cce-wa-header-brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .cce-wa-header-icon {
        width: 40px;
        height: 40px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cce-wa-header-icon svg {
        width: 20px;
        height: 20px;
      }
      .cce-wa-header-text h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
      }
      .cce-wa-header-text p {
        margin: 0;
        font-size: 12px;
        color: #dcfce7;
      }
      .cce-wa-close {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
      }
      .cce-wa-close:hover {
        background: rgba(255,255,255,0.2);
      }
      
      .cce-wa-body {
        padding: 20px;
        background: #f8fafc;
      }
      .cce-wa-body p {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 14px;
        color: #475569;
        font-weight: 500;
        line-height: 1.4;
      }
      .cce-wa-input {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        background: white;
        color: #111827;
      }
      .cce-wa-input:focus {
        border-color: #25D366;
        box-shadow: 0 0 0 3px rgba(37,211,102,0.2);
      }
      .cce-wa-submit {
        width: 100%;
        padding: 12px;
        background: #25D366;
        color: white;
        border: none;
        border-radius: 24px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
        transition: background 0.2s, transform 0.1s;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
      }
      .cce-wa-submit:hover {
        background: #128C7E;
      }
      .cce-wa-submit:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      
      @keyframes cce-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10%); }
      }
    `;
    document.head.appendChild(style);
  
    // HTML Structure
    const container = document.createElement('div');
    container.innerHTML = `
      <div id="cce-wa-popup" class="cce-wa-popup">
        <div class="cce-wa-header">
          <div class="cce-wa-header-brand">
            <div class="cce-wa-header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div class="cce-wa-header-text">
              <h4>Fale Conosco</h4>
              <p>Respondemos rapidinho!</p>
            </div>
          </div>
          <button id="cce-wa-close" class="cce-wa-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="cce-wa-body">
          <p>Preencha os dados abaixo para iniciar a conversa no WhatsApp.</p>
          <form id="cce-wa-form">
            <input type="text" id="cce-wa-name" class="cce-wa-input" placeholder="Seu Nome" required>
            <input type="text" inputmode="numeric" id="cce-wa-phone" class="cce-wa-input" placeholder="WhatsApp (com DDD)" required>
            <input type="text" id="cce-wa-company" class="cce-wa-input" placeholder="Nome da Empresa (Opcional)">
            <button type="submit" id="cce-wa-submit" class="cce-wa-submit">
              Iniciar Conversa
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
  
      <button id="cce-wa-btn" class="cce-wa-widget-btn" aria-label="Abrir WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </button>
    `;
    document.body.appendChild(container);
  
    // Elements logic
    const btn = document.getElementById('cce-wa-btn');
    const popup = document.getElementById('cce-wa-popup');
    const closeBtn = document.getElementById('cce-wa-close');
    const form = document.getElementById('cce-wa-form');
    const phoneInput = document.getElementById('cce-wa-phone');
    const submitBtn = document.getElementById('cce-wa-submit');
  
    // Toggle popup
    btn.addEventListener('click', () => {
      popup.classList.add('cce-open');
      btn.style.display = 'none';
      setTimeout(() => document.getElementById('cce-wa-name').focus(), 100);
    });
  
    closeBtn.addEventListener('click', () => {
      popup.classList.remove('cce-open');
      setTimeout(() => btn.style.display = 'flex', 300);
    });
  
    // Phone mask
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length > 0) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      }
      e.target.value = value;
    });
  
    // Submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('cce-wa-name').value;
      const phone = phoneInput.value;
      const company = document.getElementById('cce-wa-company').value;
      const rawPhone = phone.replace(/\D/g, '');
  
      if (!name || rawPhone.length < 10) return;
  
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Conectando...';
  
      try {
        // Send lead to backend API
        await fetch(finalApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone: rawPhone,
            company,
            status: 'new',
            tags: ['whatsapp-widget']
          })
        });
      } catch (err) {
        console.error('Widget sync error:', err);
      }
  
      // Redirect
      const firstName = name.split(' ')[0];
      const text = encodeURIComponent(`Olá, me chamo ${firstName}! Vim pelo site e gostaria de tirar uma dúvida.`);
      
      // Attempt to open WhatsApp
      try {
        window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
      } catch(e) {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
      }
      
      // Reset after redirect trigger
      setTimeout(() => {
        popup.classList.remove('cce-open');
        btn.style.display = 'flex';
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Iniciar Conversa <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
      }, 1000);
      submitBtn.innerHTML = 'Iniciar Conversa <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    });
  })();
