
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, GenerationMode } from "../types";
import { ASPECT_RATIOS, REF_IMAGE_PROMPT_PREFIX, TRANSPARENT_MATERIAL_PROMPT, AUTO_DETAIL_ENHANCEMENT, REMOVE_PROMPT } from "../constants";

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

/**
 * Prepares an image for processing without changing aspect ratio, just ensuring max size constraints.
 */
const prepareImageForEditing = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Limit max dimension to 1536 to avoid token limits
      const MAX_DIM = 1536; 
      let width = img.width;
      let height = img.height;

      if (width > MAX_DIM || height > MAX_DIM) {
        const scale = Math.min(MAX_DIM / width, MAX_DIM / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Canvas error"));
        return;
      }
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl.split(',')[1]);
    };
    img.onerror = (err) => reject(err);
    img.src = `data:image/png;base64,${base64Image}`;
  });
};

/**
 * Composites the Drawing Layer (Visual Marks) onto the Source Image.
 * This is used for "Visual Editing" mode.
 */
const compositeVisualLayer = (baseImageB64: string, visualLayerB64: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const bg = new Image();
        const layer = new Image();
        
        let loaded = 0;
        const onLoaded = () => {
            loaded++;
            if (loaded === 2) {
                const canvas = document.createElement('canvas');
                canvas.width = bg.width;
                canvas.height = bg.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) { reject(new Error("Canvas error")); return; }

                // Draw Background
                ctx.drawImage(bg, 0, 0);
                // Draw Visual Layer on top
                ctx.drawImage(layer, 0, 0, bg.width, bg.height);

                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl.split(',')[1]);
            }
        };

        bg.onload = onLoaded;
        layer.onload = onLoaded;
        bg.onerror = reject;
        layer.onerror = reject;

        bg.src = `data:image/png;base64,${baseImageB64}`;
        layer.src = `data:image/png;base64,${visualLayerB64}`;
    });
};

export const generateProductPoster = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  ratio: AspectRatio = '1:1',
  customSize?: SizeConfig,
  referenceImageBase64?: string | null,
  isTransparent: boolean = false,
  maskImageBase64?: string | null,
  mode: GenerationMode = GenerationMode.SCENE
): Promise<string> => {
  try {
    let processedImageBase64: string;

    // 1. Pre-processing Image Logic
    if (mode === GenerationMode.EDIT) {
         // Visual Editing: We need to merge the mask (drawings) onto the image
         // NOTE: Here 'maskImageBase64' is actually the colored drawing layer.
         if (maskImageBase64) {
             // First ensure base image is sized correctly
             const resizedBase = await prepareImageForEditing(base64Image);
             // Then composite
             processedImageBase64 = await compositeVisualLayer(resizedBase, maskImageBase64);
         } else {
             processedImageBase64 = await prepareImageForEditing(base64Image);
         }
    } else if (mode === GenerationMode.REMOVE) {
         // Removal: Standard Inpainting requires untouched original + mask
         processedImageBase64 = await prepareImageForEditing(base64Image);
    } else {
         // Scene / Matting: Resize with padding to the TARGET ratio
         processedImageBase64 = await prepareImageForGeneration(base64Image, ratio, customSize);
    }
    
    const parts: any[] = [
      {
        inlineData: {
          data: processedImageBase64,
          mimeType: 'image/png', // Always use PNG for edited/composed images
        },
      }
    ];

    let finalPrompt = prompt;

    // 2. Logic Branching based on Mode
    if (mode === GenerationMode.REMOVE && maskImageBase64) {
       // --- REMOVAL MODE (Uses Binary Mask) ---
       const processedMaskBase64 = await prepareImageForEditing(maskImageBase64);
       parts.push({
        inlineData: {
          data: processedMaskBase64,
          mimeType: 'image/png',
        },
       });
       finalPrompt = REMOVE_PROMPT;

    } else if (mode === GenerationMode.EDIT) {
       // --- VISUAL EDIT MODE ---
       finalPrompt = `【Task: Visual Instruction Editing】
1. Input Analysis: The input image contains visual markings (e.g., colored lines, arrows, boxes) drawn by the user.
2. Instruction: ${prompt}
3. Execution:
   - Identify the area indicated by the user's markings.
   - Apply the requested change ONLY to the indicated area or using the marking as a guide.
   - **CRITICAL**: The final output should NOT contain the user's colored markings. They are for instruction only. Remove the colored lines/arrows in the final result and replace them with the generated content.
   - Ensure natural lighting and perspective blending.`;

    } else if (referenceImageBase64) {
      // --- SCENE MODE (Style Transfer with Reference) ---
      parts.push({
        inlineData: {
          data: referenceImageBase64,
          mimeType: 'image/jpeg',
        },
      });
      
      // Determine dimension label for prompt injection
      let ratioLabel = "Square 1:1";
      if (ratio === 'custom' && customSize) {
         ratioLabel = `Custom Dimensions ${customSize.width}x${customSize.height}`;
      } else {
         const found = ASPECT_RATIOS.find(r => r.value === ratio);
         if (found) ratioLabel = found.label;
      }

      finalPrompt = `${REF_IMAGE_PROMPT_PREFIX}
      
      【Output Constraint】: The final image MUST maintain the aspect ratio of Image 1 (${ratioLabel}).
      
      Details to generate: ${prompt}${AUTO_DETAIL_ENHANCEMENT}`;
    }

    // 3. Global modifiers
    if (isTransparent && mode !== GenerationMode.REMOVE) {
      finalPrompt += TRANSPARENT_MATERIAL_PROMPT;
    }

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
      throw new Error("AI did not return an image. Please try again.");
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
