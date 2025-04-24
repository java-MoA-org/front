import { useState, useEffect } from 'react';

// 작성 시간 변환 함수 (커스텀 훅)
const useElapsedTime = (dateTime: string) => {
  const [elapsedTime, setElapsedTime] = useState<string>('');

  useEffect(() => {
    const getElapsedTime = (dateTime: string): string => {
      const now = new Date();
      const createdAt = new Date(dateTime);

      // 오늘 자정 시간 계산 (오늘 00:00:00 기준)
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      // 어제 자정 시간 계산 (어제 00:00:00 기준)
      const yesterdayMidnight = new Date(todayMidnight);
      yesterdayMidnight.setDate(todayMidnight.getDate() - 1);

      // 2일 전 자정 시간 계산
      const twoDaysAgoMidnight = new Date(todayMidnight);
      twoDaysAgoMidnight.setDate(todayMidnight.getDate() - 2);

      const diffMs = now.getTime() - createdAt.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // 오늘 자정부터 현재까지 비교
      if (createdAt >= todayMidnight) {
        if (diffMin < 1) return '방금 전';
        if (diffHour < 1) return `${diffMin}분 전`;
        return `${diffHour}시간 전`;
      }

      // 어제 자정부터 오늘 자정까지 비교
      if (createdAt >= yesterdayMidnight && createdAt < todayMidnight) {
        return '어제';
      }

      // 2일 전 자정부터 3일 전 자정까지 비교
      if (createdAt >= twoDaysAgoMidnight && createdAt < yesterdayMidnight) {
        return '2일 전';
      }

      // 3일 전부터 6일 전까지는 "3일 전", "4일 전" ... "6일 전"
      if (diffDay >= 3 && diffDay <= 6) {
        return `${diffDay}일 전`;
      }

      // 7일 이상부터는 주 단위로 처리
      const diffWeek = Math.floor(diffDay / 7);
      if (diffWeek >= 1 && diffWeek <= 3) {
        return `${diffWeek}주 전`;
      }

      // 4주 이상부터는 날짜 형식으로 출력
      return `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}`;
    };

    // 날짜 변환 함수 실행
    const elapsedTimeString = getElapsedTime(dateTime);
    setElapsedTime(elapsedTimeString);

  }, [dateTime]);

  return elapsedTime;
};

export default useElapsedTime;
