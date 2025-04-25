export default function formatDate(date) {
    if (!date) return ''; // o 'Fecha no disponible'
  
    const parsedDate = new Date(date);
  
    if (isNaN(parsedDate)) return ''; // fecha inválida
  
    const formatted = parsedDate.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  
    return formatted;
  }
  