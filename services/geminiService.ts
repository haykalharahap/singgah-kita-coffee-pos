
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, Order } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getSmartRecommendation(query: string, menu: MenuItem[]) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `As an expert barista for "Singgah Kita Coffee", suggest items based on: "${query}". 
        Menu: ${JSON.stringify(menu.map(m => ({ name: m.name, desc: m.description })))}
        Respond in JSON.`,
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
                    itemName: { type: Type.STRING },
                    baristaTip: { type: Type.STRING }
                  },
                  required: ['itemName', 'baristaTip']
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || '{"suggestions": []}');
    } catch (error) {
      return { suggestions: [] };
    }
  }

  async getBusinessAdvice(orders: Order[]) {
    try {
      const summary = orders.map(o => ({ total: o.total, items: o.items.map(i => i.name) }));
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `As a coffee shop consultant, analyze these orders: ${JSON.stringify(summary)}. 
        Give 3 short, actionable business tips for Singgah Kita Coffee. Respond in JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || '{"tips": []}');
    } catch (error) {
      return { tips: ["Keep serving great coffee!", "Monitor your peak hours.", "Try seasonal bundles."] };
    }
  }
}
