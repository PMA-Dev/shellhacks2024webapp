import { GalacticMetadata } from '@/models';
import { createContext, useContext, useState } from 'react';

interface GalaxyContextType {
    galaxy: GalacticMetadata | null;
    setGalaxy: (galaxy: GalacticMetadata | null) => void;
}

const GalaxyContext = createContext<GalaxyContextType | undefined>(undefined);

export const useGalaxy = () => {
    const context = useContext(GalaxyContext);
    if (!context) {
        throw new Error('useGalaxy must be used within a GalaxyProvider');
    }
    return context;
};

export const GalaxyProvider = ({ children }: { children: React.ReactNode }) => {
    const [galaxy, setGalaxy] = useState<GalacticMetadata | null>(null);

    return (
        <GalaxyContext.Provider value={{ galaxy, setGalaxy }}>
            {children}
        </GalaxyContext.Provider>
    );
};
