export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const message = req.body?.message;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20251001',
      max_tokens: 300,
      system: 'You are PulseGPT, a medical AI by Sola Technologies. Answer medical questions clearly, leading with a direct answer first. Keep answers under 150 words. Always remind users to consult a doctor.',
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    return res.status(500).json({ reply: 'API error: ' + JSON.stringify(data) });
  }

  res.status(200).json({ reply: data.content[0].text });
}
