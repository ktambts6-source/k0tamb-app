// Netlify Function: /.netlify/functions/deepseek-key
// Р В Р’В Р СћРЎвЂ™Р В Р Р‹Р В РІР‚С™Р В Р’В Р вЂ™Р’В°Р В Р’В Р В РІР‚В¦Р В Р’В Р РЋРІР‚пїЅР В Р Р‹Р Р†Р вЂљРЎв„ў DeepSeek API Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹ Р В Р’В Р В РІР‚В  JSONBin.io Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ Р В Р’В Р В РІР‚В  Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚СћР В Р’В Р РЋРїС—Р… Р В Р’В Р вЂ™Р’В¶Р В Р’В Р вЂ™Р’Вµ Р В Р’В Р вЂ™Р’В±Р В Р’В Р РЋРІР‚пїЅР В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’Вµ Р В Р Р‹Р Р†Р вЂљР Р‹Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚Сћ Р В Р’В Р РЋРІР‚пїЅ Р В Р Р‹Р В РЎвЂњР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’В°Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚пїЅР В Р Р‹Р В РЎвЂњР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚пїЅР В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В°
// GET  Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ Р В Р’В Р РЋРІР‚СћР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В°Р В Р Р‹Р Р†Р вЂљРїС—Р…Р В Р Р‹Р Р†Р вЂљРЎв„ў Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹ Р В Р’В Р В РІР‚В Р В Р Р‹Р В РЎвЂњР В Р’В Р вЂ™Р’ВµР В Р’В Р РЋРїС—Р… (Р В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р РЏ script.js)
// POST Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ Р В Р Р‹Р В РЎвЂњР В Р’В Р РЋРІР‚СћР В Р Р‹Р Р†Р вЂљР’В¦Р В Р Р‹Р В РІР‚С™Р В Р’В Р вЂ™Р’В°Р В Р’В Р В РІР‚В¦Р В Р Р‹Р В Р РЏР В Р’В Р вЂ™Р’ВµР В Р Р‹Р Р†Р вЂљРЎв„ў Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹ (Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р вЂ°Р В Р’В Р РЋРІР‚СњР В Р’В Р РЋРІР‚Сћ Р В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р РЏ Р В Р’В Р вЂ™Р’В°Р В Р’В Р СћРІР‚пїЅР В Р’В Р РЋРїС—Р…Р В Р’В Р РЋРІР‚пїЅР В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’В°, x-admin-token)

const ADMIN_PASSWORD = 'parol123kotamb';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-token'
};

function resp(code, body) {
  return { statusCode: code, headers: jsonHeaders, body: JSON.stringify(body) };
}

// Р В Р’В Р Р†Р вЂљРЎСљР В Р’В Р РЋРІР‚СћР В Р Р‹Р В РЎвЂњР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’В°Р В Р Р‹Р Р†Р вЂљРїС—Р…Р В Р’В Р РЋРїС—Р… Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹Р В Р’В Р РЋРІР‚пїЅ JSONBin Р В Р’В Р РЋРІР‚пїЅР В Р’В Р вЂ™Р’В· env (Р В Р Р‹Р РЋРІР‚СљР В Р Р‹Р В РЎвЂњР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’В°Р В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’В°Р В Р’В Р В РІР‚В Р В Р’В Р вЂ™Р’В»Р В Р’В Р РЋРІР‚пїЅР В Р’В Р В РІР‚В Р В Р’В Р вЂ™Р’В°Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р Р‹Р В РЎвЂњР В Р Р‹Р В Р РЏ Р В Р Р‹Р Р†Р вЂљР Р‹Р В Р’В Р вЂ™Р’ВµР В Р Р‹Р В РІР‚С™Р В Р’В Р вЂ™Р’ВµР В Р’В Р вЂ™Р’В· Netlify Dashboard Р В Р вЂ Р Р†Р вЂљР’В Р Р†Р вЂљРІвЂћСћ Environment variables)
// JSONBIN_ACCESS_KEY Р В Р’В Р РЋРІР‚пїЅ JSONBIN_BIN_ID
function getJsonBinCreds() {
  return {
    accessKey: process.env.JSONBIN_ACCESS_KEY || '',
    binId: process.env.JSONBIN_BIN_ID || ''
  };
}

async function fetchBin(accessKey, binId) {
  const r = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    headers: { 'X-Access-Key': accessKey }
  });
  if (!r.ok) throw new Error('jsonbin_fetch_' + r.status);
  const data = await r.json();
  return data.record || {};
}

async function updateBin(accessKey, binId, record) {
  const r = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Access-Key': accessKey },
    body: JSON.stringify(record)
  });
  if (!r.ok) throw new Error('jsonbin_put_' + r.status);
  return await r.json();
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return resp(204, {});

  const { accessKey, binId } = getJsonBinCreds();

  // Р В Р’В Р Р†Р вЂљРЎС›Р В Р Р‹Р В РЎвЂњР В Р’В Р вЂ™Р’В»Р В Р’В Р РЋРІР‚пїЅ env Р В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’Вµ Р В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’В°Р В Р Р‹Р В РЎвЂњР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р Р‹Р В РІР‚С™Р В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’ВµР В Р’В Р В РІР‚В¦Р В Р Р‹Р Р†Р вЂљРІвЂћвЂ“ Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ Р В Р’В Р вЂ™Р’В±Р В Р’В Р вЂ™Р’ВµР В Р Р‹Р В РІР‚С™Р В Р Р‹Р Р†Р вЂљРїС—Р…Р В Р’В Р РЋРїС—Р… Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹Р В Р’В Р РЋРІР‚пїЅ Р В Р’В Р РЋРІР‚пїЅР В Р’В Р вЂ™Р’В· Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’ВµР В Р’В Р вЂ™Р’В»Р В Р’В Р вЂ™Р’В° Р В Р’В Р вЂ™Р’В·Р В Р’В Р вЂ™Р’В°Р В Р’В Р РЋРІР‚вЂќР В Р Р‹Р В РІР‚С™Р В Р’В Р РЋРІР‚СћР В Р Р‹Р В РЎвЂњР В Р’В Р вЂ™Р’В° (Р В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р РЏ GET Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ Р В Р’В Р РЋРІР‚пїЅР В Р’В Р вЂ™Р’В· Р В Р’В Р вЂ™Р’В·Р В Р’В Р вЂ™Р’В°Р В Р’В Р РЋРІР‚вЂњР В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В»Р В Р’В Р РЋРІР‚СћР В Р’В Р В РІР‚В Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В°)
  // Р В Р’В Р вЂ™Р’В­Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚Сћ Р В Р’В Р вЂ™Р’В·Р В Р’В Р вЂ™Р’В°Р В Р’В Р РЋРІР‚вЂќР В Р’В Р вЂ™Р’В°Р В Р Р‹Р В РЎвЂњР В Р’В Р В РІР‚В¦Р В Р’В Р РЋРІР‚СћР В Р’В Р Р†РІР‚С›РІР‚вЂњ Р В Р’В Р В РІР‚В Р В Р’В Р вЂ™Р’В°Р В Р Р‹Р В РІР‚С™Р В Р’В Р РЋРІР‚пїЅР В Р’В Р вЂ™Р’В°Р В Р’В Р В РІР‚В¦Р В Р Р‹Р Р†Р вЂљРЎв„ў: Р В Р’В Р РЋРІР‚вЂќР В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р вЂ°Р В Р’В Р вЂ™Р’В·Р В Р’В Р РЋРІР‚СћР В Р’В Р В РІР‚В Р В Р’В Р вЂ™Р’В°Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’ВµР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р вЂ° Р В Р’В Р РЋРІР‚вЂќР В Р’В Р вЂ™Р’ВµР В Р Р‹Р В РІР‚С™Р В Р’В Р вЂ™Р’ВµР В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В°Р В Р Р‹Р Р†Р вЂљРїС—Р…Р В Р Р‹Р Р†Р вЂљРЎв„ў Р В Р Р‹Р В РЎвЂњР В Р’В Р В РІР‚В Р В Р’В Р РЋРІР‚СћР В Р’В Р РЋРІР‚пїЅ Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹Р В Р’В Р РЋРІР‚пїЅ JSONBin
  const bodyKeys = (() => {
    try { return JSON.parse(event.body || '{}'); } catch { return {}; }
  })();

  const ak = accessKey || bodyKeys.accessKey || '';
  const bid = binId || bodyKeys.binId || '';

  if (event.httpMethod === 'GET') {
    // Р В Р’В Р Р†Р вЂљРЎСљР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р РЏ GET Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹Р В Р’В Р РЋРІР‚пїЅ JSONBin Р В Р’В Р вЂ™Р’В±Р В Р’В Р вЂ™Р’ВµР В Р Р‹Р В РІР‚С™Р В Р Р‹Р Р†Р вЂљРїС—Р…Р В Р’В Р РЋРїС—Р… Р В Р’В Р РЋРІР‚пїЅР В Р’В Р вЂ™Р’В· query string (?ak=...&bid=...)
    const qs = event.queryStringParameters || {};
    const qak = ak || qs.ak || '';
    const qbid = bid || qs.bid || '';
    if (!qak || !qbid) return resp(200, { key: '' });
    try {
      const record = await fetchBin(qak, qbid);
      return resp(200, { key: record.deepseekApiKey || '' });
    } catch (e) {
      return resp(200, { key: '' });
    }
  }

  if (event.httpMethod === 'POST') {
    const token = (event.headers && (event.headers['x-admin-token'] || event.headers['X-Admin-Token'])) || '';
    if (token !== ADMIN_PASSWORD) return resp(403, { error: 'forbidden' });

    const { key: newKey, accessKey: bak, binId: bbid } = bodyKeys;
    const finalAk = ak || bak || '';
    const finalBid = bid || bbid || '';
    if (!finalAk || !finalBid) return resp(400, { error: 'missing_jsonbin_creds' });

    try {
      const record = await fetchBin(finalAk, finalBid);
      record.deepseekApiKey = newKey || '';
      await updateBin(finalAk, finalBid, record);
      return resp(200, { saved: true });
    } catch (e) {
      return resp(500, { error: e.message });
    }
  }

  return resp(405, { error: 'method_not_allowed' });
};
