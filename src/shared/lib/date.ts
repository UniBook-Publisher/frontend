import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

export function formatDate(iso: string, pattern = 'dd.MM.yyyy') {
  return format(parseISO(iso), pattern, { locale: uk });
}

export function formatDateTime(iso: string) {
  return formatDate(iso, 'dd.MM.yyyy HH:mm');
}
