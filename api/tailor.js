require('dotenv').config();
const { HARRY_PROFILE } = require('./context');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { jobDescription } = req.body || {};

    if (
      !jobDescription ||
      typeof jobDescription !== 'string' ||
      jobDescription.trim().length < 20
    ) {
      return res.status(400).json({
        error: 'Please provide a valid job description with at least 20 characters.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error:
          'Gemini API key is not configured. Please set GEMINI_API_KEY in environment variables.',
      });
    }

    const prompt = `
Analyze the following Job Description against Harry's verified profile:

${HARRY_PROFILE}

--- JOB DESCRIPTION TO ANALYZE ---
${jobDescription.trim()}

--- TASK ---
Evaluate how well Harry's background aligns with this job description.
Return a STRICT valid JSON object matching this schema:
{
  "matchScore": number (realistic percentage between 50 and 98 based on actual tech and experience match),
  "detectedRole": string (concise target role title, e.g. "Senior Full-Stack Engineer"),
  "matchedSkills": array of strings (top 4-7 specific skills Harry possesses that match the JD),
  "keyStrengths": array of strings (3 concise bullet points highlighting why Harry fits this role),
  "recommendedProjects": array of objects [
    {
      "name": string (project from Harry's portfolio, e.g., "Horal App", "Afridol", "MyTvShow", "Trovnews", or "HaidyAgroHub"),
      "reason": string (one sentence explaining how this project proves qualifications for this job)
    }
  ],
  "tailoredSummary": string (a compelling 2-3 sentence elevator pitch written in first person "I" or third person "Harry" tailored specifically to pitch for this role)
}
`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    };

    const models = ['gemini-flash-latest', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];
    let rawText = null;

    for (const model of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            break;
          }
        }
      } catch (callErr) {
        console.error(`Attempt with ${model} failed:`, callErr.message);
      }
    }

    if (!rawText) {
      return res.status(500).json({ error: 'Failed to generate tailored resume analysis.' });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('JSON parse error from Gemini:', rawText);
      return res.status(500).json({ error: 'Failed to parse structured response from AI.' });
    }

    return res.status(200).json(parsedResult);
  } catch (err) {
    console.error('Tailor Serverless Error:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred while analyzing the job description.',
    });
  }
};
