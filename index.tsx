/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

// API Key is handled by the environment.
const API_KEY = process.env.API_KEY;

// DOM Elements
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const generateButton = document.getElementById('generate-button') as HTMLButtonElement;
const resultContainer = document.getElementById('result-container') as HTMLDivElement;
const placeholder = document.getElementById('placeholder') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;
const resultImage = document.getElementById('result-image') as HTMLImageElement;

/**
 * Toggles the UI state between loading and idle.
 * @param isLoading - Whether the app is in a loading state.
 */
function setLoading(isLoading: boolean) {
  if (isLoading) {
    generateButton.disabled = true;
    loader.style.display = 'block';
    placeholder.style.display = 'none';
    resultImage.style.display = 'none';
    resultContainer.setAttribute('aria-busy', 'true');
  } else {
    generateButton.disabled = false;
    loader.style.display = 'none';
    resultContainer.removeAttribute('aria-busy');
  }
}

/**
 * Displays an error message in the result container.
 * @param message - The error message to display.
 */
function displayError(message: string) {
    placeholder.style.display = 'block';
    placeholder.innerHTML = `<p style="color: var(--error-color);">${message}</p>`;
    resultImage.style.display = 'none';
}

/**
 * Handles the image generation process.
 */
async function handleGenerateClick() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    displayError('Por favor, insira uma descrição para a estampa.');
    return;
  }

  setLoading(true);

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    resultImage.src = imageUrl;
    resultImage.style.display = 'block';
    placeholder.style.display = 'none';

  } catch (error) {
    console.error('Error generating image:', error);
    displayError('Ocorreu um erro ao gerar a imagem. Tente novamente mais tarde.');
  } finally {
    setLoading(false);
  }
}

// Event listener for the generate button
generateButton.addEventListener('click', handleGenerateClick);

// Allow pressing Enter in the textarea to trigger generation
promptInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent new line
        handleGenerateClick();
    }
});
