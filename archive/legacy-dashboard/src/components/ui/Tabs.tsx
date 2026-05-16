import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<{ defaultValue: string, children: React.ReactNode, className?: string }> = ({ defaultValue, children, className }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

export const TabsList: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <div className={`flex bg-slate-100 p-1 rounded-lg ${className}`}>
            {children}
        </div>
    );
};

export const TabsTrigger: React.FC<{ value: string, children: React.ReactNode, className?: string }> = ({ value, children, className }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const isActive = context.activeTab === value;

    return (
        <button
            onClick={() => context.setActiveTab(value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                } ${className}`}
        >
            {children}
        </button>
    );
};

export const TabsContent: React.FC<{ value: string, children: React.ReactNode, className?: string }> = ({ value, children, className }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    if (context.activeTab !== value) return null;

    return <div className={className}>{children}</div>;
};
