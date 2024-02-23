export function moment(timeStampDate) {
  const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(timeStampDate - timezoneOffset)).toISOString().slice(0, -1);
}