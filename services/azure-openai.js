import OpenAI from 'openai';

function getClient() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-01';

  if (!endpoint || !apiKey) throw new Error('Azure OpenAI credentials not configured.');

  return {
    client: new OpenAI({
      apiKey,
      baseURL: `${endpoint}/openai/deployments/${deployment}`,
      defaultQuery: { 'api-version': apiVersion },
      defaultHeaders: { 'api-key': apiKey },
    }),
    deployment,
  };
}

const SYSTEM_PROMPT = `You are an expert English language coach. Analyze the given English speech transcript and return a JSON object with exactly this structure:
{
  "grammarScore": <number 0-100>,
  "vocabularyScore": <number 0-100>,
  "grammarCorrections": [
    { "original": "<wrong phrase>", "corrected": "<corrected phrase>", "explanation": "<brief reason>" }
  ],
  "vocabularySuggestions": [
    { "word": "<basic word used>", "betterAlternative": "<richer alternative>", "reason": "<brief reason>" }
  ],
  "overallFeedback": "<2-3 encouraging sentences summarizing performance and key areas to improve>"
}

Scoring guide:
- grammarScore: 100 = perfect grammar, deduct points for each error
- vocabularyScore: 100 = rich varied vocabulary, deduct points for basic/repetitive words
- Keep corrections and suggestions to the 3 most impactful ones max
- Keep the tone positive and encouraging
- Return ONLY valid JSON, no markdown or extra text`;

export async function analyzeGrammarAndVocabulary(transcription, topic = null) {
  const { client } = getClient();

  const userMessage = topic
    ? `Topic: "${topic}"\n\nTranscript: "${transcription}"`
    : `Transcript: "${transcription}"`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
}
