/**
 * Copia texto para a área de transferência usando o método mais apropriado
 * Primeiro tenta usar a API moderna (navigator.clipboard)
 * Se falhar, usa o método legado (document.execCommand)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Tenta usar a API moderna primeiro
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Se falhar, continua silenciosamente para o método legado
    }
  }

  // Método legado usando textarea temporário
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Torna o textarea invisível mas ainda acessível
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Erro ao copiar texto:', err);
    return false;
  }
}