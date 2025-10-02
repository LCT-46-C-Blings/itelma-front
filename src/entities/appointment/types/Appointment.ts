/**
 * @typedef {Object} Appointment
 * @property {number} id - Unique identifier of the appointment
 * @property {number} startTime - Start time of the appointment in milliseconds since the Unix epoch
 * @property {number|undefined} endTime - End time of the appointment in milliseconds since the Unix epoch
 */
export type Appointment = {
    id: number,
    startTime: number,
    endTime: number | undefined
}