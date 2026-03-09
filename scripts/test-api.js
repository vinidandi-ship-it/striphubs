/* eslint-disable no-console */
const base = process.env.BASE_URL || 'https://striphubs.vercel.app';

const check = async (name, url, validate) => {
  try {
    const res = await fetch(`${base}${url}`);
    const text = await res.text();
    const body = (() => {
      try { return JSON.parse(text); } catch { return text; }
    })();

    const ok = res.ok && validate(body);
    console.log(`${ok ? 'PASS' : 'FAIL'} ${name} -> ${res.status}`);
    if (!ok) {
      console.log('  body:', typeof body === 'string' ? body.slice(0, 200) : JSON.stringify(body).slice(0, 300));
    }
    return ok;
  } catch (e) {
    console.log(`FAIL ${name} ->`, e.message);
    return false;
  }
};

(async () => {
  const modelsOk = await check('models', '/api/models?limit=3', (b) => Array.isArray(b.models));

  let first = '';
  if (modelsOk) {
    const data = await (await fetch(`${base}/api/models?limit=1`)).json();
    first = data?.models?.[0]?.username || '';
  }

  const modelOk = await check('model', `/api/model?name=${encodeURIComponent(first || 'unknown')}`, (b) => Boolean(b.username || b.error));
  const categoriesOk = await check('categories', '/api/categories', (b) => Array.isArray(b.categories));
  const statsOk = await check('statistics', '/api/statistics?period=today', (b) => typeof b.clicks === 'number' || b.error === true);

  const failed = [modelsOk, modelOk, categoriesOk, statsOk].filter((x) => !x).length;
  process.exit(failed ? 1 : 0);
})();
