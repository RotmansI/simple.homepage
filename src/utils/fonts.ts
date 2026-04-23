export const getGoogleFontsUrl = (primary?: string, secondary?: string) => {
  const families = [];
  if (primary) families.push(`family=${primary.replace(/\s+/g, '+')}:wght@400;700;800`);
  if (secondary) families.push(`family=${secondary.replace(/\s+/g, '+')}:wght@400;700;800`);
  
  if (families.length === 0) return '';
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
};