import React, { useState } from 'react';
import { X, Calendar, Briefcase, Trash2, CircleDollarSign } from 'lucide-react';
import type { FireInputs, LifeEvent } from '../utils/calculations';

interface LifeEventSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    inputs: FireInputs;
    onUpdate: (updates: Partial<FireInputs>) => void;
}

// 簡易IDジェネレータ（uuidがない場合用）
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const PRESET_EVENTS: Partial<LifeEvent>[] = [
    { name: '結婚', amount: 3000000, isRecurring: false },
    { name: '住宅購入（頭金）', amount: 5000000, isRecurring: false },
    { name: '車買い替え', amount: 2000000, isRecurring: false },
    { name: '子供の教育費（大学）', amount: 1500000, isRecurring: true, duration: 4 },
    { name: '海外旅行', amount: 500000, isRecurring: false },
    { name: 'リフォーム', amount: 3000000, isRecurring: false },
];

export const LifeEventSettingsModal: React.FC<LifeEventSettingsModalProps> = ({
    isOpen,
    onClose,
    inputs,
    onUpdate
}) => {
    const [activeTab, setActiveTab] = useState<'events' | 'career'>('events');
    const [events, setEvents] = useState<LifeEvent[]>(inputs.lifeEvents || []);

    // Career State
    const [jobName, setJobName] = useState(inputs.postRetirementJob || '');
    const [monthlyIncome, setMonthlyIncome] = useState(inputs.postRetirementIncome || 0);

    // New Event State
    const [newEvent, setNewEvent] = useState<Partial<LifeEvent>>({
        name: '',
        amount: 0,
        age: inputs.currentAge + 1,
        isRecurring: false,
        duration: 1,
        isIncome: false
    });

    const handleAddEvent = () => {
        if (!newEvent.name || !newEvent.amount) return;

        const event: LifeEvent = {
            id: generateId(),
            name: newEvent.name,
            amount: Number(newEvent.amount),
            age: Number(newEvent.age),
            isRecurring: newEvent.isRecurring,
            duration: newEvent.isRecurring ? Number(newEvent.duration) : 1,
            isIncome: newEvent.isIncome
        };

        const updatedEvents = [...events, event].sort((a, b) => a.age - b.age);
        setEvents(updatedEvents);

        // Reset form (keep age for convenience)
        setNewEvent({
            ...newEvent,
            name: '',
            amount: 0
        });
    };

    const handleRemoveEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const handleSave = () => {
        onUpdate({
            lifeEvents: events,
            postRetirementJob: jobName,
            postRetirementIncome: monthlyIncome
        });
        onClose();
    };

    const loadPreset = (preset: Partial<LifeEvent>) => {
        setNewEvent({
            ...newEvent,
            name: preset.name,
            amount: preset.amount,
            isRecurring: preset.isRecurring,
            duration: preset.duration || 1
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">ライフプラン詳細設定</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'events'
                            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        ライフイベント
                    </button>
                    <button
                        onClick={() => setActiveTab('career')}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'career'
                            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        リタイア後の仕事
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {activeTab === 'events' ? (
                        <div className="space-y-6">
                            {/* Input Form */}
                            <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">新しいイベントを追加</h3>
                                    <div className="flex gap-1">
                                        {PRESET_EVENTS.map(preset => (
                                            <button
                                                key={preset.name}
                                                onClick={() => loadPreset(preset)}
                                                className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                            >
                                                {preset.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">イベント名</label>
                                        <input
                                            type="text"
                                            value={newEvent.name}
                                            onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                            placeholder="例: 住宅購入"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">金額 (万円)</label>
                                        <input
                                            type="number"
                                            value={Math.round((newEvent.amount || 0) / 10000)}
                                            onChange={e => setNewEvent({ ...newEvent, amount: Number(e.target.value) * 10000 })}
                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">発生年齢</label>
                                        <input
                                            type="number"
                                            value={newEvent.age}
                                            onChange={e => setNewEvent({ ...newEvent, age: Number(e.target.value) })}
                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                            min={inputs.currentAge}
                                            max={100}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newEvent.isRecurring}
                                                onChange={e => setNewEvent({ ...newEvent, isRecurring: e.target.checked })}
                                                className="rounded text-indigo-600"
                                            />
                                            <span className="text-sm">継続的に発生</span>
                                        </label>
                                        {newEvent.isRecurring && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={newEvent.duration}
                                                    onChange={e => setNewEvent({ ...newEvent, duration: Number(e.target.value) })}
                                                    className="w-16 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                                    min={1}
                                                />
                                                <span className="text-sm">年間</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddEvent}
                                    disabled={!newEvent.name || !newEvent.amount}
                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                                >
                                    イベントを追加
                                </button>
                            </div>

                            {/* Event List */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">登録済みイベント</h3>
                                {events.length === 0 ? (
                                    <p className="text-center text-gray-400 py-4 text-sm">イベントはまだ登録されていません</p>
                                ) : (
                                    events.map(event => (
                                        <div key={event.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{event.age}歳</span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-gray-100">{event.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {event.isRecurring ? `${event.duration}年間継続` : '一回限り'} • {(event.amount / 10000).toLocaleString()}万円
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveEvent(event.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <CircleDollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">セミリタイア後のキャリアプラン</h3>
                                </div>
                                <p className="text-sm text-indigo-700 dark:text-indigo-400 mb-6">
                                    FIRE達成後、完全に仕事を辞めるのではなく、好きな仕事で少しだけ収入を得る「サイドFIRE」や「バリスタFIRE」を目指す場合の想定収入を設定します。
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">想定する仕事・働き方</label>
                                        <input
                                            type="text"
                                            value={jobName}
                                            onChange={e => setJobName(e.target.value)}
                                            placeholder="例: フリーランスエンジニア、カフェ店員、週3勤務"
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">想定月収 (万円)</label>
                                        <input
                                            type="number"
                                            value={monthlyIncome / 10000}
                                            onChange={e => setMonthlyIncome(Number(e.target.value) * 10000)}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg font-bold"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">※ この収入はリタイア年齢到達後、年金受給開始までの期間に適用されます。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors transform hover:translate-y-px"
                    >
                        設定を反映する
                    </button>
                </div>
            </div>
        </div>
    );
};
