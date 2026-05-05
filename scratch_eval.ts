import { evaluateCompass, type CompassInputs } from './src/utils/compass';

const cases: Record<string, CompassInputs> = {
  "1. 低所得フリーター": {
    currentAge: 25,
    cashSavings: 50000,
    investedAssets: 0,
    currentAssets: 50000,
    monthlyIncome: 130000,
    monthlyExpenses: 140000,
    workReductionGoal: 'stabilize',
    savingsExperience: 'none',
    investmentExperience: 'none',
    moneyStress: 'high',
    workPain: 'high',
    expectedReturnRate: 4,
    withdrawalRate: 4,
  },
  "2. 平均的な所得の会社員": {
    currentAge: 30,
    cashSavings: 1500000,
    investedAssets: 500000,
    currentAssets: 2000000,
    monthlyIncome: 3000000 / 12, // 25万
    monthlyExpenses: 210000,
    workReductionGoal: 'save',
    savingsExperience: 'starting',
    investmentExperience: 'none',
    moneyStress: 'medium',
    workPain: 'medium',
    expectedReturnRate: 4,
    withdrawalRate: 4,
  },
  "3. FIRE直前の高所得会社員": {
    currentAge: 45,
    cashSavings: 5000000,
    investedAssets: 45000000,
    currentAssets: 50000000,
    monthlyIncome: 800000,
    monthlyExpenses: 300000,
    workReductionGoal: 'fire',
    savingsExperience: 'some',
    investmentExperience: 'some',
    moneyStress: 'low',
    workPain: 'high',
    expectedReturnRate: 4,
    withdrawalRate: 4,
  }
};

for (const [name, inputs] of Object.entries(cases)) {
  console.log(`\n======================================`);
  console.log(`【${name}】`);
  const result = evaluateCompass(inputs);
  console.log(`・安定性ステータス: ${result.stabilityStatus}`);
  console.log(`・目標: ${result.nextGoal.label} (${Math.round(result.nextGoal.progress)}%)`);
  console.log(`・ポジション: ${result.story.positionLabel}`);
  console.log(`  └ ${result.story.positionHelper}`);
  console.log(`・RPGタイトル: ${result.rpgStatus.title} (Lv.${result.rpgStatus.level})`);
  console.log(`・ミッション一覧:`);
  result.recommendedQuests.forEach((q, i) => {
    console.log(`  ${i+1}. [${q.category}] ${q.title}`);
  });
}
