export function json(data: any, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  if (!headers.get('content-type')) headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data), { ...init, headers });
}

export async function readJson<T = any>(request: Request): Promise<T> {
  const text = await request.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Response('Invalid JSON body', { status: 400 });
  }
}

export function error(message: string, status = 400) {
  return json({ error: message }, { status });
}

export function notFound(message = 'Not found') {
  return error(message, 404);
}

export function methodNotAllowed(method: string) {
  return error(`Method ${method} not allowed`, 405);
}

type EnvWithDB = { DB: D1Database };
export type Env = EnvWithDB & Record<string, any>;

export async function run<T = any>(env: Env, sql: string, params: any[] = []) {
  const stmt = env.DB.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  // @ts-ignore D1 types
  const res = await bound.all<T>();
  return res;
}

export async function exec(env: Env, sql: string) {
  return env.DB.exec(sql);
}

export function parseJsonColumns<T extends Record<string, any>>(row: T, keys: string[]): T {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'string') {
      try { row[k] = JSON.parse(v); } catch {}
    }
  }
  return row;
}
