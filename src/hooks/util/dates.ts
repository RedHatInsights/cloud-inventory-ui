export const formatDate = (iso: string): string => {
  const date = new Date(iso);

  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
};
