export const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
}

export const range = (start: number, end: number): number[] => {
    let res = [start]
    if (start === end) return res
    const inc = Math.sign(end - start)
    while (true) {
        start += inc
        res.push(start)
        if (start === end) return res
    }
}
