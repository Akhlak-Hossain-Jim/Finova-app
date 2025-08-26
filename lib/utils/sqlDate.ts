export function toSQLLocal(date = new Date()) {
  const iso = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000
  ).toISOString();
  const offset = new Intl.DateTimeFormat('en', {
    timeZoneName: 'shortOffset',
  })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')
    ?.value?.replace('GMT', '');

  return iso
    .replace('T', ' ')
    .slice(0, 19)
    .concat(offset ?? '');
}
