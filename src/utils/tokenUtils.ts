// src/utils/tokenUtils.ts

// function: Authorization Bearer 헤더 생성
export const bearerAuthorization = (accessToken: string) => ({
    headers: { Authorization: `Bearer ${accessToken}` }
  });