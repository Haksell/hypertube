export function compute18Y(): string {
    const today = new Date()
    const day: string = `${today.getDate() < 9 ? '0' : ''}${today.getDate()}`
    const month: string = `${today.getMonth() + 1 < 9 ? '0' : ''}${today.getMonth() + 1}`
    const dateString: string = `${today.getFullYear() - 17}-${month}-${day}`
    return dateString
}

export function formatDateYYYYMMDD(dateIn: Date): string {
    const dateObj = new Date(dateIn)
    const day: string = `${dateObj.getDate() <= 9 ? '0' : ''}${dateObj.getDate()}`
    const month: string = `${dateObj.getMonth() + 1 <= 9 ? '0' : ''}${dateObj.getMonth() + 1}`
    const dateString: string = `${dateObj.getFullYear()}-${month}-${day}`
    return dateString
}
