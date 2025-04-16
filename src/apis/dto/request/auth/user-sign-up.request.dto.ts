export default interface UserSignUpRequestDto {
    userId: string;
    userPassword: string;
    userNickname: string;
    userEmail: string;
    userPhoneNumber: string;
    joinType: string;
    profileImage: string;
    userIntroduce: string;
}
