/*
08/10/25
FlavioCallega 
WRW_BigBoss
*/

const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDatasOcupadas } = require('./utils/parseICS');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

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

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});