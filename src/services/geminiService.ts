import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const geminiService = {
  suggestRCA: async (deviationTitle: string, deviationDescription: string) => {
    const prompt = `
      You are a Quality Management Expert. Analyze the following deviation and provide 3 smart suggestions for potential root causes and initial investigation steps.
      
      Deviation Title: ${deviationTitle}
      Deviation Description: ${deviationDescription}
      
      Return the suggestions in a clear JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cause: { type: Type.STRING, description: "Potential root cause" },
                  investigationStep: { type: Type.STRING, description: "Recommended next step for investigation" }
                },
                required: ["cause", "investigationStep"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    return JSON.parse(response.text).suggestions;
  },

  generate5Whys: async (deviationTitle: string, deviationDescription: string) => {
    const prompt = `
      You are a Quality Management Expert. Generate a "5 Whys" root cause analysis for the following deviation.
      
      Deviation: ${deviationTitle} - ${deviationDescription}
      
      Provide a logical chain of 5 questions and answers ending in a true root cause.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              why: { type: Type.STRING, description: "The 'Why' question" },
              answer: { type: Type.STRING, description: "The answer leading to the next why" }
            },
            required: ["why", "answer"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  }
};
