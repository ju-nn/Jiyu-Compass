import { describe, expect, it } from 'vitest';
import {
  completeQuest,
  defaultCompassInputs,
  defaultCompassSaveData,
  evaluateCompass,
  normalizeCompassSaveData,
  selectQuest,
  toggleQuestCheck,
  type CompassInputs
} from './compass';

describe('evaluateCompass', () => {
  it('赤字の場合は安定化を優先する', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 120000,
      monthlyExpenses: 160000,
      cashSavings: 0,
      investedAssets: 0,
      currentAssets: 0,
    });

    expect(result.stabilityStatus).toBe('deficit');
    expect(result.monthlyBalance).toBe(-40000);
    expect(result.headline).toContain('赤字を止める');
    expect(result.missions[0].id).toBe('close-deficit');
  });

  it('資産0でも結果が破綻しない', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      cashSavings: 0,
      investedAssets: 0,
      currentAssets: 0,
      monthlyIncome: 180000,
      monthlyExpenses: 170000,
    });

    expect(result.fireProgress).toBe(0);
    expect(result.emergencyFundMonths).toBe(0);
    expect(result.projection.length).toBeGreaterThan(0);
    expect(result.goalSteps.length).toBeGreaterThan(0);
  });

  it('資産0、収入0、支出0でも結果が落ちない', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      cashSavings: 0,
      investedAssets: 0,
      currentAssets: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
    });

    expect(result.monthlyBalance).toBe(0);
    expect(result.fireNumber).toBe(0);
    expect(result.recommendedQuests.length).toBeGreaterThan(0);
    expect(result.lifeStage.level).toBeGreaterThan(0);
  });

  it('月1万円余力の段階ゴールを計算する', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 180000,
      monthlyExpenses: 175000,
      cashSavings: 0,
      investedAssets: 0,
      currentAssets: 0,
    });

    const buffer = result.goalSteps.find((step) => step.id === 'monthly-buffer');

    expect(buffer?.targetAmount).toBe(10000);
    expect(buffer?.currentAmount).toBe(5000);
    expect(buffer?.progress).toBe(50);
  });

  it('生活防衛資金の不足距離を段階で出す', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyExpenses: 150000,
      cashSavings: 150000,
      investedAssets: 0,
      currentAssets: 150000,
    });

    const oneMonth = result.goalSteps.find((step) => step.id === 'emergency-1m');
    const threeMonths = result.goalSteps.find((step) => step.id === 'emergency-3m');
    const sixMonths = result.goalSteps.find((step) => step.id === 'invest-start');

    expect(oneMonth?.progress).toBe(100);
    expect(threeMonths?.targetAmount).toBe(450000);
    expect(Math.round(threeMonths?.progress ?? 0)).toBe(33);
    expect(sixMonths?.targetAmount).toBe(900000);
  });

  it('年間支出300万円、取り崩し率4%ならFIRE目標額は7500万円', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyExpenses: 250000,
      withdrawalRate: 4,
    });

    expect(result.fireNumber).toBe(75000000);
  });

  it('現在資産がFIRE目標額以上なら達成年数0', () => {
    const inputs: CompassInputs = {
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
      cashSavings: 600000,
      investedAssets: 59400000,
      currentAssets: 60000000,
      withdrawalRate: 4,
    };
    const result = evaluateCompass(inputs);

    expect(result.yearsToFire).toBe(0);
    expect(result.achievableFireAge).toBe(inputs.currentAge);
  });

  it('初回診断で隠した投資前提は内部デフォルト4%で計算する', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
      cashSavings: 1000000,
      investedAssets: 0,
      currentAssets: 1000000,
      expectedReturnRate: Number.NaN,
      withdrawalRate: Number.NaN,
    });

    expect(result.fireNumber).toBe(60000000);
    expect(result.projection[1].assets).toBeGreaterThan(1000000);
  });

  it('同年代目安に基づく月の余力インサイトを返す', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      currentAge: 28,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
    });

    expect(result.metricInsights.monthlyBuffer.label).toBe('同じ年代の目安より高め');
    expect(result.metricInsights.monthlyBuffer.helper).toContain('目安');
  });

  it.each([
    [-10, '赤字'],
    [0, 'これから'],
    [10, '安定化中'],
    [20, 'かなり良い'],
    [40, 'とても強い'],
  ])('貯蓄率%s%のランクを返す', (rate, label) => {
    const monthlyIncome = 100000;
    const monthlyExpenses = monthlyIncome - (monthlyIncome * rate) / 100;
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome,
      monthlyExpenses,
    });

    expect(result.metricInsights.savingsRate.label).toBe(label);
  });

  it.each([
    [0.5, 'まず1か月分'],
    [2, '3か月分の貯金まであと少し'],
    [4, '6か月分の貯金を育てています'],
    [6, 'かなり安心'],
  ])('生活防衛資金%sか月のランクを返す', (months, label) => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyExpenses: 100000,
      cashSavings: 100000 * months,
      investedAssets: 0,
      currentAssets: 100000 * months,
    });

    expect(result.metricInsights.emergencyFund.label).toBe(label);
  });

  it('赤字入力では赤字を止めるミッションが優先される', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 120000,
      monthlyExpenses: 180000,
      cashSavings: 0,
      investedAssets: 0,
      currentAssets: 0,
    });

    expect(result.recommendedQuests[0].id).toBe('close-deficit');
    expect(result.recommendedQuests[0].category).toBe('saving');
    expect(result.lifeStage.priorityTheme).toContain('赤字');
  });

  it('生活防衛資金が少ない場合、投資より防衛クエストが優先される', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 220000,
      monthlyExpenses: 180000,
      cashSavings: 50000,
      investedAssets: 0,
      currentAssets: 50000,
    });

    expect(result.recommendedQuests[0].category).toBe('defense');
    expect(result.recommendedQuests[0].category).not.toBe('investment');
  });

  it('黒字かつ生活防衛資金3か月以上なら投資準備か労働軽量化クエストが出る', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 180000,
      cashSavings: 700000,
      investedAssets: 0,
      currentAssets: 700000,
      investmentExperience: 'none',
    });

    const categories = result.recommendedQuests.map((quest) => quest.category);
    expect(categories).toContain('investment');
    expect(categories).toContain('work');
  });

  it('ユーザー向け文言に説明が必要なゲーム用語を出さない', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 120000,
      monthlyExpenses: 180000,
      cashSavings: 0,
      investedAssets: 0,
      currentAssets: 0,
      workPain: 'high',
    });
    const userFacingText = [
      result.headline,
      result.lifeStage.title,
      result.lifeStage.priorityTheme,
      result.lifeStage.stageName,
      result.lifeStage.safetyMonthsLabel,
      result.lifeStage.workLightnessLabel,
      result.story.positionLabel,
      result.story.positionHelper,
      result.story.currentStatusText,
      result.story.currentStatusHelper,
      result.story.baselineFutureText,
      result.story.baselineFutureHelper,
      result.story.improvedFutureText,
      result.story.improvedActionText,
      ...result.goalSteps.flatMap((step) => [step.label, step.helper]),
      ...result.recommendedQuests.flatMap((quest) => [
        quest.title,
        quest.body,
        quest.impact,
        quest.why,
        ...quest.steps,
        ...quest.tips,
        ...quest.completionChecks,
      ]),
    ].join('\n');

    expect(userFacingText).not.toMatch(/赤字ボス|固定費ダンジョン|生活防衛シールド|余力ゲージ|労働軽量化ゲージ|HP|XP|BOSS|EASY|NORMAL|攻略|RPG|シールド|ダンジョン|ボス/);
  });

  it('生活防衛資金は投資資産を含めず貯金だけで計算する', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
      cashSavings: 100000,
      investedAssets: 1000000,
    });

    expect(result.totalAssets).toBe(1100000);
    expect(result.cashEmergencyFundMonths).toBe(0.5);
    expect(result.stabilityStatus).toBe('fragile');
    expect(result.metricInsights.emergencyFund.label).toBe('まず1か月分');
  });

  it('生活防衛3か月未満では月の余力を投資資産ではなく貯金に加算する', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
      cashSavings: 0,
      investedAssets: 0,
    });

    const afterOneYear = result.projection.find((point) => point.age === defaultCompassInputs.currentAge + 1);

    expect(afterOneYear?.cashSavings).toBe(600000);
    expect(afterOneYear?.investedAssets).toBe(600000);
  });

  it('生活防衛3か月到達後は余力が投資資産へ回り、投資資産だけに利回りがかかる', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
      cashSavings: 600000,
      investedAssets: 1000000,
      expectedReturnRate: 4,
    });

    const afterOneYear = result.projection.find((point) => point.age === defaultCompassInputs.currentAge + 1);

    expect(afterOneYear?.cashSavings).toBe(600000);
    expect(afterOneYear?.investedAssets).toBe(2240000);
  });

  it('赤字入力では改善ルートが赤字解消と月1万円余力を前提にする', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 120000,
      monthlyExpenses: 150000,
      cashSavings: 0,
      investedAssets: 0,
    });

    expect(result.story.assumedMonthlyImprovement).toBe(40000);
    expect(result.story.currentStatusText).toContain('赤字');
    expect(result.story.improvedFutureText).toContain('月1万円残る形');
    expect(result.story.baselineFutureText).toContain('底');
  });

  it('月の余力0〜1万円未満では改善ルートが月1万円余力前提になる', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 180000,
      monthlyExpenses: 175000,
      cashSavings: 100000,
      investedAssets: 0,
    });

    expect(result.story.assumedMonthlyImprovement).toBe(5000);
    expect(result.story.improvedFutureText).toContain('月5,000円');
  });

  it('現在地として上位何割の目安を返す', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 210000,
      cashSavings: 900000,
      investedAssets: 0,
    });

    expect(result.story.positionLabel).toContain('100人の村なら');
    expect(result.story.positionHelper).toContain('正確な順位ではありません');
    expect(result.story.positionHelper).toContain('5人きざみ');
  });

  it('現在地がかなり高い場合は5番目あたりまで出す', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      currentAge: 28,
      monthlyIncome: 500000,
      monthlyExpenses: 250000,
      cashSavings: 4000000,
      investedAssets: 0,
    });

    expect(result.story.positionLabel).toBe('100人の村なら上から5番目あたり');
  });

  it('40歳前は介護保険料が始まる年齢ポイントを補足する', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      currentAge: 32,
      monthlyIncome: 180000,
      monthlyExpenses: 175000,
    });

    expect(result.story.baselineFutureHelper).toContain('40歳から介護保険料');
  });

  it('収入と支出が同じでも40歳以降の介護保険料で資産推移が動く', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      currentAge: 38,
      cashSavings: 100000,
      investedAssets: 0,
      monthlyIncome: 200000,
      monthlyExpenses: 200000,
      expectedReturnRate: 0,
    });

    const age39 = result.projection.find((point) => point.age === 39);
    const age40 = result.projection.find((point) => point.age === 40);
    const age42 = result.projection.find((point) => point.age === 42);

    expect(age39?.totalAssets).toBe(100000);
    expect(age40?.totalAssets).toBe(100000);
    expect(age42?.totalAssets).toBeLessThan(100000);
  });

  it('60歳以降は自分で払う年金保険料の終了を資産推移に反映する', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      currentAge: 58,
      cashSavings: 0,
      investedAssets: 0,
      monthlyIncome: 200000,
      monthlyExpenses: 180000,
      monthlyPensionContribution: 10000,
      expectedReturnRate: 0,
    });

    const age60 = result.projection.find((point) => point.age === 60);

    expect(age60?.pensionContributionRelief).toBe(120000);
    expect(age60?.annualLifeChangeImpact).toBeGreaterThan(0);
  });

  it('資産が尽きた後の赤字を0で止めず赤字残高として返す', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      currentAge: 30,
      cashSavings: 0,
      investedAssets: 0,
      monthlyIncome: 100000,
      monthlyExpenses: 150000,
      expectedReturnRate: 0,
    });

    const age31 = result.projection.find((point) => point.age === 31);

    expect(age31?.totalAssets).toBeLessThan(0);
    expect(age31?.deficitBalance).toBeLessThan(0);
  });

  it('改善ルートでも生活防衛3か月未満では先に貯金へ配分する', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      currentAge: 50,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
      cashSavings: 0,
      investedAssets: 0,
    });

    expect(result.story.futureAge).toBe(60);
    expect(result.story.futureTotalAssets).toBeGreaterThan(result.story.futureInvestedAssets);
    expect(result.story.futureTotalAssets - result.story.futureInvestedAssets).toBe(600000);
  });

  it('生活防衛3か月達成後は改善ルートで投資資産へ配分される', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
      cashSavings: 600000,
      investedAssets: 0,
    });

    expect(result.story.futureInvestedAssets).toBeGreaterThan(0);
  });

  it('投資利益の月額目安は投資資産の年4%を12で割る', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
      cashSavings: 600000,
      investedAssets: 1000000,
    });

    expect(result.story.estimatedMonthlyInvestmentGain).toBe(
      Math.round((result.story.futureInvestedAssets * 0.04) / 12),
    );
    expect(result.story.improvedFutureText).toContain('お金があなたの代わりに');
  });

  it.each([
    {
      name: '毎月赤字',
      inputs: {
        monthlyIncome: 140000,
        monthlyExpenses: 180000,
        cashSavings: 50000,
        investedAssets: 0,
        moneyStress: 'medium',
      },
      expected: {
        status: 'deficit',
        firstQuest: 'close-deficit',
        headline: '赤字を止める',
      },
    },
    {
      name: '月1万円未満の黒字',
      inputs: {
        monthlyIncome: 180000,
        monthlyExpenses: 175000,
        cashSavings: 50000,
        investedAssets: 0,
      },
      expected: {
        status: 'fragile',
        firstQuest: 'first-buffer',
        headline: '1か月分の貯金',
      },
    },
    {
      name: '生活防衛済みで投資未経験',
      inputs: {
        monthlyIncome: 320000,
        monthlyExpenses: 200000,
        cashSavings: 800000,
        investedAssets: 0,
        investmentExperience: 'none',
      },
      expected: {
        status: 'steady',
        firstQuest: 'work-light',
        headline: '働き方を軽くする',
      },
    },
    {
      name: 'FIRE直前',
      inputs: {
        currentAge: 42,
        monthlyIncome: 600000,
        monthlyExpenses: 200000,
        cashSavings: 1200000,
        investedAssets: 48800000,
        workReductionGoal: 'fire',
        investmentExperience: 'some',
      },
      expected: {
        status: 'steady',
        firstQuest: 'near-fire-risk-review',
        headline: 'FIRE目標額が近づいています',
      },
    },
    {
      name: 'FIRE目標額到達済み',
      inputs: {
        currentAge: 45,
        monthlyIncome: 300000,
        monthlyExpenses: 200000,
        cashSavings: 2000000,
        investedAssets: 60000000,
        workReductionGoal: 'fire',
        investmentExperience: 'some',
      },
      expected: {
        status: 'steady',
        firstQuest: 'withdrawal-plan',
        headline: 'FIRE目標額には届いています',
      },
    },
  ])('$name の状況に合う優先情報と次の1手を返す', ({ inputs, expected }) => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      ...inputs,
    } as CompassInputs);

    expect(result.stabilityStatus).toBe(expected.status);
    expect(result.recommendedQuests[0].id).toBe(expected.firstQuest);
    expect(result.headline).toContain(expected.headline);
    expect(result.story.currentStatusText).toBeTruthy();
    expect(result.story.baselineFutureText).toBeTruthy();
    expect(result.story.improvedFutureText).toContain('年4%目安');
  });

  it('ローンや自分で払う社会保険を支出側に含めて、固定負担として見せる', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 300000,
      monthlyExpenses: 180000,
      monthlyPensionContribution: 20000,
      monthlyStudentLoanPayment: 15000,
      monthlyHousingLoanPayment: 50000,
      monthlyCarLoanPayment: 10000,
      cashSavings: 600000,
      investedAssets: 1000000,
    });

    expect(result.monthlyObligations).toBe(95000);
    expect(result.monthlyBalance).toBe(25000);
    expect(result.annualExpenses).toBe(3300000);
    expect(result.cashEmergencyFundMonths).toBeCloseTo(600000 / 275000);
  });

  it('年金の開始年齢と会社員向けの概算を返す', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 250000,
    });

    expect(result.pensionEstimate.startAge).toBe(65);
    expect(result.pensionEstimate.monthlyBasicFullAmount).toBe(70608);
    expect(result.pensionEstimate.monthlyEmployeeExampleAmount).toBe(125418);
    expect(result.pensionEstimate.helper).toContain('ざっくり確認用');
    expect(result.pensionEstimate.helper).toContain('ねんきん定期便');
  });

  it('年金が少なくなりそうな年数を国民年金部分に反映する', () => {
    const result = evaluateCompass({
      ...defaultCompassInputs,
      monthlyIncome: 250000,
      pensionReducedYears: 10,
    });

    expect(result.pensionEstimate.monthlyBasicFullAmount).toBe(52956);
    expect(result.pensionEstimate.monthlyEmployeeExampleAmount).toBe(107766);
    expect(result.pensionEstimate.helper).toContain('10年');
  });
});

describe('quest save model', () => {
  it('既存のcurrentAssets保存データをcashSavingsへ移行する', () => {
    const migrated = normalizeCompassSaveData({
      inputs: {
        currentAge: 28,
        currentAssets: 345000,
        monthlyIncome: 180000,
        monthlyExpenses: 175000,
        workReductionGoal: 'reduce_work',
        savingsExperience: 'starting',
        investmentExperience: 'none',
        moneyStress: 'medium',
        workPain: 'high',
        expectedReturnRate: 4,
        withdrawalRate: 4,
      } as CompassInputs,
    });

    expect(migrated.inputs.cashSavings).toBe(345000);
    expect(migrated.inputs.investedAssets).toBe(0);
    expect(migrated.inputs.currentAssets).toBe(345000);
  });

  it('クエスト選択状態が保存モデルに反映される', () => {
    const next = selectQuest(defaultCompassSaveData, 'small-auto-save');

    expect(next.selectedQuestId).toBe('small-auto-save');
    expect(next.diagnosisStep).toBe('quest');
    expect(next.questCheckState['small-auto-save']).toEqual([]);
    expect(next.lastCheckDate).toBeTruthy();
  });

  it('チェック項目が未完了の場合、完了扱いにしない', () => {
    const selected = selectQuest(defaultCompassSaveData, 'small-auto-save');
    const completed = completeQuest(selected, 'small-auto-save', ['0', '1']);

    expect(completed.completedQuestIds).not.toContain('small-auto-save');
    expect(completed.selectedQuestId).toBe('small-auto-save');
  });

  it('チェック項目完了後にミッション完了状態が保存される', () => {
    const selected = selectQuest(defaultCompassSaveData, 'small-auto-save');
    const checkedOne = toggleQuestCheck(selected, 'small-auto-save', '0');
    const checkedAll = toggleQuestCheck(checkedOne, 'small-auto-save', '1');
    const completed = completeQuest(checkedAll, 'small-auto-save', ['0', '1']);

    expect(completed.completedQuestIds).toContain('small-auto-save');
    expect(completed.selectedQuestId).toBeNull();
    expect(completed.questCheckState['small-auto-save']).toEqual(['0', '1']);
    expect(completed.lastCheckDate).toBeTruthy();
  });
});

