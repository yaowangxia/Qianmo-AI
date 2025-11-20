
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";
import { ASPECT_RATIOS, REF_IMAGE_PROMPT_PREFIX, TRANSPARENT_MATERIAL_PROMPT, AUTO_DETAIL_ENHANCEMENT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface SizeConfig {
  width: number;
  height: number;
}

/**
 * Resizes and pads the image to fit the target dimensions on a white canvas.
 */
export const prepareImageForGeneration = (
  base64Image: string,
  targetRatio: AspectRatio,
  customSize?: SizeConfig
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width, height;

      if (targetRatio === 'custom' && customSize) {
        width = customSize.width;
        height = customSize.height;
      } else {
        const ratioConfig = ASPECT_RATIOS.find(r => r.value === targetRatio);
        if (!ratioConfig) {
          resolve(base64Image); // Fallback
          return;
        }
        width = ratioConfig.width;
        height = ratioConfig.height;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = width;
      canvas.height = height;

      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling to fit (contain)
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      
      // Scale down slightly (0.85) to leave room for background generation
      const drawWidth = img.width * scale * 0.85; 
      const drawHeight = img.height * scale * 0.85;
      
      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve(dataUrl.split(',')[1]);
    };
    img.onerror = (err) => reject(err);
    img.src = `data:image/png;base64,${base64Image}`;
  });
};

export const generateProductPoster = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  ratio: AspectRatio = '1:1',
  customSize?: SizeConfig,
  referenceImageBase64?: string | null,
  isTransparent: boolean = false
): Promise<string> => {
  try {
    const processedImageBase64 = await prepareImageForGeneration(base64Image, ratio, customSize);
    
    const parts: any[] = [
      {
        inlineData: {
          data: processedImageBase64,
          mimeType: 'image/jpeg', 
        },
      }
    ];

    // If reference image exists, add it as the second part
    let finalPrompt = prompt;
    if (referenceImageBase64) {
      parts.push({
        inlineData: {
          data: referenceImageBase64,
          mimeType: 'image/jpeg',
        },
      });
      
      // 1. Prepend robust instruction
      finalPrompt = `${REF_IMAGE_PROMPT_PREFIX}\n\n补充描述：${prompt}`;
      
      // 2. Automatically append detail enhancement logic if in reference mode
      // This ensures even simple prompts get high quality results
      finalPrompt += AUTO_DETAIL_ENHANCEMENT;
    }

    // Inject transparency prompt if flag is set
    if (isTransparent) {
      finalPrompt += TRANSPARENT_MATERIAL_PROMPT;
    }

    // Add text prompt last
    parts.push({ text: finalPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    
    if (part && part.inlineData && part.inlineData.data) {
      return part.inlineData.data;
    } else {
      console.error("Empty response candidates:", response);
      throw new Error("AI 未返回图像数据，可能是因为触发了安全策略或服务器繁忙，请重试。");
    }
  } catch (error) {
    console.error("Error generating product poster:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1]; 
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
