export async function onRequestGet(context) {
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM rigs ORDER BY created_at DESC LIMIT 20"
  ).all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const data = await context.request.json();
  await context.env.DB.prepare(
    "INSERT INTO rigs (file_name, hf_space, status, download_url) VALUES (?, ?, ?, ?)"
  )
    .bind(data.file_name, data.hf_space, data.status, data.download_url || "")
    .run();

  return Response.json({ success: true });
}
