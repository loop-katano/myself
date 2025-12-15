import { GoogleGenAI } from "@google/genai";

// Helper to safely get the AI client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLocationInsight = async (locationName: string, title: string, userContext: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "请配置 API Key 以使用 AI 功能。";

  try {
    const prompt = `
      我是一个旅行博主，我在${locationName}拍了一张名为"${title}"的照片。
      照片的内容或者当时的想法是：${userContext}。
      
      请你作为我的"AI灵感缪斯"，为这张照片写一段简短的、富有诗意的、或者是充满哲理的"地点注脚"。
      风格要求：文艺、清新、略带感性，像是一首散文诗的片段。字数控制在100字以内。
      请直接输出内容，不要加引号。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "AI 似乎在发呆...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "灵感暂时枯竭了，请稍后再试。";
  }
};
