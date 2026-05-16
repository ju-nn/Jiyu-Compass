// 分析システム - 詳細な資産分析とレポート機能

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  assets: number;
  savingsRate: number;
  investmentReturn: number;
  contributions: number;
}

export interface MonthlyAnalysis {
  incomeGrowth: number;
  expenseOptimization: number;
  investmentPerformance: number;
  savingsRateImprovement: number;
  trend: 'improving' | 'stable' | 'declining';
  insights: string[];
}

export interface ProjectionScenario {
  name: string;
  description: string;
  assumptions: {
    incomeGrowth: number;
    expenseGrowth: number;
    investmentReturn: number;
    inflationRate: number;
  };
  projections: {
    year: number;
    assets: number;
    income: number;
    expenses: number;
  }[];
}

export interface YearlyProjections {
  conservative: ProjectionScenario;
  realistic: ProjectionScenario;
  optimistic: ProjectionScenario;
  fireAchievementYear: {
    conservative: number | null;
    realistic: number | null;
    optimistic: number | null;
  };
}

export interface BenchmarkData {
  category: string;
  userValue: number;
  industryAverage: number;
  topPercentile: number;
  percentileRank: number;
}

export interface BenchmarkResult {
  overall: BenchmarkData;
  byCategory: {
    assets: BenchmarkData;
    savingsRate: BenchmarkData;
    investmentReturn: BenchmarkData;
  };
  recommendations: string[];
}

export interface OptimizationSuggestion {
  id: string;
  category: 'income' | 'expenses' | 'investment';
  title: string;
  description: string;
  impact: number; // expected improvement percentage
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  actionSteps: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface AnalyticsData {
  userId: string;
  monthlyData: MonthlyData[];
  lastAnalysis: Date;
  goals: Goal[];
  milestones: Milestone[];
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  targetDate: Date;
  currentProgress: number;
  category: 'assets' | 'income' | 'expenses' | 'fire';
}

export interface Milestone {
  id: string;
  title: string;
  achievedAt: Date;
  value: number;
  category: string;
}

// 分析エンジンクラス
export class AnalyticsEngine {
  private industryBenchmarks: Record<string, number>;

  constructor() {
    // 業界ベンチマーク（サンプルデータ）
    this.industryBenchmarks = {
      avgAssets30: 3000000,
      avgAssets40: 10000000,
      avgSavingsRate: 20,
      avgInvestmentReturn: 5,
      topPercentileAssets: 50000000,
      topPercentileSavingsRate: 40,
      topPercentileReturn: 8
    };
  }

  /**
   * 月次分析を実行
   */
  calculateMonthlyAnalysis(data: MonthlyData[]): MonthlyAnalysis {
    if (data.length < 2) {
      return {
        incomeGrowth: 0,
        expenseOptimization: 0,
        investmentPerformance: 0,
        savingsRateImprovement: 0,
        trend: 'stable',
        insights: ['データが不足しています。もう少し期間を置いて分析してください。']
      };
    }

    const sortedData = data.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    const recent = sortedData.slice(-3); // 直近3ヶ月
    const previous = sortedData.slice(-6, -3); // その前の3ヶ月

    // 収入成長率を計算
    const incomeGrowth = this.calculateGrowthRate(
      previous.reduce((sum, d) => sum + d.income, 0) / previous.length,
      recent.reduce((sum, d) => sum + d.income, 0) / recent.length
    );

    // 支出最適化率を計算（支出の減少率）
    const expenseOptimization = -this.calculateGrowthRate(
      previous.reduce((sum, d) => sum + d.expenses, 0) / previous.length,
      recent.reduce((sum, d) => sum + d.expenses, 0) / recent.length
    );

    // 投資パフォーマンスを計算
    const investmentPerformance = recent.reduce((sum, d) => sum + d.investmentReturn, 0) / recent.length;

    // 貯蓄率改善を計算
    const savingsRateImprovement = 
      (recent.reduce((sum, d) => sum + d.savingsRate, 0) / recent.length) -
      (previous.reduce((sum, d) => sum + d.savingsRate, 0) / previous.length);

    // トレンドを判定
    const trend = this.determineTrend(incomeGrowth, expenseOptimization, savingsRateImprovement);

    // インサイトを生成
    const insights = this.generateInsights({
      incomeGrowth,
      expenseOptimization,
      investmentPerformance,
      savingsRateImprovement,
      trend,
      insights: []
    });

    return {
      incomeGrowth,
      expenseOptimization,
      investmentPerformance,
      savingsRateImprovement,
      trend,
      insights
    };
  }

  /**
   * 年次予測を生成
   */
  generateYearlyProjections(currentData: {
    assets: number;
    income: number;
    expenses: number;
    age: number;
    investmentReturn: number;
  }): YearlyProjections {
    const projectionYears = 30;
    const fireTarget = (currentData.expenses / 0.04); // 4%ルール

    // 保守的シナリオ
    const conservative = this.generateScenario('保守的', {
      incomeGrowth: 1,
      expenseGrowth: 2,
      investmentReturn: 3,
      inflationRate: 2
    }, currentData, projectionYears);

    // 現実的シナリオ
    const realistic = this.generateScenario('現実的', {
      incomeGrowth: 2,
      expenseGrowth: 2,
      investmentReturn: 5,
      inflationRate: 2
    }, currentData, projectionYears);

    // 楽観的シナリオ
    const optimistic = this.generateScenario('楽観的', {
      incomeGrowth: 3,
      expenseGrowth: 1.5,
      investmentReturn: 7,
      inflationRate: 2
    }, currentData, projectionYears);

    // FIRE達成年を計算
    const fireAchievementYear = {
      conservative: this.calculateFireYear(conservative, fireTarget),
      realistic: this.calculateFireYear(realistic, fireTarget),
      optimistic: this.calculateFireYear(optimistic, fireTarget)
    };

    return {
      conservative,
      realistic,
      optimistic,
      fireAchievementYear
    };
  }

  /**
   * ベンチマーク比較を実行
   */
  performBenchmarkComparison(userData: {
    age: number;
    assets: number;
    savingsRate: number;
    investmentReturn: number;
  }): BenchmarkResult {
    // 年齢に応じたベンチマーク調整
    const ageMultiplier = userData.age / 30;
    const expectedAssets = this.industryBenchmarks.avgAssets30 * ageMultiplier;

    const assetsBenchmark: BenchmarkData = {
      category: '資産額',
      userValue: userData.assets,
      industryAverage: expectedAssets,
      topPercentile: this.industryBenchmarks.topPercentileAssets,
      percentileRank: this.calculatePercentileRank(userData.assets, expectedAssets, this.industryBenchmarks.topPercentileAssets)
    };

    const savingsRateBenchmark: BenchmarkData = {
      category: '貯蓄率',
      userValue: userData.savingsRate,
      industryAverage: this.industryBenchmarks.avgSavingsRate,
      topPercentile: this.industryBenchmarks.topPercentileSavingsRate,
      percentileRank: this.calculatePercentileRank(userData.savingsRate, this.industryBenchmarks.avgSavingsRate, this.industryBenchmarks.topPercentileSavingsRate)
    };

    const investmentReturnBenchmark: BenchmarkData = {
      category: '投資リターン',
      userValue: userData.investmentReturn,
      industryAverage: this.industryBenchmarks.avgInvestmentReturn,
      topPercentile: this.industryBenchmarks.topPercentileReturn,
      percentileRank: this.calculatePercentileRank(userData.investmentReturn, this.industryBenchmarks.avgInvestmentReturn, this.industryBenchmarks.topPercentileReturn)
    };

    // 総合評価
    const overallScore = (assetsBenchmark.percentileRank + savingsRateBenchmark.percentileRank + investmentReturnBenchmark.percentileRank) / 3;
    const overall: BenchmarkData = {
      category: '総合評価',
      userValue: overallScore,
      industryAverage: 50,
      topPercentile: 90,
      percentileRank: overallScore
    };

    // 推奨事項を生成
    const recommendations = this.generateBenchmarkRecommendations({
      assets: assetsBenchmark,
      savingsRate: savingsRateBenchmark,
      investmentReturn: investmentReturnBenchmark
    });

    return {
      overall,
      byCategory: {
        assets: assetsBenchmark,
        savingsRate: savingsRateBenchmark,
        investmentReturn: investmentReturnBenchmark
      },
      recommendations
    };
  }

  /**
   * 最適化提案を生成
   */
  generateOptimizationSuggestions(analysis: MonthlyAnalysis, userData: {
    income: number;
    expenses: number;
    savingsRate: number;
    investmentReturn: number;
  }): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // 収入関連の提案
    if (analysis.incomeGrowth < 2) {
      suggestions.push({
        id: 'income_boost',
        category: 'income',
        title: '収入アップ戦略',
        description: '副業やスキルアップで収入を増やしましょう。年収アップは資産形成の最も効果的な方法です。',
        impact: 15,
        difficulty: 'medium',
        timeframe: '3-6ヶ月',
        actionSteps: [
          '現在のスキルを棚卸しして市場価値を確認',
          '副業可能な分野を調査',
          'オンライン学習で新しいスキルを習得',
          '転職エージェントに相談'
        ],
        priority: 'high'
      });
    }

    // 支出関連の提案
    if (userData.savingsRate < 20) {
      suggestions.push({
        id: 'expense_optimization',
        category: 'expenses',
        title: '支出最適化プラン',
        description: '固定費の見直しで無理なく支出を削減。貯蓄率20%を目指しましょう。',
        impact: 10,
        difficulty: 'easy',
        timeframe: '1ヶ月',
        actionSteps: [
          '家計簿アプリで支出を可視化',
          '固定費（通信費、保険料）を見直し',
          'サブスクリプションサービスを整理',
          '食費の予算を設定'
        ],
        priority: 'high'
      });
    }

    // 投資関連の提案
    if (userData.investmentReturn < 4) {
      suggestions.push({
        id: 'investment_improvement',
        category: 'investment',
        title: '投資戦略の改善',
        description: 'より効率的な投資手法で長期リターンを向上させましょう。',
        impact: 8,
        difficulty: 'medium',
        timeframe: '2-3ヶ月',
        actionSteps: [
          '現在のポートフォリオを分析',
          'インデックス投資の比率を増加',
          'NISA・iDeCoを最大限活用',
          '定期的なリバランスを実施'
        ],
        priority: 'medium'
      });
    }

    // 優先度順にソート
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * 成長率を計算
   */
  private calculateGrowthRate(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  /**
   * トレンドを判定
   */
  private determineTrend(incomeGrowth: number, expenseOptimization: number, savingsRateImprovement: number): 'improving' | 'stable' | 'declining' {
    const score = incomeGrowth + expenseOptimization + savingsRateImprovement;
    
    if (score > 2) return 'improving';
    if (score < -2) return 'declining';
    return 'stable';
  }

  /**
   * インサイトを生成
   */
  private generateInsights(analysis: MonthlyAnalysis): string[] {
    const insights: string[] = [];

    if (analysis.trend === 'improving') {
      insights.push('📈 素晴らしい進歩です！資産形成が順調に進んでいます。');
    } else if (analysis.trend === 'declining') {
      insights.push('⚠️ 改善の余地があります。支出の見直しを検討しましょう。');
    }

    if (analysis.incomeGrowth > 5) {
      insights.push('💰 収入が大幅に増加しています。この調子を維持しましょう！');
    }

    if (analysis.expenseOptimization > 3) {
      insights.push('✂️ 支出削減が効果的に進んでいます。節約の成果が出ています。');
    }

    if (analysis.investmentPerformance > 6) {
      insights.push('🚀 投資パフォーマンスが優秀です。良いポートフォリオを維持しています。');
    }

    return insights;
  }

  /**
   * シナリオを生成
   */
  private generateScenario(
    name: string,
    assumptions: ProjectionScenario['assumptions'],
    currentData: { assets: number; income: number; expenses: number },
    years: number
  ): ProjectionScenario {
    const projections = [];
    let assets = currentData.assets;
    let income = currentData.income;
    let expenses = currentData.expenses;

    for (let year = 1; year <= years; year++) {
      // 年次成長を適用
      income *= (1 + assumptions.incomeGrowth / 100);
      expenses *= (1 + assumptions.expenseGrowth / 100);
      
      // 年間貯蓄額
      const annualSavings = Math.max(0, income - expenses);
      
      // 投資リターンを適用
      assets = assets * (1 + assumptions.investmentReturn / 100) + annualSavings;

      projections.push({
        year: new Date().getFullYear() + year,
        assets: Math.round(assets),
        income: Math.round(income),
        expenses: Math.round(expenses)
      });
    }

    return {
      name,
      description: this.getScenarioDescription(name),
      assumptions,
      projections
    };
  }

  /**
   * シナリオの説明を取得
   */
  private getScenarioDescription(name: string): string {
    switch (name) {
      case '保守的':
        return '経済成長が鈍化し、投資リターンも控えめなシナリオ。安全性を重視した予測です。';
      case '現実的':
        return '過去の平均的な経済成長を前提とした、最も可能性の高いシナリオです。';
      case '楽観的':
        return '経済成長が活発で、投資環境も良好なシナリオ。積極的な資産形成が可能です。';
      default:
        return '';
    }
  }

  /**
   * FIRE達成年を計算
   */
  private calculateFireYear(scenario: ProjectionScenario, fireTarget: number): number | null {
    const achievement = scenario.projections.find(p => p.assets >= fireTarget);
    return achievement ? achievement.year : null;
  }

  /**
   * パーセンタイルランクを計算
   */
  private calculatePercentileRank(userValue: number, average: number, topPercentile: number): number {
    // 簡易的な計算（正規分布を仮定）
    const stdDev = (topPercentile - average) / 2; // 95パーセンタイルを2σと仮定
    const zScore = (userValue - average) / stdDev;
    
    // Z-scoreをパーセンタイルに変換
    return Math.max(0, Math.min(100, 50 + zScore * 15));
  }

  /**
   * ベンチマーク推奨事項を生成
   */
  private generateBenchmarkRecommendations(benchmarks: {
    assets: BenchmarkData;
    savingsRate: BenchmarkData;
    investmentReturn: BenchmarkData;
  }): string[] {
    const recommendations: string[] = [];

    if (benchmarks.assets.percentileRank < 50) {
      recommendations.push('資産額が平均を下回っています。積立額の増加を検討しましょう。');
    }

    if (benchmarks.savingsRate.percentileRank < 50) {
      recommendations.push('貯蓄率の向上が必要です。支出の見直しから始めましょう。');
    }

    if (benchmarks.investmentReturn.percentileRank < 50) {
      recommendations.push('投資リターンの改善余地があります。ポートフォリオを見直しましょう。');
    }

    return recommendations;
  }

  /**
   * 分析データのエクスポート
   */
  exportAnalysisData(analysis: MonthlyAnalysis, projections: YearlyProjections, benchmarks: BenchmarkResult): string {
    const exportData = {
      generatedAt: new Date().toISOString(),
      analysis,
      projections,
      benchmarks
    };

    return JSON.stringify(exportData, null, 2);
  }
}

// シングルトンインスタンス
export const analyticsEngine = new AnalyticsEngine();