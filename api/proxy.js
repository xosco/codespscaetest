export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);

  // 1. Извлекаем параметры поиска (query params)
  const searchParams = url.searchParams;

  // 2. УДАЛЯЕМ параметр 'path', который Vercel добавляет принудительно
  searchParams.delete('path');

  // 3. Формируем чистый путь для Google
  // Берем оригинальный pathname (например, /v1beta/models/...) и добавляем очищенные параметры
  const targetUrl = 'https://generativelanguage.googleapis.com' + url.pathname + url.search;

  const modifiedHeaders = new Headers(req.headers);
  modifiedHeaders.delete('host');

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: modifiedHeaders,
      body: req.body,
      duplex: 'half',
    });

    // Копируем заголовки ответа, чтобы сохранить стриминг и кодировку
    const responseHeaders = new Headers(response.headers);

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
