// API service for communicating with the backend

// Base API URL - can be changed based on environment
const API_URL = 'http://localhost:8000/api/v1';

// For production, you can use environment variables or window config
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Interface for the request payload
interface PresentationRequest {
  text: string;
}

// Interface for the API response
export interface ApiPresentationResponse {
  title: string;
  slides: {
    title: string;
    bullets: Array<{text: string}>;
    slide_id?: string;
  }[];
}

// Interface for slide modification request
export interface SlideModificationRequest {
  slide_id: string;
  user_prompt: string;
  current_content: {
    title: string;
    bullets: Array<{text: string}>;
  };
}

// Interface for slide modification response
export interface SlideModificationResponse {
  slide_id: string;
  modified_slide: {
    title: string;
    bullets: Array<{text: string}>;
    slide_id: string;
  };
}

/**
 * Generate a presentation from text
 * @param text The input text to convert to presentation
 * @returns Promise with presentation data
 */
export async function generatePresentation(text: string): Promise<ApiPresentationResponse> {
  const response = await fetch(`${API_URL}/presentation/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to generate presentation');
  }

  return response.json();
}

/**
 * Modify a slide based on user instructions
 * @param slideId The ID of the slide to modify
 * @param userPrompt The user's instructions for modification
 * @param currentContent The current content of the slide
 * @returns Promise with modified slide data
 */
export async function modifySlide(
  slideId: string, 
  userPrompt: string, 
  currentContent: {title: string, bullets: Array<{text: string}>}
): Promise<SlideModificationResponse> {
  const response = await fetch(`${API_URL}/presentation/modify-slide`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      slide_id: slideId,
      user_prompt: userPrompt,
      current_content: currentContent
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to modify slide');
  }

  return response.json();
}

/**
 * Get a base64 encoded PowerPoint file for the presentation
 * @param text The input text to convert to presentation
 * @returns Promise with presentation data and base64 encoded PPTX
 */
export async function getPresentationWithBase64(text: string): Promise<ApiPresentationResponse & {pptx_base64: string}> {
  const response = await fetch(`${API_URL}/presentation/presentation-base64`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to generate presentation with base64');
  }

  return response.json();
}

/**
 * Get a downloadable PowerPoint file for the presentation
 * @param text The input text to convert to presentation
 * @returns Promise with blob data for the PPTX file
 */
export async function downloadPresentation(text: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/presentation/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Failed to download presentation');
  }

  return response.blob();
}

// PDF download function removed as requested
