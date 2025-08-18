export const onRequest: PagesFunction = async (ctx) => {
  const { request, env, next } = ctx;
  const url = new URL(request.url);

  // 1) /api/* は Functions の各APIへ
  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  // 2) まず静的アセット（ビルド成果物）をそのまま返す
  try {
    const assetResp = await env.ASSETS.fetch(request);
    if (assetResp && assetResp.status !== 404) {
      return assetResp;
    }
  } catch {}

  // 3) 見つからなければ SPA 用に index.html を返す
  const indexReq = new Request(new URL('/index.html', url).toString(), request);
  return env.ASSETS.fetch(indexReq);
};
