
/**
 * Format data point for bpm chart.
 * @param {any} params - data point object.
 * @returns {string} - formatted string.
 */
export function formatBpmTime(params: any) {
    const dataPoint = params[0];
    const time = dataPoint.axisValue;
    const pulse = Array.isArray(dataPoint.value) ? dataPoint.value[1] : dataPoint.value;

    const timeStr = typeof time === 'number' ? time.toFixed(2) : time;
    const pulseStr = typeof pulse === 'number' ? pulse.toFixed(2) : pulse;

    return `Время: ${timeStr}<br/>Пульс: ${pulseStr} уд/мин`;
}
/**
 * Format a diagnosis string
 * @param {Object} params - Object containing the diagnosis data
 * @returns {string} - Formatted diagnosis string
 */
export function formatDiagnosis(params: any) {
    return `
Диагноз: ${params.data.diagnosis}
Время: ${params.data.startTime.toFixed(1)} - ${params.data.endTime.toFixed(1)} сек
            `.trim();
}