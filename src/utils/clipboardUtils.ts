
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator?.clipboard?.writeText) {
       await navigator.clipboard.writeText(text);
       return true;
    }
    throw new Error("Clipboard API unavailable");
  } catch (err) {
    console.warn("Clipboard API failed or unavailable, trying fallback...", err);
    
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      textArea.style.position = "fixed";
      textArea.style.left = "0";
      textArea.style.top = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      textArea.style.opacity = "0";
      
      textArea.contentEditable = "true";
      textArea.readOnly = false;
      
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      textArea.setSelectionRange(0, 999999); 
      
      const successful = document.execCommand('copy');
      
      document.body.removeChild(textArea);
      
      if (successful) {
        return true;
      } else {
        console.error("execCommand returned false");
        return false;
      }
    } catch (fallbackErr) {
      console.error("Copy fallback failed completely", fallbackErr);
      return false;
    }
  }
};
