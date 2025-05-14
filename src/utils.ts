import _ from "lodash";

function padZeros(number: number, length = 2) {
  return _.padStart(number.toString(), length, "0");
}
export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const yearStr = date.getUTCFullYear();
  const monthStr = padZeros(date.getUTCMonth() + 1);
  const dayStr = padZeros(date.getUTCDate());
  const hourStr = padZeros(date.getUTCHours());
  const minuteStr = padZeros(date.getUTCMinutes());
  return `${yearStr}-${monthStr}-${dayStr} ${hourStr}:${minuteStr}`;
}
