// =====================================
// IMPORTAÇÕES E CONFIGURAÇÃO
// =====================================
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authTimeoutMs: 60000,
});

// QR CODE E CONEXÃO
client.on("qr", (qr) => {
  console.log("📲 Escaneie o QR Code abaixo:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => console.log("✅ WhatsApp conectado!"));

// FUNÇÃO DE DELAY (ESPERA)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// =====================================
// LOGICA DO ROBÔ
// =====================================
client.on("message", async (msg) => {
  try {
    // Ignora grupos
    if (msg.from.endsWith("@g.us")) return;

    const chat = await msg.getChat();
    const texto = msg.body ? msg.body.trim().toLowerCase() : "";

    // 1. MENSAGEM INICIAL (GATILHOS)
    if (/^(menu|oi|olá|ola|bom dia|boa tarde|boa noite|teste)$/i.test(texto)) {
      const contact = await msg.getContact();
      const nome = contact.pushname ? contact.pushname.split(" ")[0] : "Cliente";

      // Simula digitação
      await chat.sendStateTyping();
      await delay(3000);

      await client.sendMessage(
        msg.from,
        `Olá, ${nome}! 🚘👽\nSou a assistente virtual da Estética Automotiva ET Garage. Como posso ajudar?\n\nDigite o número da opção:\n1. Ver Serviços e Preços\n2. Localização\n3. Horários\n4. Falar com atendente`
      );
    }

    // 2. RESPOSTAS DO MENU
    if (texto === "1") {
      await chat.sendStateTyping();
      await delay(2000);
      await client.sendMessage(msg.from, "🏍️ *Nossos Serviços:*\n- Lavagem Simples(Carro): R$ 50\n- Lavagem Simples(Moto): R$ 25\n- Lavagem Detalhada: R$ 400\n- Higienização de Bancos Tetos: R$ 350\n- Polimento: R$ 300\n- Vitrificação(Valor Mínimo): R$ 750");
    } 
    
    else if (texto === "2") {
      await chat.sendStateTyping();
      await delay(2000);
      await client.sendMessage(msg.from, "📍 Estamos na Rua 1° de maio, Capoeiras - PE, 55365-000. Para mais informações, acesse nossa localidade pelo google maps: https://share.google/7ungG22x7o8tPtb9e");

    } 
    
    else if (texto === "3") {
      await chat.sendStateTyping();
      await delay(2000);
      await client.sendMessage(msg.from, "⏰ Atendemos de Segunda a Sábado, das 08h30 às 19h00.");
    } 
    
    else if (texto === "4") {
      await chat.sendStateTyping();
      await delay(2000);
      await client.sendMessage(msg.from, "Aguarde um instante, nossa equipe já vai te atender! 🚘🏍️");
    }

  } catch (error) {
    console.error("❌ Erro:", error);
  }
});

client.initialize();

