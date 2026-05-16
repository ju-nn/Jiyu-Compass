import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, X, Plus, Check } from 'lucide-react';
import { ScenarioManager, type SavedScenario } from '../utils/scenarioManager';
import type { FireInputs } from '../utils/calculations';

interface ScenarioManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentInputs: FireInputs;
    onLoadScenario: (inputs: FireInputs) => void;
}

export const ScenarioManagementModal: React.FC<ScenarioManagementModalProps> = ({
    isOpen,
    onClose,
    currentInputs,
    onLoadScenario
}) => {
    const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
    const [newScenarioName, setNewScenarioName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            refreshScenarios();
            // デフォルト名を設定（日時）
            const now = new Date();
            setNewScenarioName(`シナリオ ${now.toLocaleDateString()} ${now.toLocaleTimeString().slice(0, 5)}`);
        }
    }, [isOpen]);

    const refreshScenarios = () => {
        setScenarios(ScenarioManager.getScenarios());
    };

    const handleSave = () => {
        if (!newScenarioName.trim()) return;

        setIsSaving(true);
        try {
            ScenarioManager.saveScenario(currentInputs, newScenarioName);
            refreshScenarios();
            setNewScenarioName(''); // Clear input or reset to next default?
            // リセット用の新しいデフォルト名
            const now = new Date();
            setNewScenarioName(`シナリオ ${now.toLocaleDateString()} ${now.toLocaleTimeString().slice(0, 5)}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('このシナリオを削除してもよろしいですか？')) {
            ScenarioManager.deleteScenario(id);
            refreshScenarios();
        }
    };

    const handleLoad = (scenario: SavedScenario) => {
        if (confirm(`シナリオ「${scenario.name}」を読み込みますか？\n（現在の入力内容は上書きされます）`)) {
            onLoadScenario(scenario.inputs);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">シナリオ管理</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Save Section */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                        <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            現在の設定を保存
                        </h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newScenarioName}
                                onChange={(e) => setNewScenarioName(e.target.value)}
                                placeholder="シナリオ名を入力..."
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !newScenarioName.trim()}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                保存
                            </button>
                        </div>
                    </div>

                    {/* List Section */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            保存済みシナリオ ({scenarios.length})
                        </h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                            {scenarios.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm italic">
                                    保存されたシナリオはありません
                                </div>
                            ) : (
                                scenarios.map(scenario => (
                                    <div
                                        key={scenario.id}
                                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {scenario.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(scenario.updatedAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleLoad(scenario)}
                                                className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors flex items-center gap-1"
                                                title="このシナリオを読み込む"
                                            >
                                                <Check className="w-3 h-3" />
                                                ロード
                                            </button>
                                            <button
                                                onClick={() => handleDelete(scenario.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                title="削除"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
