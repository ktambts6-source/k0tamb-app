let getStore = null;
try {
  ({ getStore } = require('@netlify/blobs'));
} catch (error) {
  // Optional dependency in this function: fallback storage is used when unavailable.
}

const key = 'maintenance-state';
let memoryState = null;
let storeInitError = null;

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

function normalizeState(raw) {
  const mode = raw && raw.maintenance_mode === 'true' ? 'true' : 'false';
  const until = raw && typeof raw.maintenance_until === 'string' && raw.maintenance_until.trim()
    ? raw.maintenance_until.trim()
    : null;
  const reason = raw && typeof raw.maintenance_reason === 'string' && raw.maintenance_reason.trim()
    ? raw.maintenance_reason.trim()
    : null;
  return {
    maintenance_mode: mode,
    maintenance_until: until,
    maintenance_reason: reason,
    updated_at: raw && typeof raw.updated_at === 'string' ? raw.updated_at : null
  };
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body)
  };
}

function getStoreSafe() {
  if (typeof getStore !== 'function') {
    return null;
  }

  try {
    return getStore('app-settings');
  } catch (error) {
    storeInitError = error;
    return null;
  }
}

async function readState() {
  const store = getStoreSafe();
  if (!store) {
    return normalizeState(memoryState || {});
  }

  try {
    const saved = await store.get(key, { type: 'json' });
    const state = normalizeState(saved || memoryState || {});
    memoryState = state;
    return state;
  } catch (error) {
    return normalizeState(memoryState || {});
  }
}

async function writeState(nextState) {
  const state = normalizeState(nextState);
  state.updated_at = new Date().toISOString();
  memoryState = state;

  const store = getStoreSafe();
  if (!store) {
    return state;
  }

  try {
    await store.setJSON(key, state);
  } catch (error) {
    return state;
  }

  return state;
}

// DeepSeek key Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ Р В Р’В Р РЋРІР‚СћР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’ВµР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р вЂ°Р В Р’В Р В РІР‚В¦Р В Р Р‹Р Р†Р вЂљРІвЂћвЂ“Р В Р’В Р Р†РІР‚С›РІР‚вЂњ Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹ Р В Р’В Р В РІР‚В  Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚СћР В Р’В Р РЋРїС—Р… Р В Р’В Р вЂ™Р’В¶Р В Р’В Р вЂ™Р’Вµ store
const dsKey = 'deepseek-api-key';

async function readDeepSeekKey() {
  const store = getStoreSafe();
  if (!store) return memoryDeepSeekKey || null;
  try {
    const saved = await store.get(dsKey, { type: 'json' });
    return (saved && saved.key) ? saved.key : null;
  } catch (e) {
    return memoryDeepSeekKey || null;
  }
}

async function writeDeepSeekKey(apiKey) {
  memoryDeepSeekKey = apiKey || null;
  const store = getStoreSafe();
  if (!store) return;
  try {
    await store.setJSON(dsKey, { key: apiKey || '' });
  } catch (e) {}
}

let memoryDeepSeekKey = null;

exports.handler = async function handler(event) {
  try {
    const path = event.path || '';
    const isDeepSeek = path.endsWith('/deepseek-key');

    // === DeepSeek key endpoints ===
    if (isDeepSeek) {
      if (event.httpMethod === 'GET') {
        const k = await readDeepSeekKey();
        // Р В Р’В Р Р†Р вЂљРІвЂћСћР В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В·Р В Р’В Р В РІР‚В Р В Р Р‹Р В РІР‚С™Р В Р’В Р вЂ™Р’В°Р В Р Р‹Р Р†Р вЂљР’В°Р В Р’В Р вЂ™Р’В°Р В Р’В Р вЂ™Р’ВµР В Р’В Р РЋРїС—Р… Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р вЂ°Р В Р’В Р РЋРІР‚СњР В Р’В Р РЋРІР‚Сћ Р В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’В°Р В Р’В Р вЂ™Р’В»Р В Р’В Р РЋРІР‚пїЅР В Р Р‹Р Р†Р вЂљР Р‹Р В Р’В Р РЋРІР‚пїЅР В Р’В Р вЂ™Р’Вµ Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹Р В Р’В Р вЂ™Р’В° (Р В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’Вµ Р В Р Р‹Р В РЎвЂњР В Р’В Р вЂ™Р’В°Р В Р’В Р РЋРїС—Р… Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹) Р В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р РЏ Р В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В±Р В Р Р‹Р Р†Р вЂљРІвЂћвЂ“Р В Р Р‹Р Р†Р вЂљР Р‹Р В Р’В Р В РІР‚В¦Р В Р Р‹Р Р†Р вЂљРІвЂћвЂ“Р В Р Р‹Р Р†Р вЂљР’В¦ Р В Р’В Р вЂ™Р’В·Р В Р’В Р вЂ™Р’В°Р В Р’В Р РЋРІР‚вЂќР В Р Р‹Р В РІР‚С™Р В Р’В Р РЋРІР‚СћР В Р Р‹Р В РЎвЂњР В Р’В Р РЋРІР‚СћР В Р’В Р В РІР‚В 
        // Р В Р’В Р РЋРЎСџР В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В»Р В Р’В Р В РІР‚В¦Р В Р Р‹Р Р†Р вЂљРІвЂћвЂ“Р В Р’В Р Р†РІР‚С›РІР‚вЂњ Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹ Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р вЂ°Р В Р’В Р РЋРІР‚СњР В Р’В Р РЋРІР‚Сћ Р В Р’В Р вЂ™Р’ВµР В Р Р‹Р В РЎвЂњР В Р’В Р вЂ™Р’В»Р В Р’В Р РЋРІР‚пїЅ Р В Р’В Р РЋРІР‚вЂќР В Р’В Р вЂ™Р’ВµР В Р Р‹Р В РІР‚С™Р В Р’В Р вЂ™Р’ВµР В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В°Р В Р’В Р В РІР‚В¦ admin-Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚СћР В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’ВµР В Р’В Р В РІР‚В¦
        const authHeader = event.headers && (event.headers['x-admin-token'] || event.headers['X-Admin-Token']);
        const isAdmin = authHeader === 'parol123kotamb';
        if (isAdmin) {
          return response(200, { key: k || '' });
        }
        // Р В Р’В Р Р†Р вЂљРЎСљР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р РЏ Р В Р’В Р В РІР‚В Р В Р Р‹Р В РЎвЂњР В Р’В Р вЂ™Р’ВµР В Р Р‹Р Р†Р вЂљР’В¦ Р В Р’В Р РЋРІР‚СћР В Р Р‹Р В РЎвЂњР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’В°Р В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р вЂ°Р В Р’В Р В РІР‚В¦Р В Р Р‹Р Р†Р вЂљРІвЂћвЂ“Р В Р Р‹Р Р†Р вЂљР’В¦ Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ Р В Р’В Р РЋРІР‚СћР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В°Р В Р Р‹Р Р†Р вЂљРїС—Р…Р В Р’В Р РЋРїС—Р… Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В РІР‚в„–Р В Р Р‹Р Р†Р вЂљР Р‹ Р В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р РЏ Р В Р’В Р РЋРІР‚пїЅР В Р Р‹Р В РЎвЂњР В Р’В Р РЋРІР‚вЂќР В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р вЂ°Р В Р’В Р вЂ™Р’В·Р В Р’В Р РЋРІР‚СћР В Р’В Р В РІР‚В Р В Р’В Р вЂ™Р’В°Р В Р’В Р В РІР‚В¦Р В Р’В Р РЋРІР‚пїЅР В Р Р‹Р В Р РЏ (Р В Р’В Р вЂ™Р’В±Р В Р’В Р вЂ™Р’ВµР В Р’В Р вЂ™Р’В· Р В Р’В Р РЋРІР‚вЂќР В Р’В Р РЋРІР‚СћР В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В°Р В Р’В Р вЂ™Р’В·Р В Р’В Р вЂ™Р’В° Р В Р’В Р В РІР‚В  UI)
        return response(200, { key: k || '' });
      }
      if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
        const authHeader = event.headers && (event.headers['x-admin-token'] || event.headers['X-Admin-Token']);
        if (authHeader !== 'parol123kotamb') {
          return response(403, { error: 'forbidden' });
        }
        let body = {};
        try { body = event.body ? JSON.parse(event.body) : {}; } catch (e) { return response(400, { error: 'invalid_json' }); }
        await writeDeepSeekKey(body.key || '');
        return response(200, { saved: true });
      }
      return response(405, { error: 'method_not_allowed' });
    }

    // === Maintenance state endpoints (original) ===
    if (event.httpMethod === 'GET') {
      const state = await readState();
      return response(200, state);
    }

    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      let body = {};
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch (e) {
        return response(400, { error: 'invalid_json' });
      }

      const state = await writeState(body);
      return response(200, state);
    }

    return response(405, { error: 'method_not_allowed' });
  } catch (error) {
    if (storeInitError) {
      console.error('maintenance-state store init failed:', storeInitError && storeInitError.message);
      storeInitError = null;
    }
    return response(500, { error: 'internal_error' });
  }
};
