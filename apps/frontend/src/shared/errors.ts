interface ErrorArray {
    key: string
    value: string
}

export const ErMsg = (key: string, t: (key: string) => string): string | null => {
    const errorArray: ErrorArray[] = [
        //message
        { key: 'ErrorMsg', value: t('errorMsg') },
        { key: 'SuccessMsg', value: t('successMsg') },
        { key: 'NotConnected', value: t('notConnected') },
        //sign in
        { key: 'UnknownUsername', value: t('errors.unknownUsername') },
        { key: 'InvalidPassword', value: t('errors.invalidPassword') },
        { key: 'EmailNotVerified', value: t('errors.emailNotVerified') },
        { key: 'MissingPwd', value: t('errors.missingPwd') },
        { key: 'MissingUsername', value: t('errors.missingUsername') },
        //sign up
        { key: 'InvalidUsername', value: t('errors.invalidUsername') },
        { key: 'UsernameTaken', value: t('errors.usernameTaken') },
        { key: 'EmailTaken', value: t('errors.emailTaken') },
        { key: 'InvalidEmail', value: t('errors.invalidEmail') },
        { key: 'InvalidFirstName', value: t('errors.invalidFirstName') },
        { key: 'InvalidLastName', value: t('errors.invalidLastName') },
        { key: 'WrongEmailFormat', value: t('errors.wrongEmailFormat') },
        { key: 'InvalidDateBirth', value: t('errors.invalidDateBirth') },
        { key: 'InvalidGender', value: t('errors.invalidGender') },
        { key: 'InvalidInterest', value: t('errors.invalidInterest') },
        { key: 'InvalidPreference', value: t('errors.invalidPreference') },
        { key: 'InvalidBio', value: t('errors.invalidBio') },
        { key: 'MissingEmail', value: t('errors.missingEmail') },
        { key: 'MissingFirstName', value: t('errors.missingFirstName') },
        { key: 'MissingLastName', value: t('errors.missingLastName') },
        { key: 'MissingDateBirth', value: t('errors.missingDateBirth') },
        { key: 'MissingGender', value: t('errors.missingGender') },
        { key: 'WeakPwd', value: t('errors.weakPwd') },
        { key: 'InvalidId', value: t('errors.invalidId') },
        { key: 'AlreadyValid', value: t('errors.alreadyValid') },
        //images
        { key: 'InvalidPhotoExtension', value: t('errors.invalidPhotoExtension') },
        { key: 'EmptyPhoto', value: t('errors.emptyPhoto') },
        { key: 'PhotoTooBig', value: t('errors.photoTooBig') },
        { key: 'PhotoNbLimit', value: t('errors.photoNbLimit') },
        { key: 'PhotoResolution', value: t('errors.photoResolution') },
        //request image
        { key: 'EmptyPhotoId', value: t('errors.emptyPhotoId') },
        { key: 'InvalidPhotoId', value: t('errors.invalidPhotoId') },
    ]

    const item = errorArray.find((el) => el.key === key)
    return item ? item.value : null
}
