export const SUNDAY = 'Sunday';
export const SATURDAY = 'Saturday';
export const FRIDAY = 'Friday';
export function day() {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
}

/**
 * This will return the day name from a given date
 * @param date
 * @returns
 */
export const dayName = (date) => {
  const dayName = new Date(date).toLocaleString('en-us', {
    weekday: 'long',
  });
  return dayName;
};

/**
 * set the date the loan repayment will commence
 * @param grantedDate
 * @param duration
 * @returns
 */
export const setPaymentCommencementDateDaily = (grantedDate, startDay = 2) => {
  const day_name = dayName(grantedDate);
  const date = new Date(grantedDate);
  startDay = day_name === SUNDAY || day_name === FRIDAY ? 3 : startDay;
  startDay = day_name === SATURDAY ? 4 : startDay;
  const paymentCommencement = date.setTime(
    date.getTime() + startDay * 24 * 60 * 60 * 1000,
  );
  return new Date(paymentCommencement);
};

/**
 * set the date the loan repayment will commence
 * @param grantedDate the date loan was given
 * @param duration how many months the loan will span
 * @returns
 */
export const setPaymentCommencementDateMonthly = (
  grantedDate,
  duration = 12,
) => {
  const date = new Date(grantedDate);
  const paymentCommencement = date.setTime(
    date.getTime() + duration * 30 * 24 * 60 * 60 * 1000,
  );
  return new Date(paymentCommencement);
};
