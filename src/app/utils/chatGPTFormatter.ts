export const convertToChatGPTHTML = (text: string): string => {
  if (!text) return '';
  
  return text
    // Convert markdown bold to HTML bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert markdown italic to HTML italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert bullet points to proper HTML structure
    .replace(/^[•\-\*+]\s+(.*)$/gm, '<div class="bullet-point">• $1</div>')
    // Convert line breaks to proper HTML
    .replace(/\n/g, '<br>')
    // Clean up any remaining markdown artifacts
    .replace(/^#+\s+/gm, '') // Remove markdown headers
    .replace(/`(.*?)`/g, '<code>$1</code>'); // Convert inline code
}; 