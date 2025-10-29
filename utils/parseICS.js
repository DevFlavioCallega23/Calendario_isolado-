/*
FlavioCallega
08/10/25
WRW_BigBoss
*/

const axios = require('axios');
const ical = require('ical');

/**
 * Função que busca e interpreta um arquivo .ics remoto
 * Retorna um array com as datas ocupadas no formato YYYY-MM-DD
 */
async function getDatasOcupadas(url) {
  try {
    const res = await axios.get(url);
    const data = res.data;
    const eventos = ical.parseICS(data);

    const datas = [];
    for (let k in eventos) {
      const ev = eventos[k];
      if (ev.type === 'VEVENT' && ev.start) {
        const dt = ev.start;
        datas.push(dt.toISOString().split('T')[0]);
      }
    }

    return datas;
  } catch (err) {
    console.error('Erro ao buscar ou interpretar o .ics:', err.message);
    return [];
  }
}

module.exports = { getDatasOcupadas };