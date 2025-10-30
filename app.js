/*
30/10/25
WRW_BigBoss
FlavioCallega_&_Copilot
*/

const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDatasOcupadas } = require('./utils/parseICS');
const { router: googleRouter, criarEvento } = require('./utils/google');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Para aceitar JSON no corpo da requisição

// Calendários por imóvel
const calendarios = {
  casaPraia: 'https://www.airbnb.com.br/calendar/ical/41662018.ics?s=b8cedbfaf02c937a5ac60fb776cabbcb'
};

// Rota para obter disponibilidade
app.get('/disponibilidade/:imovelId', async (req, res) => {
  const imovelId = req.params.imovelId;
  const url = calendarios[imovelId];
  if (!url) return res.status(404).json({ erro: 'Imóvel não encontrado' });

  try {
    const datas = await getDatasOcupadas(url);
    res.json(datas);
  } catch (err) {
    console.error(`Erro ao processar calendário do imóvel ${imovelId}:`, err.message);
    res.status(500).json({ erro: 'Erro ao processar calendário', detalhes: err.message });
  }
});

// Rota para criar evento no Google Calendar
app.post('/reservar', async (req, res) => {
  const { data, titulo } = req.body;
  if (!data) return res.status(400).json({ erro: 'Data da reserva é obrigatória' });

  try {
    await criarEvento(data, titulo || 'Reserva TechBuy');
    res.json({ sucesso: true, mensagem: 'Evento criado no Google Calendar' });
  } catch (err) {
    console.error('Erro ao criar evento:', err.message);
    res.status(500).json({ erro: 'Erro ao criar evento', detalhes: err.message });
  }
});

// Rotas de autenticação Google
app.use(googleRouter);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});