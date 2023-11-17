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
 * @param grantedDate
 * @param duration
 * @returns
 */
export const setPaymentDueDateDaily = (commencementDate) => {
  const paymentDueDate = commencementDate.setTime(
    commencementDate.getTime() + 30 * 24 * 60 * 60 * 1000,
  );
  return new Date(paymentDueDate);
};

/**
 * set the date the loan repayment will commence
 * @param grantedDate the date loan was given
 * @param duration how many months the loan will span
 * @returns
 */
export const setPaymentCommencementDateMonthly = (grantedDate, months = 1) => {
  const date = new Date(grantedDate);
  return addMonths(date, months);
};
/**
 * set the date the loan repayment will commence
 * @param grantedDate the date loan was given
 * @param duration how many months the loan will span
 * @returns
 */
export const setPaymentCommencementDateWekly = (grantedDate, weeks = 1) => {
  const date = new Date(grantedDate);
  return addWeeks(date, weeks);
};

/**
 * set the date the loan repayment will commence
 * @param grantedDate the date loan was given
 * @param duration how many months the loan will span
 * @returns
 */
export const setPaymentDueDateForNonDaily = (date, duration) => {
  date = new Date(date);
  return addMonths(date, duration);
};

function addMonths(date, months) {
  date.setMonth(date.getMonth() + months);
  return date;
}
function addWeeks(date: Date, weeks = 1) {
  date.setTime(date.getTime() + weeks);
  return date;
}

export function reference(): string {
  const date = new Date();
  const time = date.setTime(date.getTime()).toString();
  return `APP_CODE_${time}`;
}
