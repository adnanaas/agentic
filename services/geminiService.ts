
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

export const getProgrammingExplanation = async (query: string): Promise<AIResponse> => {
  // استخدام مفتاح API مباشرة من البيئة
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // استخدام نموذج gemini-3-flash-preview لاستجابة أسرع وأكثر استقراراً
  const model = "gemini-3-flash-preview";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `اشرح الموضوع التالي في البرمجة للطالب بشكل مفصل وواضح: ${query}`,
      config: {
        systemInstruction: "أنت مدرس برمجة خبير. قدم شروحات واضحة باللغة العربية. يجب أن تكون مخرجاتك بتنسيق JSON حصراً. قسّم الرد إلى مقدمة، مفاهيم أساسية، أمثلة كود عملية مع شرح لكل سطر، وما هو الناتج المتوقع للكود.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            introduction: { type: Type.STRING },
            coreConcepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  language: { type: Type.STRING },
                  code: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  expectedOutput: { type: Type.STRING }
                },
                required: ["language", "code", "explanation", "expectedOutput"]
              }
            },
            summary: { type: Type.STRING }
          },
          required: ["title", "introduction", "coreConcepts", "examples", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("لم يتم استلام محتوى من الخادم");
    }

    // تنظيف النص في حال وجود علامات Markdown (مثل ```json) التي قد يضيفها النموذج أحياناً
    const cleanJson = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    
    return JSON.parse(cleanJson) as AIResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
