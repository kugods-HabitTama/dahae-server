const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

/**
 * 한국 표준 시간으로 변환한 날짜를 반환해주는 함수
 */
export const formatToKSTDate = (date: Date) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + KR_TIME_DIFF);
};

export const convertDayBitToString = (days: number) => {
  const dayArr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const habitDayArr = [];

  for (let i = 0; i < 7; i++) {
    const dayBit = days >> i;

    if (dayBit & 1) habitDayArr.push(dayArr[i]);
  }

  return habitDayArr;
};

export const convertHabitTimeToString = (habitTime: number) => {
  if (!habitTime) return null;

  const date = new Date(habitTime);

  const hh = date.getHours();
  const mm = date.getMinutes();

  const formattedString =
    (hh >= 10 ? '' + hh : '0' + hh) + (mm >= 10 ? '' + mm : '0' + mm);

  return formattedString;
};