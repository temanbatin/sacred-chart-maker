/// <reference types="vite/client" />

interface Window {
    fbq: (event: string, eventName: string, params?: Record<string, any>) => void;
}

