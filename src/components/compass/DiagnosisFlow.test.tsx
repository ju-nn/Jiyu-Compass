import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { defaultCompassInputs } from '../../utils/compass';
import { DiagnosisFlow } from './DiagnosisFlow';

describe('DiagnosisFlow', () => {
  it('初回診断UIに投資の詳細前提を表示しない', () => {
    render(
      <DiagnosisFlow
        inputs={defaultCompassInputs}
        step="life"
        onChange={vi.fn()}
        onStepChange={vi.fn()}
      />,
    );

    expect(screen.queryByText('想定利回り')).toBeNull();
    expect(screen.queryByText('取り崩し率')).toBeNull();
  });

  it('超簡単診断では最低限の入力だけを表示する', () => {
    render(
      <DiagnosisFlow
        inputs={defaultCompassInputs}
        step="profile"
        onChange={vi.fn()}
        onStepChange={vi.fn()}
      />,
    );

    expect(screen.getByText('貯金')).toBeTruthy();
    expect(screen.getByText('月収（手取り）')).toBeTruthy();
    expect(screen.getByText('月の生活費（だいたい）')).toBeTruthy();
    expect(screen.queryByText('投資しているお金')).toBeNull();
    expect(screen.queryByText('現在の資産')).toBeNull();
    expect(screen.getByText(/月収は税金や社会保険料が引かれた後の手取り/)).toBeTruthy();
    expect(screen.getByText('すぐ結果を見る')).toBeTruthy();
  });

  it('詳細入力は必要な項目をステップで入力できる', () => {
    render(
      <DiagnosisFlow
        inputs={defaultCompassInputs}
        step="life"
        onChange={vi.fn()}
        onStepChange={vi.fn()}
      />,
    );

    expect(screen.getByText('必要なところだけ、1つずつ')).toBeTruthy();
    expect(screen.getByText(/わかるところだけで大丈夫です/)).toBeTruthy();
    expect(screen.getByText(/ここまでの入力は自動保存されます/)).toBeTruthy();
    expect(screen.getByText('次に入れるなら')).toBeTruthy();
    expect(screen.getByText('仕事のしんどさが結果に強く効くので、働き方から')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ここを入れる' })).toBeTruthy();
    expect(screen.getAllByText('未入力').length).toBeGreaterThan(0);
    expect(screen.getByText('働き方の重さ')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '資産ステップを開く' }));

    expect(screen.getByText('資産と安定収入')).toBeTruthy();
    expect(screen.getByText('投資しているお金')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '固定負担ステップを開く' }));

    expect(screen.getByText('毎月の固定負担')).toBeTruthy();
    expect(screen.getByText('月の生活費（返済などを除く）')).toBeTruthy();
    expect(screen.getByText('毎月の返済（合計）')).toBeTruthy();
    expect(screen.getByText('自分で払う社会保険料など')).toBeTruthy();
    expect(screen.getByText('年金が少なくなりそうな年数')).toBeTruthy();
    expect(screen.getByText(/同じ支出を二回入れないためです/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '働き方ステップを開く' }));

    expect(screen.getByText('働き方の重さ')).toBeTruthy();
    expect(screen.getByText(/有給・残業整理・在宅相談など低リスクな順番/)).toBeTruthy();
    expect(screen.getByText('今の会社で軽くできそうな余地')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '準備ステップを開く' }));

    expect(screen.getByText('不安と準備の進み具合')).toBeTruthy();
    expect(screen.getByText('転職や働き方変更の準備')).toBeTruthy();
    expect(screen.getByText('お金の準備感')).toBeTruthy();
    expect(screen.getByText('お金の不安感')).toBeTruthy();
  });

  it('未入力の選択肢を勝手に選択済みにしない', () => {
    render(
      <DiagnosisFlow
        inputs={defaultCompassInputs}
        step="life"
        onChange={vi.fn()}
        onStepChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '働き方ステップを開く' }));
    expect(screen.getByRole('button', { name: /少し働いて暮らしたい/ }).className).not.toContain('border-emerald-500');
  });

  it('結果画面から詳細入力へ進める', () => {
    render(
      <DiagnosisFlow
        inputs={defaultCompassInputs}
        step="result"
        onChange={vi.fn()}
        onStepChange={vi.fn()}
      />,
    );

    expect(screen.getByText('診断が出ました')).toBeTruthy();
    expect(screen.getByText('必要なところだけ詳しく入れる')).toBeTruthy();
    expect(screen.getByText('最初の4つを直す')).toBeTruthy();
  });
});
