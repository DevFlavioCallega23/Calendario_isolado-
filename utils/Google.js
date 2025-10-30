/*
30/10/25
WRW_BigBoss
FlavioCallega_&_Copilot
*/

const { google } = require('googleapis');
const express = require('express');
const router = express.Router();

const CLIENT_ID = '893767602591-ku0l9tl5kj0q0z5m3e6kme3r9hrvpqgs.apps.googleusercontent.com';
const CLIENT_SECRET = 'G0CSPX-Ur7Tx9z0f0ml3fkWnX10X_lONjI';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Rota para iniciar autenticação
router.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events']
  });
  res.redirect(authUrl);
});

// Rota de callback após login
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send('Autenticação concluída com sucesso! Pode fechar esta aba.');
  } catch (err) {
    console.error('Erro na autenticação:', err.message);
    res.status(500).send('Erro na autenticação');
  }
});

// Função para criar evento no Google Calendar
async function criarEvento(data, titulo = 'Reserva TechBuy') {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const evento = {
    summary: titulo,
    start: { date: data },
    end: { date: data },
    description: 'Reserva feita via site TechBuy'
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: evento
    });
    console.log('Evento criado:', response.data.htmlLink);
  } catch (err) {
    console.error('Erro ao criar evento:', err.message);
  }
}

module.exports = { router, criarEvento };