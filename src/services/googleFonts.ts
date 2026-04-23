// src/services/googleFonts.ts
const GOOGLE_FONTS_API_KEY = 'AIzaSyCFYYabQvOB-8khzsFEzfe3LFsGBotxTHQ'; // תחליף בקי שלך

export const fetchGoogleFonts = async (sort = 'popularity') => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=${sort}`
    );
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching fonts:", error);
    return [];
  }
};