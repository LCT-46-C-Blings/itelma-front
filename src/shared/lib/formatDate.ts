

/**
 * Convert a timecode to a date string in the format "dd MMMM yyyy".
 * A timecode is a number of milliseconds since the Unix epoch.
 * If the timecode is 0 or undefined, an empty string is returned.
 * @param {number} timecode - the timecode to convert
 * @returns {string} - the date string
 */
export function timecodeToDate(timecode: number): string {
    // console.log(timecode)
    if (!timecode) return '';
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }).format(new Date(timecode * 1000));
}

/**
 * Formats a timecode (milliseconds since the Unix epoch) to a human-readable time string.
 * @param {number} timecode - Timecode to format
 * @returns {string} Formatted time string
 */
export function timecodeToTime(timecode: number): string {
    // console.log(timecode);
    if (!timecode) return '';
    return new Intl.DateTimeFormat('ru-RU', {
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(timecode * 1000));
}