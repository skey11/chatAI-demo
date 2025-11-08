export const formatTimestamp = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};
