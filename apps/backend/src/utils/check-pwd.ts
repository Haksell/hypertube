export function isPassword(password: string): boolean {
    if (
        password.length >= 5 &&
        password.length <= 15 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    ) {
        return true
    } else {
        return false
    }
}
