import _ from "lodash";

function padZeros(number: number, length = 2) {
  return _.padStart(number.toString(), length, "0");
}
export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const yearStr = date.getFullYear();
  const monthStr = padZeros(date.getMonth() + 1);
  const dayStr = padZeros(date.getDate());
  const hourStr = padZeros(date.getHours());
  const minuteStr = padZeros(date.getMinutes());
  return `${yearStr}-${monthStr}-${dayStr} ${hourStr}:${minuteStr}`;
}

export function getTimezoneStr() {
  const offset = new Date().getTimezoneOffset();
  const gmtAddedMinutes = -(offset % 60);
  const gmtAddedHours = -Math.floor(offset / 60);

  return `GMT${offset <= 0 ? "+" : "-"}${Math.abs(gmtAddedHours)}${
    gmtAddedMinutes ? `:${padZeros(Math.abs(gmtAddedMinutes), 2)}` : ""
  }`;
}
