import moment from 'moment';

export function formatDate(date, format = 'DD/MM/YYYY HH:mm') {
  return moment(date).format(format);
}

export function nowIsBefore(date) {
  return moment().isBefore(date);
}
