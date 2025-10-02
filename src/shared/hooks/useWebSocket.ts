import { useEffect, useRef } from 'react';

/*
TODO:
- Передавать в юрл номер визита
- socket io
*/
export function useWebSocket(wsUrl: string, onData: (data: any) => void) {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            console.log('WebSocket connected');
        };


        wsRef.current.onmessage = (event) => {
            
            try {
                const data = JSON.parse(event.data);
                if (onData) onData(data);
            } catch (e) {
                console.error('Invalid message', e);
            }
        };

        wsRef.current.onclose = () => console.log('WebSocket closed');
        wsRef.current.onerror = (err) => console.error('WebSocket error', err);

        return () => {
            wsRef.current?.close();
        };
    }, [wsUrl, onData]);
}


export async function useWebSocketDemo(wantedData: any, onData: (data: any) => void) {
    for (let data of wantedData) {
        // console.log(data);
        onData(data);
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}
