// Phase 2 データ永続化システム - 分析データの管理

import { safeGetLocalStorage, safeSetLocalStorage } from './storage';
import type { AnalyticsData, MonthlyData, Goal, Milestone } from './analyticsSystem';

// ストレージキー定数
const STORAGE_KEYS = {
  ANALYTICS_DATA: 'phase2_analytics_data',
  USER_PREFERENCES: 'phase2_user_preferences',
  LAST_SYNC: 'phase2_last_sync'
} as const;

// ユーザー設定インターフェース
export interface UserPreferences {
  enableAnimations: boolean;
  enableSounds: boolean;
  autoClaimRewards: boolean;
  notificationSettings: {
    analysisReports: boolean;
  };
  privacySettings: {
    animateData: boolean;
  };
}

// デフォルト設定
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  enableAnimations: true,
  enableSounds: true,
  autoClaimRewards: false,
  notificationSettings: {
    analysisReports: true
  },
  privacySettings: {
    animateData: true
  }
};

// 分析データ管理クラス
export class AnalyticsDataManager {
  /**
   * 分析データを取得
   */
  static getAnalyticsData(): AnalyticsData {
    const defaultData: AnalyticsData = {
      userId: 'current_user',
      monthlyData: [],
      lastAnalysis: new Date(),
      goals: [],
      milestones: []
    };

    const data = safeGetLocalStorage(STORAGE_KEYS.ANALYTICS_DATA, defaultData);

    // 日付文字列をDateオブジェクトに変換
    return {
      ...data,
      lastAnalysis: new Date(data.lastAnalysis),
      goals: data.goals.map((g: any) => ({
        ...g,
        targetDate: new Date(g.targetDate)
      })),
      milestones: data.milestones.map((m: any) => ({
        ...m,
        achievedAt: new Date(m.achievedAt)
      }))
    };
  }

  /**
   * 分析データを保存
   */
  static saveAnalyticsData(data: AnalyticsData): boolean {
    try {
      safeSetLocalStorage(STORAGE_KEYS.ANALYTICS_DATA, data);
      return true;
    } catch (error) {
      console.error('Failed to save analytics data:', error);
      return false;
    }
  }

  /**
   * 月次データを追加
   */
  static addMonthlyData(monthlyData: MonthlyData): boolean {
    try {
      const currentData = this.getAnalyticsData();

      // 同じ月のデータは上書き
      const existingIndex = currentData.monthlyData.findIndex(d => d.month === monthlyData.month);

      if (existingIndex >= 0) {
        currentData.monthlyData[existingIndex] = monthlyData;
      } else {
        currentData.monthlyData.push(monthlyData);
      }

      // 月次データは最新24ヶ月まで保持
      currentData.monthlyData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
      if (currentData.monthlyData.length > 24) {
        currentData.monthlyData = currentData.monthlyData.slice(-24);
      }

      currentData.lastAnalysis = new Date();

      return this.saveAnalyticsData(currentData);
    } catch (error) {
      console.error('Failed to add monthly data:', error);
      return false;
    }
  }

  /**
   * 目標を追加
   */
  static addGoal(goal: Goal): boolean {
    try {
      const currentData = this.getAnalyticsData();
      currentData.goals.push(goal);

      return this.saveAnalyticsData(currentData);
    } catch (error) {
      console.error('Failed to add goal:', error);
      return false;
    }
  }

  /**
   * 目標を更新
   */
  static updateGoal(goalId: string, updates: Partial<Goal>): boolean {
    try {
      const currentData = this.getAnalyticsData();
      const goalIndex = currentData.goals.findIndex(g => g.id === goalId);

      if (goalIndex >= 0) {
        currentData.goals[goalIndex] = { ...currentData.goals[goalIndex], ...updates };
        return this.saveAnalyticsData(currentData);
      }

      return false;
    } catch (error) {
      console.error('Failed to update goal:', error);
      return false;
    }
  }

  /**
   * マイルストーンを追加
   */
  static addMilestone(milestone: Milestone): boolean {
    try {
      const currentData = this.getAnalyticsData();
      currentData.milestones.push(milestone);

      // マイルストーンは最新50件まで保持
      if (currentData.milestones.length > 50) {
        currentData.milestones.sort((a, b) => b.achievedAt.getTime() - a.achievedAt.getTime());
        currentData.milestones = currentData.milestones.slice(0, 50);
      }

      return this.saveAnalyticsData(currentData);
    } catch (error) {
      console.error('Failed to add milestone:', error);
      return false;
    }
  }
}

// ユーザー設定管理クラス
export class UserPreferencesManager {
  /**
   * ユーザー設定を取得
   */
  static getUserPreferences(): UserPreferences {
    return safeGetLocalStorage(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
  }

  /**
   * ユーザー設定を保存
   */
  static saveUserPreferences(preferences: UserPreferences): boolean {
    try {
      safeSetLocalStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
      return true;
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      return false;
    }
  }

  /**
   * 特定の設定を更新
   */
  static updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): boolean {
    try {
      const currentPreferences = this.getUserPreferences();
      currentPreferences[key] = value;
      return this.saveUserPreferences(currentPreferences);
    } catch (error) {
      console.error('Failed to update preference:', error);
      return false;
    }
  }
}

// データ同期管理クラス
export class DataSyncManager {
  /**
   * 最後の同期時刻を取得
   */
  static getLastSyncTime(): Date {
    const timestamp = safeGetLocalStorage(STORAGE_KEYS.LAST_SYNC, Date.now());
    return new Date(timestamp);
  }

  /**
   * 同期時刻を更新
   */
  static updateSyncTime(): boolean {
    try {
      safeSetLocalStorage(STORAGE_KEYS.LAST_SYNC, Date.now());
      return true;
    } catch (error) {
      console.error('Failed to update sync time:', error);
      return false;
    }
  }

  /**
   * 全データをエクスポート
   */
  static exportAllData(): string {
    try {
      const exportData = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        analyticsData: AnalyticsDataManager.getAnalyticsData(),
        userPreferences: UserPreferencesManager.getUserPreferences(),
        lastSync: this.getLastSyncTime()
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '';
    }
  }

  /**
   * データをインポート
   */
  static importAllData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);

      // バージョンチェック
      if (importData.version !== '2.0') {
        console.warn('Unsupported data version:', importData.version);
        return false;
      }

      // データを順次インポート
      if (importData.analyticsData) {
        AnalyticsDataManager.saveAnalyticsData(importData.analyticsData);
      }

      if (importData.userPreferences) {
        UserPreferencesManager.saveUserPreferences(importData.userPreferences);
      }

      this.updateSyncTime();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * データを安全に初期化（破損時の復旧用）
   */
  static safeInitializeData(): boolean {
    try {
      // 破損したデータをバックアップ
      const corruptedData = {
        timestamp: new Date().toISOString(),
        analyticsData: safeGetLocalStorage(STORAGE_KEYS.ANALYTICS_DATA, null),
        userPreferences: safeGetLocalStorage(STORAGE_KEYS.USER_PREFERENCES, null)
      };

      safeSetLocalStorage('corrupted_data_backup', corruptedData);

      // デフォルト値で初期化
      UserPreferencesManager.saveUserPreferences(DEFAULT_USER_PREFERENCES);

      // 分析データは空で初期化
      AnalyticsDataManager.saveAnalyticsData({
        userId: 'current_user',
        monthlyData: [],
        lastAnalysis: new Date(),
        goals: [],
        milestones: []
      });

      this.updateSyncTime();
      return true;
    } catch (error) {
      console.error('Failed to safely initialize data:', error);
      return false;
    }
  }

  /**
   * データ整合性をチェック
   */
  static validateDataIntegrity(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // 分析データの検証
      const analyticsData = AnalyticsDataManager.getAnalyticsData();
      if (analyticsData.monthlyData.some(d => d.income < 0 || d.expenses < 0)) {
        errors.push('Invalid monthly data values');
      }

      // ユーザー設定の検証
      const preferences = UserPreferencesManager.getUserPreferences();
      if (typeof preferences.enableAnimations !== 'boolean') {
        errors.push('Invalid user preferences format');
      }

    } catch (error) {
      errors.push(`Data validation error: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// 便利な統合関数
export const phase2Storage = {
  analytics: AnalyticsDataManager,
  preferences: UserPreferencesManager,
  sync: DataSyncManager
};
