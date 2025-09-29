import { Select, type Option } from "../../../shared/input/Select";

export type Appointment = {
    id: number;
    startTime: number; // ms timestamp
    endTime: number;   // ms timestamp
};

export type AppointmentSelectorProps = {
    appointments: Appointment[];
    value?: Appointment;
    defaultValueId?: number;
    onChange?: (a: Appointment) => void;
    locale?: string; // по умолчанию "ru-RU"
    widthPx?: number;
    withTime?: boolean; // если true — показываем время
};

function fmt(ts: number, locale = "ru-RU", withTime = false) {
    const d = new Date(ts);
    const base: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
    };
    const opt: Intl.DateTimeFormatOptions = withTime
        ? { ...base, hour: "2-digit", minute: "2-digit" }
        : base;
    return d.toLocaleDateString(locale, opt);
}

export default function AppointmentSelector({
    appointments,
    value,
    defaultValueId,
    onChange,
    locale = "ru-RU",
    widthPx = 338,
    withTime = false,
}: AppointmentSelectorProps) {
    const options: Option<Appointment>[] = appointments.map((a) => ({
        label: fmt(a.startTime, locale, withTime),
        value: a,
    }));

    const defaultValue =
        defaultValueId !== undefined
            ? appointments.find((a) => a.id === defaultValueId)
            : undefined;

    return (
        <Select<Appointment>
            options={options}
            value={value}
            defaultValue={defaultValue}
            onChange={(v) => onChange?.(v)}
            placeholder="Выберите дату"
            widthPx={widthPx}
            getKey={(v) => v.id}
            ariaLabel="Выбор даты записи"
        />
    );
}
