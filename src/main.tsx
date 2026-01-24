import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize Facebook Pixel if ID is present
const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
if (PIXEL_ID && typeof window !== 'undefined') {
    if (window.fbq) {
        window.fbq('init', PIXEL_ID);
        window.fbq('track', 'PageView');
    }
}

createRoot(document.getElementById("root")!).render(<App />);
