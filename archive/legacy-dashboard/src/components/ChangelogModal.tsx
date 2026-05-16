import React from 'react';
import { X, Sparkles, Wrench, FileText } from 'lucide-react';
import { updates, type UpdateItem } from '../data/updates';

interface ChangelogModalProps {
    onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
    const getIcon = (type: UpdateItem['type']) => {
        switch (type) {
            case 'feature': return <Sparkles className="w-4 h-4 text-amber-500" />;
            case 'fix': return <Wrench className="w-4 h-4 text-slate-500" />;
            case 'content': return <FileText className="w-4 h-4 text-blue-500" />;
        }
    };

    const getBadgeColor = (type: UpdateItem['type']) => {
        switch (type) {
            case 'feature': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'fix': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'content': return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getLabel = (type: UpdateItem['type']) => {
        switch (type) {
            case 'feature': return '新機能';
            case 'fix': return '修正';
            case 'content': return 'コンテンツ';
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="bg-slate-100 p-1.5 rounded-lg">🔔</span>
                        更新履歴
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                        {updates.map((item, index) => (
                            <div key={item.id} className="relative pl-8">
                                {/* Dot */}
                                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${index === 0 ? 'bg-blue-500' : 'bg-slate-300'
                                    }`} />

                                {/* Date */}
                                <div className="mb-1 flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 tracking-wider">
                                        {item.date}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeColor(item.type)} uppercase tracking-wide flex items-center gap-1`}>
                                        {getIcon(item.type)}
                                        {getLabel(item.type)}
                                    </span>
                                </div>

                                {/* Title & Desc */}
                                <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                                {item.description && (
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400 shrink-0">
                    ジユウノコンパス - Version 1.2
                </div>
            </div>
        </div>
    );
};
