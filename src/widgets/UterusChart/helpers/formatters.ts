/**
 * Format data point for uterus chart.
 * @param {any} params - data point object.
 * @returns {string} - formatted string.
 */
export function formatUterusTime(params: any) {
    const dataPoint = params[0];
    const time = dataPoint.axisValue;
    const pulse = Array.isArray(dataPoint.value) ? dataPoint.value[1] : dataPoint.value;

    const timeStr = typeof time === 'number' ? time.toFixed(2) : time;
    const pulseStr = typeof pulse === 'number' ? pulse.toFixed(2) : pulse;

    return `Время: ${timeStr}<br/>Схватки: ${pulseStr} уд/мин`;
}
