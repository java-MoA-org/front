export default interface UserSignUpRequestDto {
    userId: string;
    userPassword: string;
    userNickname: string;
    userEmail: string;
    userPhoneNumber: string;
    joinType: string;
    profileImage: string;
    userIntroduce: string;
    interests: {
        userInterestTrip: boolean;
        userInterestGame: boolean;
        userInterestFashion: boolean;
        userInterestWorkout: boolean;
        userInterestFood: boolean;
        userInterestMusic: boolean;
        userInterestEconomics: boolean;
        userInterestNull: boolean;
    };
}
