const CONFIG_KEY = 'bajaj_whatsapp_config';

export const getWhatsAppConfig = () => {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : {
      phone: '',
      apiKey: '',
      gateway: 'direct' // 'direct' (wa.me) or 'callmebot' or 'twilio'
    };
  } catch {
    return { phone: '', apiKey: '', gateway: 'direct' };
  }
};

export const saveWhatsAppConfig = (config) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// 1. Direct WhatsApp Click-to-Chat (Zero Setup, 100% Free, Opens WhatsApp directly)
export const sendViaDirectWhatsApp = (phone, text) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  return { success: true, message: 'Opened in WhatsApp Web / App' };
};

// 2. CallMeBot Free API (Zero Signup, Free WhatsApp Gateway via Bot)
// How to get free API key in 30 seconds:
// Step 1: Send "I allow callmebot to send me messages" to +34 644 44 24 16
// Step 2: The bot immediately replies with your free API Key (e.g. 123456)
export const sendViaCallMeBot = async (phone, text, apiKey) => {
  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanKey = apiKey.trim();
    const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(text)}&apikey=${cleanKey}`;

    // Note: CallMeBot supports GET request
    // Mode no-cors avoids CORS blocking in client browser
    await fetch(url, { method: 'GET', mode: 'no-cors' });
    return { success: true, message: 'Message sent via CallMeBot API to ' + phone };
  } catch (err) {
    console.error('CallMeBot Error:', err);
    // Fallback to direct wa.me
    sendViaDirectWhatsApp(phone, text);
    return { success: false, error: err.message };
  }
};
