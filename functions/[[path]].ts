// Cloudflare Pages Functions catch-all to serve the SPA and API
export const onRequest: PagesFunction = async (context) => {
  const { request, env, next } = context as any;
  const url = new URL(request.url);

  // Delegate to functions under /api/*
  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  // For non-API routes, serve the built SPA (dist/index.html)
  // When deploying on Cloudflare Pages, this file is served automatically if present.
  // This catch-all is a safety net; if not found, just continue to default.
  try {
    // @ts-ignore CF Pages provides ASSETS binding in functions runtime
    const res = await env.ASSETS.fetch(new Request(url.origin + '/index.html'));
    if (res && res.ok) return res;
  } catch {}

  return next();
};
