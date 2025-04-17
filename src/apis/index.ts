import axios, { AxiosError, AxiosResponse } from 'axios';
import IdCheckRequestDto from './dto/request/auth/user-id-check.request.dto';
import ResponseDto from './dto/response/response.dto';
import UserIdCheckRequestDto from './dto/request/auth/user-id-check.request.dto';
import UserNicknameCheckRequestDto from './dto/request/auth/user-nickname-check.request.dto';
import UserEmailCheckRequestDto from './dto/request/auth/user-email-check.request.dto';
import UserPhoneNumberCheckRequestDto from './dto/request/auth/user-phone-number-check.request.dto';
import UserSignUpRequestDto from './dto/request/auth/user-sign-up.request.dto';
import UserSignInRequestDto from './dto/request/auth/user-sign-in.request.dto';

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

const AUTH_MODULE_URL = `${API_DOMAIN}/api/v1/auth`;

const ID_CHECK_URL = `${AUTH_MODULE_URL}/id/check`;
const NICKNAME_CHECK_URL = `${AUTH_MODULE_URL}/nickname/check`;
const EMAIL_CHECK_URL = `${AUTH_MODULE_URL}/email/check`;
const PHONE_NUMBER_CHECK_URL = `${AUTH_MODULE_URL}/phone/check`;

const SIGN_UP_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_URL = `${AUTH_MODULE_URL}/sign-in`;

export const userIdCheckRequest = async (requestBody: UserIdCheckRequestDto) => {
    const responseBody = await axios
        .post(ID_CHECK_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

export const userNicknameCheckRequest = async (requestBody: UserNicknameCheckRequestDto) => {
    const responseBody = await axios
        .post(NICKNAME_CHECK_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

export const userEmailCheckRequest = async (requestBody: UserEmailCheckRequestDto) => {
    const responseBody = await axios
        .post(EMAIL_CHECK_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};
export const userPhoneNumberCheckRequest = async (requestBody: UserPhoneNumberCheckRequestDto) => {
    const responseBody = await axios
        .post(PHONE_NUMBER_CHECK_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

export const userSignUpRequest = async (requestBody: UserSignUpRequestDto) => {
    const responseBody = await axios
        .post(SIGN_UP_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

export const userSignInRequest = async (requestBody: UserSignInRequestDto) => {
    const responseBody = await axios
        .post(SIGN_IN_URL, requestBody, { withCredentials: true })
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

const responseSuccessHandler = <T = ResponseDto>(response: AxiosResponse<T>) => {
    // response.data: Response Body
    const { data } = response;
    return data;
};

const responseErrorHandler = (error: AxiosError<ResponseDto>) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data;
};
