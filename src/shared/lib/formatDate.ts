export function timecodeToDate(timecode: number): string {
    console.log(timecode)
    if (!timecode) return '';
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }).format(new Date(timecode * 1000));
}

export function timecodeToTime(timecode: number): string {
    console.log(timecode);
    if (!timecode) return '';
    return new Intl.DateTimeFormat('ru-RU', {
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(timecode * 1000));
}