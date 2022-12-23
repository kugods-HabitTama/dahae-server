const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

/**
 * 한국 표준 시간으로 변환한 날짜를 반환해주는 함수
 */
export const formatToKSTDate = (date: Date) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + KR_TIME_DIFF);
};
