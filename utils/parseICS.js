/*
FlavioCallega
08/10/25
WRW_BigBoss
*/

const express = require('express');
const ical = require('ical');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

async function getDatasOcupadas(url) {
  const res = await axios.get(url);
  const data = res.data;
  const eventos = ical.parseICS(data);

  const datas = [];
  for (let k in eventos) {
    const ev = eventos[k];
    if (ev.type === 'VEVENT') {
      const dt = ev.start;
      datas.push(dt.toISOString().split('T')[0]); // formato YYYY-MM-DD
    }
  }

  return datas;
}

// Rota principal para exibir as datas ocupadas
app.get('/', async (req, res) => {
  const url = process.env.ICS_URL || 'https://exemplo.com/seu-calendario.ics'; // substitua pela URL real
  try {
    const datas = await getDatasOcupadas(url);
    res.json({ datas });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter datas', detalhes: err.message });
  }
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = { getDatasOcupadas };
