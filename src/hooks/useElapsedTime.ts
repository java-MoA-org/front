import { useState, useEffect } from 'react';

// component: 작성 시간 변환 커스텀 훅 //
const useElapsedTime = (dateTime: string) => {
  
  // state: 경과 시간 저장 상태 //
  const [elapsedTime, setElapsedTime] = useState<string>('');

  // effect: `dateTime` 변경 시마다 경과 시간 계산 //
  useEffect(() => {

    // function: 작성 시간을 기준으로 경과 시간 계산 함수 //
    const getElapsedTime = (dateTime: string): string => {

      // object: 현재 시간 객체 //
      const now = new Date();

      // object: 작성 시간 객체 //
      const createdAt = new Date(dateTime);

      // object: 오늘 자정 기준 시간 객체 //
      const todayMidnight = new Date(now);
      todayMidnight.setHours(0, 0, 0, 0); 

      // object: 어제 자정 기준 시간 객체 //
      const yesterdayMidnight = new Date(todayMidnight);
      yesterdayMidnight.setDate(todayMidnight.getDate() - 1);

      // object: 이틀 전 자정 기준 시간 객체 //
      const twoDaysAgoMidnight = new Date(todayMidnight);
      twoDaysAgoMidnight.setDate(todayMidnight.getDate() - 2);

      // object: 삼일 전 자정 기준 시간 객체 //
      const threeDaysAgoMidnight = new Date(todayMidnight);
      threeDaysAgoMidnight.setDate(todayMidnight.getDate() - 3);

      // object: 작성 날짜만 추출한 객체 //
      const createdAtDateOnly = new Date(createdAt);
      createdAtDateOnly.setHours(0, 0, 0, 0); 

      // object: 현재 시간과 작성 시간 차이 (밀리초) //
      const diffMs = now.getTime() - createdAt.getTime();

      // object: 차이를 초 단위로 변환 //
      const diffSec = Math.floor(diffMs / 1000); 

      // object: 차이를 분 단위로 변환 //
      const diffMin = Math.floor(diffSec / 60); 

      // object: 차이를 시간 단위로 변환 //
      const diffHour = Math.floor(diffMin / 60); 

      // object: 차이를 일 단위로 변환 //
      const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)); 

      // condition: 오늘 자정 이후인 경우 //
      if (createdAtDateOnly.getTime() === todayMidnight.getTime()) {
        if (diffMin < 1) return '방금 전';
        if (diffHour < 1) return `${diffMin}분 전`;
        return `${diffHour}시간 전`;
      }

      // condition: 어제 자정 이후인 경우 //
      if (createdAtDateOnly.getTime() === yesterdayMidnight.getTime()) {
        return '어제';
      }

      // condition: 이틀 전 자정 이후인 경우 //
      if (createdAtDateOnly.getTime() === twoDaysAgoMidnight.getTime()) {
        return '2일 전';
      }

      // condition: 삼일 전 자정 이후인 경우 //
      if (createdAtDateOnly.getTime() === threeDaysAgoMidnight.getTime()) {
        return '3일 전';
      }

      // condition: 4일 이상 6일 이내인 경우 //
      if (diffDay >= 4 && diffDay <= 6) {
        return `${diffDay}일 전`;
      }

      // object: 주 단위 계산 //
      const diffWeek = Math.floor(diffDay / 7); 

      // condition: 1주 이상 3주 이내인 경우 //
      if (diffWeek >= 1 && diffWeek <= 3) {
        return `${diffWeek}주 전`;
      }

      return `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}`; 
    };

    // effect: 경과 시간 계산 //
    const elapsedTimeString = getElapsedTime(dateTime);

    // state 업데이트 //
    setElapsedTime(elapsedTimeString);

  }, [dateTime]);

  // 반환: 경과 시간 //
  return elapsedTime;
};

export default useElapsedTime;
