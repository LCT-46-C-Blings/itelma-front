import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

type Channel = "fhr" | "uc";

export type WSItem = { timestamp: number; value: number };

export type IncomingEvent =
    | { type: "connected"; meta: { visit_id: number; rtype: "FHR" | "UC" } }
    | { type: "snapshot"; items: WSItem[] }
    | { type: "new"; item: WSItem }
    | { type: "error"; message: string; payload?: unknown }
    | { type: "disconnect"; reason?: string }
    | { type: "reconnect"; attempt: number };

type Options = {
    baseUrl?: string; // по умолчанию http://localhost:5050
    visitId: number | string;
    loop?: boolean;   // актуально для FHR; можно передавать и всегда
    transports?: ("websocket" | "polling")[]; // по умолчанию только websocket
    extraQuery?: Record<string, string | number | boolean | undefined>;
};


export function useWebSocket(
    channel: Channel,
    onData: (ev: IncomingEvent) => void,
    {
        baseUrl = "http://localhost:5050",
        visitId,
        loop = false,
        transports = ["polling"],
        extraQuery,
    }: Options
) {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    // Полный URL неймспейса: /ws/records/fhr или /ws/records/uc
    const namespaceUrl = useMemo(
        () => `${baseUrl.replace(/\/+$/, "")}/ws/records/${channel}`,
        [baseUrl, channel]
    );

    // Готовим query для хэндшейка
    const query = useMemo(() => {
        const q: Record<string, string> = {
            // сервер ждёт именно "visit_id"
            visit_id: String(visitId),
        };
        if (loop) q.loop = "true";
        if (extraQuery) {
            for (const [k, v] of Object.entries(extraQuery)) {
                if (v !== undefined) q[k] = String(v);
            }
        }
        return q;
    }, [visitId, loop, extraQuery]);

    useEffect(() => {
        // создаём соединение с конкретным namespace
        const socket = io(namespaceUrl, {
            transports,
            query,
            // при желании можно подкрутить backoff:
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 500,
            reconnectionDelayMax: 5000,
            timeout: 10000,
        });

        socketRef.current = socket;

        // --- стандартные события сокета
        socket.on("connect", () => {
            setConnected(true);
        });

        socket.on("disconnect", (reason) => {
            setConnected(false);
            onData({ type: "disconnect", reason });
        });

        socket.io.on("reconnect_attempt", (attempt) => {
            onData({ type: "reconnect", attempt });
        });

        socket.on("connect_error", (err: any) => {
            console.log(err)
            onData({ type: "error", message: "connect_error", payload: err?.message ?? err });
        });

        // --- доменные события вашего сервера
        socket.on("error", (payload: any) => {
            const message =
                (payload && (payload.message || payload.error)) || "unknown_error";
            onData({ type: "error", message, payload });
        });

        socket.on("connected", (payload: { ok: boolean; visit_id: number; type: "FHR" | "UC" }) => {
            if (payload?.ok) {
                onData({
                    type: "connected",
                    meta: { visit_id: payload.visit_id, rtype: payload.type },
                });
            } else {
                onData({ type: "error", message: "server_not_ok", payload });
            }
        });

        // Снапшот: '<channel>:snapshot'
        socket.on(`${channel}:snapshot`, (payload: { items: WSItem[] }) => {
            onData({ type: "snapshot", items: payload?.items ?? [] });
        });

        // Новые данные: '<channel>:new'
        socket.on(`${channel}:new`, (payload: WSItem) => {
            if (payload && typeof payload.timestamp === "number") {
                onData({ type: "new", item: payload });
            }
        });

        // Очистка при размонтировании/смене параметров
        return () => {
            try {
                socket.removeAllListeners();
                socket.disconnect();
            } catch { }
            socketRef.current = null;
            setConnected(false);
        };
    }, [namespaceUrl, transports, query, channel, onData]);

    // Управляющие методы по желанию
    const disconnect = () => {
        socketRef.current?.disconnect();
    };
    const reconnect = () => {
        if (!socketRef.current) return;
        if (socketRef.current.connected) {
            socketRef.current.disconnect();
        }
        socketRef.current.connect();
    };    

    return { connected, disconnect, reconnect, socketRef: socketRef };
}
