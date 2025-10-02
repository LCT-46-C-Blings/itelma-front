import { useCallback, useMemo } from "react";
import type { Appointment } from "../../../entities/appointment/types/Appointment"
import { Select, type Option } from "../../../shared/ui/input/Select";
import { timecodeToDate } from "../../../shared/lib/formatDate";

/**
 * Appointment selector component
 * @param {Appointment[]} appointments - List of appointments
 * @param {number} selectedId - Selected appointment id
 * @param {(id: number) => void} onChangeSelectedId - Callback when selected appointment id changes
 */
const AppointmentSelector: React.FC<{
    appointments: Appointment[]
    selectedId: number;
    onChangeSelectedId: (id: number) => void;
}> = (({ appointments, selectedId, onChangeSelectedId }) => {

    const options = useMemo<Option<number>[]>(
        () => {
            const res = [{
                value: -1,
                label: 'Новый прием'
            }]
            
            return res.concat(appointments.map((a: Appointment) => ({
                value: a.id,
                label: timecodeToDate(a.startTime)
            })))
        },
        [appointments]
    );

    const handleChange = useCallback(
        (nextId: number) => onChangeSelectedId(nextId),
        [onChangeSelectedId]
    );

    return (
        <Select<number>
            defaultValue={selectedId}
            placeholder="Выберите прием"
            onChange={handleChange}
            options={options}
        />
    );
});

export default AppointmentSelector
