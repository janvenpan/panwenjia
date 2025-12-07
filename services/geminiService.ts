import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StoryResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema: Schema = {
  type: Type.OBJECT,
  properties: {
    storyContext: {
      type: Type.STRING,
      description: "一个简短有趣的中文数学故事，适合7岁儿童，包含数字场景。必须是关于凑成10或减去得到10的场景。",
    },
    question: {
      type: Type.STRING,
      description: "具体的中文问题，询问缺失的数字。",
    },
    correctAnswer: {
      type: Type.INTEGER,
      description: "达到10或减至10所需的数字。",
    },
    wrongOptions: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      description: "3个接近正确答案的错误选项。",
    },
    explanation: {
      type: Type.STRING,
      description: "简短的中文鼓励性解释，说明数学原理。",
    },
  },
  required: ["storyContext", "question", "correctAnswer", "wrongOptions", "explanation"],
};

export const generateMathStory = async (): Promise<StoryResponse | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "为7岁的孩子生成一个有趣的中文数学应用题。目标总是让总数等于10（加法）或将数字减少到10（减法）。随机选择加法或减法场景。确保数字是简单的整数。StoryContext（故事背景）, Question（问题）, Explanation（解释）字段必须全部使用中文。",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as StoryResponse;
    }
    return null;
  } catch (error) {
    console.error("Error generating math story:", error);
    return null;
  }
};