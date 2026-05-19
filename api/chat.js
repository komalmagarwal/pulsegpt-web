export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  let body = '';
  if (typeof req.body === 'string') {
    body = JSON.parse(req.body);
  } else {
    body = req.body;
  }
  
  const message = body.message;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: 'You are PulseGPT, a medical AI trained on PubMed research by Sola Technologies. Answer medical questions clearly, leading with a direct answer first. Keep answers under 150 words. Always remind users to consult a doctor for personal medical decisions.',
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.content[0].text });
}
