import { useEffect, useRef } from 'react';

/*
TODO:
- Передавать в юрл номер визита
- socket io
*/

/**
 * Establishes a WebSocket connection to the given URL and calls
 * `onData` whenever a message is received from the server.
 *
 * @param {string} wsUrl - The URL of the WebSocket endpoint
 * @param {(data: any) => void} onData - A callback function to be called
 * whenever a message is received from the server
 *
 * @returns {() => void} A function to close the WebSocket connection
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



/**
 * Simulates a WebSocket stream by calling the given callback function with
 * the given data array, with a delay of 1ms between each call.
 *
 * @param {any[]} wantedData - An array of data that will be passed to the callback function
 * @param {(data: any) => void} onData - The callback function to be called
 */
export async function useWebSocketDemo(wantedData: any, onData: (data: any) => void) {
/**
 * A helper function to simulate a WebSocket stream by calling the given
 * callback function with the given data array, with a delay of 1ms
 * between each call.
 *
 * @param {any[]} wantedData - An array of data that will be passed to the callback function
 * @param {(data: any) => void} onData - The callback function to be called
 */
    for (let data of wantedData) {
        // console.log(data);
        onData(data);
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}
