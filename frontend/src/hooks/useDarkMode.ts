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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isClient) return;
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [darkMode]);

    return { darkMode, setDarkMode };
}
