export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  
  // Google API эндпоинт
  const targetUrl = 'https://generativelanguage.googleapis.com' + url.pathname + url.search;

  const modifiedHeaders = new Headers(req.headers);
  // Удаляем заголовок хоста, чтобы Google не отклонил запрос
  modifiedHeaders.delete('host');

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: modifiedHeaders,
      body: req.body,
      duplex: 'half',
    });

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}