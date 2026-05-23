import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { COMPASS_STORAGE_KEY, defaultCompassInputs, defaultCompassSaveData, type CompassInputs } from './utils/compass';

const renderResultScreen = (inputs: Partial<CompassInputs> = {}) => {
  localStorage.setItem(
    COMPASS_STORAGE_KEY,
    JSON.stringify({
      ...defaultCompassSaveData,
      inputs: {
        ...defaultCompassInputs,
        ...inputs,
      },
      diagnosisStep: 'result',
    }),
  );
  render(<App />);
};

describe('App result screen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('第一ビューは結論と重要な状態を出し、補足詳細は開くまで畳む', () => {
    renderResultScreen();

    expect(screen.getByText('ざっくり現在地')).toBeTruthy();
    expect(screen.getByText('あなたの現在地')).toBeTruthy();
    expect(screen.getByText('自由度スコア')).toBeTruthy();
    expect(screen.getByText('セミリタイア距離メーター')).toBeTruthy();
    expect(screen.getByText('やることは3つまで')).toBeTruthy();
    expect(screen.getAllByText(/100人の村なら/).length).toBeGreaterThan(0);
    expect(screen.getByText('今わかること')).toBeTruthy();
    expect(screen.getByText('このまま進むと')).toBeTruthy();
    expect(screen.getByText('次に動かすなら')).toBeTruthy();
    expect(screen.getByText('まずこれ')).toBeTruthy();
    expect(screen.getAllByText('毎月の余力').length).toBeGreaterThan(0);
    expect(screen.getAllByText('急な出費にそなえる貯金').length).toBeGreaterThan(0);
    expect(screen.getByText('次の分かれ道')).toBeTruthy();
    expect(screen.getByText(/仕事のしんどさは未入力/)).toBeTruthy();
    expect(screen.getByText('次に見る目標')).toBeTruthy();
    expect(screen.queryByText('少しずつ進む目標')).toBeNull();
    expect(screen.getByText(/65歳からの年金目安/)).toBeTruthy();
    expect(screen.getAllByText(/生活費の一部/).length).toBeGreaterThan(0);
    expect(screen.getByText(/将来の結果を約束するものではありません/)).toBeTruthy();
    expect(screen.queryByText('数字から読めること')).toBeNull();
    expect(screen.queryByText('将来もらえる年金')).toBeNull();
    expect(screen.queryByText('お金の増え方の目安')).toBeNull();
    expect(screen.queryByText('暮らしに戻る時間を見る')).toBeNull();

    fireEvent.click(screen.getAllByRole('button', { name: /詳しい表示を開く/ })[0]);
    expect(screen.getByText('数字から読めること')).toBeTruthy();
    expect(screen.getByText('6か月分の貯金まで')).toBeTruthy();
    expect(screen.getByText('1年分の余力')).toBeTruthy();
    expect(screen.getByText('毎月決まって出るお金')).toBeTruthy();

    fireEvent.click(screen.getAllByRole('button', { name: /詳しい表示を開く/ })[0]);
    expect(screen.getByText('お金の増え方の目安')).toBeTruthy();
    expect(screen.getByText('少しずつ進む目標')).toBeTruthy();
    expect(screen.getByText('将来もらえる年金')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /固定費を軽くする/ }));
    expect(screen.getByText('固定費を軽くする試算')).toBeTruthy();
    expect(screen.getByText('支出削減シミュレーター')).toBeTruthy();
    expect(screen.getByText('固定費を下げたら、毎月どれくらい楽になるか')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /時間を取り戻す/ }));
    expect(screen.getAllByText('時間を取り戻す道具').length).toBeGreaterThan(0);
    expect(screen.getByText('暮らしに戻る時間を見る')).toBeTruthy();
    expect(screen.getByText('ドラム式洗濯乾燥機')).toBeTruthy();
    expect(screen.getAllByText('Amazonで価格を見る').length).toBeGreaterThan(0);
    expect(screen.queryByText('次にできること')).toBeNull();
  });

  it('簡易結果後に詳細入力で何がわかるかが自然に見える', () => {
    renderResultScreen({
      investedAssets: 0,
      monthlyStableSideIncome: 0,
      workPain: '',
      workFlexibility: '',
      careerReadiness: '',
    });

    expect(screen.getByText('詳しく入れると、ここが自分向けになります')).toBeTruthy();
    expect(screen.getByText(/投資や安定副収入も含めた資産カバー率/)).toBeTruthy();
    expect(screen.getByText(/ローン・保険料込みで、月の余力をより正確に見られます/)).toBeTruthy();
    expect(screen.getByText(/仕事を軽くする順番が、有給・在宅・転職準備などから選びやすくなります/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /詳しく入れる/ }));

    expect(screen.getByText('全部入れなくてOKです')).toBeTruthy();
    expect(screen.getByText(/入れた項目だけ結果を細かくします/)).toBeTruthy();
  });

  it('次の判断を開くと不足額と改善インパクトを試せる', () => {
    renderResultScreen();

    fireEvent.click(screen.getByRole('button', { name: /数字で見る/ }));

    expect(screen.getByText('次の判断')).toBeTruthy();
    expect(screen.getByText('今の余力')).toBeTruthy();
    expect(screen.getByText('いくら動かすと変わるか')).toBeTruthy();
    expect(screen.getByText('固定費を下げる')).toBeTruthy();
    expect(screen.getByText('収入を増やす')).toBeTruthy();
  });

  it('まずこれのボタンで選択肢ではなく1つのミッション詳細が見える', () => {
    renderResultScreen();

    fireEvent.click(screen.getByRole('button', { name: /数字で見る/ }));

    expect(screen.getByText('次の判断')).toBeTruthy();
    expect(screen.queryByText('選んだミッション')).toBeNull();
  });

  it('仕事の負担が高い場合でも時間を取り戻すタブに行動カードは出さない', () => {
    renderResultScreen({ workPain: 'high' });

    fireEvent.click(screen.getByRole('button', { name: /時間を取り戻す/ }));

    expect(screen.queryByText('在宅でできる小さな仕事を探す')).toBeNull();
    expect(screen.queryByText('週3時間だけ試せる仕事を1つ探す')).toBeNull();
  });

  it('時間を取り戻すタブに働き方の行動カードは出さない', () => {
    renderResultScreen();

    fireEvent.click(screen.getByRole('button', { name: /時間を取り戻す/ }));

    expect(screen.queryByText('在宅でできる小さな仕事を探す')).toBeNull();
    expect(screen.queryByText('働く量を少し軽くする条件を考える')).toBeNull();
  });

  it('生活防衛資金が不足している場合でも守りの行動カードは出さない', () => {
    renderResultScreen({
      cashSavings: 100000,
      currentAssets: 100000,
      monthlyExpenses: 220000,
    });

    fireEvent.click(screen.getByRole('button', { name: /時間を取り戻す/ }));

    expect(screen.queryByText('急な出費用の貯金を作る')).toBeNull();
    expect(screen.queryByText('生活費1か月分の不足額を見る')).toBeNull();
  });

  it('資産カバー目安到達済みの場合は取り崩しと生活設計の情報を出す', () => {
    renderResultScreen({
      currentAge: 45,
      monthlyIncome: 300000,
      monthlyExpenses: 200000,
      cashSavings: 2000000,
      investedAssets: 80000000,
      currentAssets: 82000000,
      workReductionGoal: 'fire',
      investmentExperience: 'some',
      workPain: 'low',
    });

    expect(screen.getByText(/資産が生活費を大きく支える位置/)).toBeTruthy();
    expect(screen.getByText('資産の使い方を1枚にまとめる')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /時間を取り戻す/ }));

    expect(screen.queryByText('資産の使い方を決める')).toBeNull();
    expect(screen.queryByText('仕事を減らした暮らしを試す')).toBeNull();
  });

  it('詳細入力では投資しているお金を10万円単位で増やせる', () => {
    renderResultScreen({
      investedAssets: 0,
      currentAssets: 800000,
    });

    fireEvent.click(screen.getByRole('button', { name: /詳しく入れる/ }));
    fireEvent.click(screen.getByRole('button', { name: '投資しているお金を増やす' }));

    const investmentInput = screen.getByRole('textbox', { name: '投資しているお金を直接入力' }) as HTMLInputElement;
    expect(investmentInput.value).toBe('10');
  });

  it('結果を自分用メモとしてコピーできる', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    renderResultScreen();

    fireEvent.click(screen.getByRole('button', { name: '自分用メモをコピー' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const memo = writeText.mock.calls[0][0] as string;
    expect(memo).toContain('ジユウノコンパス診断メモ');
    expect(memo).toContain('現在地:');
    expect(memo).toContain('生活防衛資金:');
    expect(memo).toContain('資産カバー率:');
    expect(memo).toContain('次の一歩');
    expect(memo).toContain('退職・投資・税務などの判断を断定するものではありません');
    expect(screen.getByText('コピーしました')).toBeTruthy();
  });

  it('自分用メモの内容を画面上で確認できる', () => {
    renderResultScreen();

    fireEvent.click(screen.getByRole('button', { name: 'メモ内容を確認' }));

    const memoArea = screen.getByRole('textbox', { name: 'コピーする自分用メモの内容' }) as HTMLTextAreaElement;
    expect(memoArea.value).toContain('ジユウノコンパス診断メモ');
    expect(memoArea.value).toContain('次の一歩');
  });

  it('自動コピーできない環境ではメモ本文を表示する', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });

    renderResultScreen();

    fireEvent.click(screen.getByRole('button', { name: '自分用メモをコピー' }));

    expect(await screen.findByText(/自動コピーが使えませんでした/)).toBeTruthy();
    const memoArea = screen.getByRole('textbox', { name: 'コピーする自分用メモの内容' }) as HTMLTextAreaElement;
    expect(memoArea.value).toContain('生活防衛資金:');
  });
});
