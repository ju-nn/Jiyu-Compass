import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI to notify the user they can add to home screen
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    // Auto-minimize after 10 seconds
    useEffect(() => {
        if (isVisible && !isCompact) {
            const timer = setTimeout(() => {
                setIsCompact(true);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, isCompact]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 animate-in slide-in-from-bottom-5 duration-300">
            {isCompact ? (
                // Compact mode - just an icon button
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 rounded-full shadow-lg ml-auto max-w-fit cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setIsCompact(false)}
                >
                    <Download className="w-5 h-5" />
                </div>
            ) : (
                // Full mode
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-sm ml-auto">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Download className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-sm">アプリをインストール</h3>
                        <p className="text-xs text-blue-100">ホーム画面に追加して、オフラインでもFIRE計画を確認できます。</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleInstallClick}
                            className="px-3 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            追加
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
