// Runtime-safe fetch: use global fetch if available, otherwise require node-fetch
let fetchFn;
try {
  fetchFn = globalThis.fetch || (require('node-fetch'));
  if (fetchFn && fetchFn.default) fetchFn = fetchFn.default;
} catch (e) {
  fetchFn = globalThis.fetch;
}

// Netlify function: accepts { prompt } in POST body, responds with { text, audio?: 'data:audio/...;base64,...' }
exports.handler = async function(event, context) {
  try {
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) return { statusCode: 400, body: JSON.stringify({ error: 'Missing prompt' }) };

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY || process.env.ELEVENLABS_API_KEY || process.env.ELEVENLAB_API_KEY;

    if (!GEMINI_API_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }) };

    // Call Gemini (Generative Language API)
    const geminiRes = await fetchFn(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Use minimal supported payload
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const geminiData = await geminiRes.json();

    // Extract best text answer with fallbacks
    let answerText = null;
    try {
      answerText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || geminiData?.candidates?.[0]?.content?.text || geminiData?.output?.[0]?.content?.text || null;
    } catch (e) { answerText = null; }
    if (!answerText) {
      // fallback: stringify the response for debugging
      answerText = (typeof geminiData === 'string') ? geminiData : JSON.stringify(geminiData);
    }

    // If ElevenLabs key present, request TTS and return base64 audio
    let audioDataUrl = null;
    if (ELEVEN_API_KEY) {
      try {
        // Default voice from env or fallback
        let voiceId = process.env.ELEVEN_VOICE_ID || 'alloy';
        const ttsAttempt = async (id) => {
          const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(id)}`;
          const resp = await fetchFn(ttsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'xi-api-key': ELEVEN_API_KEY },
            body: JSON.stringify({ text: answerText })
          });
          return resp;
        };

        let ttsRes = await ttsAttempt(voiceId);
        if (!ttsRes.ok) {
          const errText = await ttsRes.text().catch(()=>null);
          console.warn('ElevenLabs TTS error', ttsRes.status, errText);
          // If voice not found, fetch available voices and retry with first available
          if (errText && errText.includes('voice_not_found')) {
            try {
              const voicesRes = await fetchFn('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': ELEVEN_API_KEY } });
              if (voicesRes.ok) {
                const voicesJson = await voicesRes.json();
                const firstVoice = Array.isArray(voicesJson) ? voicesJson[0] : (voicesJson?.voices?.[0]);
                const newVoiceId = firstVoice?.voice_id || firstVoice?.id || firstVoice?.voiceId || null;
                if (newVoiceId) {
                  console.warn('Retrying TTS with voice:', newVoiceId);
                  ttsRes = await ttsAttempt(newVoiceId);
                }
              } else {
                console.warn('Failed to list ElevenLabs voices', voicesRes.status);
              }
            } catch (listErr) {
              console.warn('Error fetching ElevenLabs voices', listErr);
            }
          }
        }

        if (ttsRes && ttsRes.ok) {
          const arrayBuffer = await ttsRes.arrayBuffer();
          const buf = Buffer.from(arrayBuffer);
          const mime = ttsRes.headers.get('content-type') || 'audio/mpeg';
          audioDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
        }
      } catch (ttsErr) {
        console.warn('ElevenLabs TTS request failed', ttsErr);
      }
    }

    const payload = { text: answerText };
    if (audioDataUrl) payload.audio = audioDataUrl;

    return { statusCode: 200, body: JSON.stringify(payload) };
  } catch (err) {
    console.error('Function error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error', details: String(err) }) };
  }
};

