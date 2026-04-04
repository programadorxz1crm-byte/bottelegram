require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs/promises');
const path = require('path');

const app = express();
app.use(require('cors')());
app.use(express.json());
app.use(express.json());

const multer = require('multer');

const UPLOADS_DIR = path.join(__dirname, 'uploads');
fs.mkdir(UPLOADS_DIR, { recursive: true }); // Asegura que la carpeta uploads exista

// Servir archivos estáticos desde la carpeta de uploads
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Endpoint para la subida de archivos
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'Archivo subido con éxito', filePath: fileUrl, fileName: req.file.filename });
});

// Endpoint para obtener la lista de archivos
app.get('/api/files', async (req, res) => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    const fileDetails = files.map(file => ({
      name: file,
      url: `${req.protocol}://${req.get('host')}/uploads/${file}`
    }));
    res.status(200).json(fileDetails);
  } catch (error) {
    res.status(500).send('Error al leer los archivos.');
  }
});

const CONFIG_PATH = path.join(__dirname, 'config.json');
let bot = null;

// --- Lógica del Bot encapsulada ---
const initializeBot = (token) => {
  if (bot) {
    // Si ya hay un bot, lo detenemos antes de crear uno nuevo
    bot.stopPolling();
  }

  if (!token) {
    console.log('No se proporcionó token. El bot no se iniciará.');
    return;
  }

  bot = new TelegramBot(token, { polling: true });

  bot.on('polling_error', (error) => {
    console.error(`Error de polling: ${error.code} - ${error.message}`);
    // Podríamos intentar reiniciar el bot aquí si es necesario
  });

  console.log('Bot inicializado y escuchando...');

  const promoCode = 'BAEZ';
  const registrationLink = 'https://goo.su/ilrE9';

  const welcomeMessage = `
¡Bienvenido al **Robot Millonario**! 🤖💰

Soy tu asistente personal y estoy aquí para ayudarte a ganar dinero y no fallar más nunca en juegos como Mines, Tower Rush, Aviator y Play me.

Para que el robot funcione **correctamente y sin fallos**, es **INDISPENSABLE** que te registres en la plataforma de 1win con mi código promocional.

**Sigue estos 2 simples pasos:**

1️⃣ **Regístrate en 1win** a través de este enlace seguro:
${registrationLink}

2️⃣ Al registrarte, asegúrate de usar el **CÓDIGO PROMOCIONAL:** \`${promoCode}\`

Recuerda que al usar el código \`${promoCode}\` recibirás un **bono del 500%** en tu primer depósito. ¡No lo dejes pasar! 🙌🏼✨

Una vez que hayas completado tu registro, presiona el botón de abajo.
`;

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const opts = {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ ¡Ya me registré con el código!', callback_data: 'user_registered' }],
          [{ text: '🤔 Ya tengo una cuenta, ¿qué hago?', callback_data: 'user_has_account' }]
        ]
      }
    };
    bot.sendMessage(chatId, welcomeMessage, opts);
  });

  bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;

    if (data === 'user_registered') {
      const purchaseMessage = `
¡Excelente! Has completado el paso más importante. 🚀

Ahora estás listo para adquirir el **Robot Millonario** y empezar a ganar.

**Para comprar el robot, sigue estas instrucciones:**

1. Ve a la página de compra de nuestro robot: [ENLACE_DE_COMPRA_AQUI]
2. Completa el pago.
3. Una vez finalizada la compra, presiona el botón de abajo para recibir tus accesos.
      `;
      bot.sendMessage(chatId, purchaseMessage, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '💳 ¡Ya compré el robot!', callback_data: 'user_purchased' }]] } });
    } else if (data === 'user_has_account') {
      const reRegisterMessage = `
¡No te preocupes! Es una situación común.

Para que el **Robot Millonario** funcione al 100% y se sincronice con tu cuenta, es **absolutamente necesario** que la cuenta esté creada con el código \`${promoCode}\`.

**Debes crear una cuenta nueva.**

Usa un correo electrónico diferente y sigue los pasos que te indiqué al principio. ¡Es la única forma de garantizar que ganes!

Cuando termines, presiona el botón de abajo.
      `;
      bot.sendMessage(chatId, reRegisterMessage, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '✅ ¡Listo! Creé una cuenta nueva con el código', callback_data: 'user_registered' }]] } });
    } else if (data === 'user_purchased') {
      const finalMessage = `
¡Felicidades y bienvenido al equipo de ganadores! 💎

Has desbloqueado el acceso exclusivo a nuestros canales.

Canal VIP (Aquí recibirás las señales y actualizaciones del robot):
[ENLACE_CANAL_VIP]

Canal General (Comunicación directa conmigo y la comunidad):
[ENLACE_CANAL_GENERAL]

¡Nos vemos dentro!
      `;
      bot.sendMessage(chatId, finalMessage);
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });
};

// --- Endpoints de la API ---

app.post('/api/login', (req, res) => {
  console.log('Intento de login recibido. Body:', req.body);
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'admin';

  if (username === adminUser && password === adminPass) {
    res.status(200).json({ message: 'Autenticación exitosa' });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

app.get('/api/config', async (req, res) => {
  try {
    const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
    res.status(200).json(JSON.parse(configData));
  } catch (error) {
    // Si el archivo no existe, devolvemos un objeto vacío
    if (error.code === 'ENOENT') {
      return res.status(200).json({});
    }
    res.status(500).json({ message: 'Error al leer la configuración' });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const newConfig = req.body;
    await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
    // Reinicializar el bot con el nuevo token
    initializeBot(newConfig.TELEGRAM_TOKEN);
    res.status(200).json({ message: 'Configuración guardada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar la configuración' });
  }
});

// --- Inicio del Servidor ---

const startServer = async () => {
  try {
    const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(configData);
    if (config.TELEGRAM_TOKEN) {
      initializeBot(config.TELEGRAM_TOKEN);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No se encontró config.json. El bot no se iniciará hasta que se configure.');
    } else {
      console.error('Error al leer la configuración inicial:', error);
    }
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
};

startServer();

module.exports = app;
