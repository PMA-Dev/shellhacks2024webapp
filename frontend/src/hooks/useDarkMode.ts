import { useEffect, useState } from 'react';

export default function useDarkMode() {
    const isClient = typeof window !== 'undefined';

    const getInitialDarkMode = () => {
        if (!isClient) return false;
        const storedValue = localStorage.getItem('darkMode');
        return storedValue !== null
            ? JSON.parse(storedValue)
            : window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const [darkMode, setDarkMode] = useState(getInitialDarkMode);

    useEffect(() => {
        if (!isClient) return;

        const darkModeMediaQuery = window.matchMedia(
            '(prefers-color-scheme: dark)'
        );
        const handleDarkModeChange = (event) => setDarkMode(event.matches);

        darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
        return () =>
            darkModeMediaQuery.removeEventListener(
                'change',
                handleDarkModeChange
            );
    }, []);

    useEffect(() => {
        if (!isClient) return;
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    return { darkMode, setDarkMode };
}
