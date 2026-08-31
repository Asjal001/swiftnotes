import { GoogleGenAI } from '@google/genai';
import AppError from '../utils/AppError.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateNoteSummary = async (content) => {
  const plainText = content.replace(/<[^>]*>?/gm, '').trim();
  if (!plainText) throw new AppError('Note has no content to summarize', 400);
  const prompt = `Summarize the following note clearly into bullet points and key takeaways:\n\n${plainText}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Failed to generate summary', 502);
  }
};

export const transcribeAudioNote = async (base64Audio, mimeType = 'audio/webm') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Audio,
          },
        },
        {
          text: 'Transcribe this audio verbatim without adding filler commentary.',
        },
      ],
    });
    return response.text;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Failed to transcribe audio', 502);
  }
};