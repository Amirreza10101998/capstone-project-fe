import React, { createContext, useContext, useState } from 'react';

interface SwipeProviderProps {
    children: React.ReactNode;
}

interface SwipeContextValue {
    onSwipe: (direction: string) => void;
}

const SwipeContext = createContext<SwipeContextValue | undefined>(undefined);

export const useSwipe = () => {
    const context = useContext(SwipeContext);
    if (!context) {
        throw new Error('useSwipe must be used within a SwipeProvider');
    }
    return context;
};

export const SwipeProvider: React.FC<SwipeProviderProps> = ({ children }) => {
    const [lastSwipeDirection, setLastSwipeDirection] = useState<string | null>(null);

    const onSwipe = (direction: string) => {
        setLastSwipeDirection(direction);
    };

    return (
        <SwipeContext.Provider value={{ onSwipe }}>{children}</SwipeContext.Provider>
    );
};
