export const ROOM_TYPE_LABEL = {
  talk_therapy: "Talk therapy",
  bodywork: "Bodywork",
  medical: "Medical",
};

export const DAY_LABEL = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const MELBOURNE_HUBS = [
  "Richmond",
  "Fitzroy",
  "South Yarra",
  "Hawthorn",
  "Brunswick",
];

export function formatAUDFromCents(cents) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function pricePerDayLabel(cents) {
  return `${formatAUDFromCents(cents)} / day`;
}
