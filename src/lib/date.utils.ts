export function formatDateToLocal(
  isoString: string,
  locale = "en-US",
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
) {
  const date = new Date(isoString);
  return date.toLocaleString(locale, { timeZone });
}
