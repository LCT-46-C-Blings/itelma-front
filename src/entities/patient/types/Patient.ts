import type { Appointment } from "../../appointment/types/Appointment";

export type Patient = {
    id: number;
    appointments: Appointment[];
    anamnesis: string[];
    // bloodGases: BloodGases
};

export const example: Patient = {
    id: 0,
    appointments: [{
        id: 1,
        startTime: 1758737653000,
        endTime: 1758744853000
    },
    {
        id: 2,
        startTime: 1768744853000,
        endTime: 1768752053000
    }],
    anamnesis: [
        "I своевременные оперативные роды",
        "II период родов",
        "Острая гипоксия плода",
        "Преждевременое излитие вод",
        "Привычное невынашивание беременности.",
        "Гестационный сахарный диабет на диетотерапии",
        "Наследственная тромбофилия",
        "Избыточная масса тела",
        "Хроническая герпетическая инфекция, ремиссия"
    ],
    /* bloodGases: {
        ph: 7.397,
        co2: 26.9,
        glu: 5.4,
        lac: 4.1,
        be: -7.7
    } */
}