export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const message = req.body?.message;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      messages: [
        { 
          role: 'system', 
          content: 'You are PulseGPT, a medical AI trained on PubMed research by Sola Technologies. Answer medical questions clearly, leading with a direct answer first. Keep answers under 150 words. Always remind users to consult a doctor.'
        },
        { role: 'user', content: message }
      ]
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    return res.status(500).json({ reply: 'API error: ' + JSON.stringify(data) });
  }

  res.status(200).json({ reply: data.choices[0].message.content });
}
