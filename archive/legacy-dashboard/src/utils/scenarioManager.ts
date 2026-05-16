import { safeGetLocalStorage, safeSetLocalStorage } from './storage';
import type { FireInputs } from './calculations';

// ストレージキー
const STORAGE_KEY_SCENARIOS = 'fire_scenarios';

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export interface SavedScenario {
    id: string;
    name: string;
    description?: string;
    createdAt: number;
    updatedAt: number;
    inputs: FireInputs;
    isActive?: boolean; // 現在選択中のシナリオかどうか（UI表示用）
}

export class ScenarioManager {
    /**
     * 全ての保存済みシナリオを取得
     */
    static getScenarios(): SavedScenario[] {
        const scenarios = safeGetLocalStorage<SavedScenario[]>(STORAGE_KEY_SCENARIOS, []);
        return scenarios.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    /**
     * シナリオを保存（新規作成または更新）
     * IDが指定されていれば更新、なければ新規作成
     */
    static saveScenario(inputs: FireInputs, name: string, description?: string, id?: string): SavedScenario {
        const scenarios = this.getScenarios();
        const now = Date.now();

        let savedScenario: SavedScenario;

        if (id) {
            // 既存更新
            const index = scenarios.findIndex(s => s.id === id);
            if (index >= 0) {
                savedScenario = {
                    ...scenarios[index],
                    name,
                    description,
                    inputs,
                    updatedAt: now
                };
                scenarios[index] = savedScenario;
            } else {
                // ID指定があるが見つからない場合は新規扱い（あるいはエラーでも良いが安全側に倒す）
                savedScenario = {
                    id: generateId(),
                    name,
                    description,
                    createdAt: now,
                    updatedAt: now,
                    inputs
                };
                scenarios.push(savedScenario);
            }
        } else {
            // 新規作成
            savedScenario = {
                id: generateId(),
                name,
                description,
                createdAt: now,
                updatedAt: now,
                inputs
            };
            scenarios.push(savedScenario);
        }

        safeSetLocalStorage(STORAGE_KEY_SCENARIOS, scenarios);
        return savedScenario;
    }

    /**
     * シナリオを削除
     */
    static deleteScenario(id: string): boolean {
        const scenarios = this.getScenarios();
        const initialLength = scenarios.length;
        const filtered = scenarios.filter(s => s.id !== id);

        if (filtered.length !== initialLength) {
            safeSetLocalStorage(STORAGE_KEY_SCENARIOS, filtered);
            return true;
        }
        return false;
    }

    /**
     * シナリオのバリデーション（簡易版）
     * 必須項目が含まれているか確認
     */
    static validateScenario(scenario: Partial<SavedScenario>): boolean {
        if (!scenario.name || !scenario.inputs) return false;
        // inputsの中身も簡易チェック
        if (typeof scenario.inputs.currentAge !== 'number') return false;
        return true;
    }
}
