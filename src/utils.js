export function formatZoneOffset(minutes)
{
  const min = Math.abs(minutes) % 60;
  const hours = (Math.abs(minutes) - min) / 60;
  return (minutes > 0 ? '+' : '-') + String(hours).padStart(2, '0') + ':' + String(min).padStart(2, '0');
}

export function dateAuto(s)
{
  return (typeof s === 'string' || typeof s === 'number') ? new Date(s.indexOf('T') > 0 ? s : s + 'T00:00:00' + formatZoneOffset(new Date().getTimezoneOffset())) : s;
}

export function dateLocale(d, langCode)
{
  if (!d) return '';
  return dateAuto(d).toLocaleString(langCode || undefined,
    {
      year: 'numeric',
      day: 'numeric',
      month: 'short',
    });
}

export function stringDate(text)
{
  const arr = (text || '').split('-');
  const tmp = new Date(arr[0], arr[1] - 1, arr[2], 0, 0, 0, 0);
  return isNaN(tmp.getTime()) ? undefined : tmp;
}
