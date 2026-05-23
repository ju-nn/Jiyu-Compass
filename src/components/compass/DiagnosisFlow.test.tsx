import { render, screen } from '@testing-library/react';
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

  it('詳細入力では資産と固定負担をまとめて入力できる', () => {
    render(
      <DiagnosisFlow
        inputs={defaultCompassInputs}
        step="life"
        onChange={vi.fn()}
        onStepChange={vi.fn()}
      />,
    );

    expect(screen.getByText('全部入れなくてOKです')).toBeTruthy();
    expect(screen.getByText(/空欄は診断に使わず、入れた項目だけ結果を細かくします/)).toBeTruthy();
    expect(screen.getByText('資産')).toBeTruthy();
    expect(screen.getByText(/投資しているお金を入れると、資産が生活費をどれくらい支えるか/)).toBeTruthy();
    expect(screen.getByText('投資しているお金')).toBeTruthy();
    expect(screen.getByText('固定負担')).toBeTruthy();
    expect(screen.getByText(/返済・保険料を分けると、毎月の余力をより正確に見られます/)).toBeTruthy();
    expect(screen.getByText('月の生活費（返済・保険料を除く）')).toBeTruthy();
    expect(screen.getByText('自分で払う保険料')).toBeTruthy();
    expect(screen.getByText('年金が少なくなりそうな年数')).toBeTruthy();
    expect(screen.getByText('奨学金の返済')).toBeTruthy();
    expect(screen.getByText('住宅ローン')).toBeTruthy();
    expect(screen.getAllByText('働き方').length).toBeGreaterThan(0);
    expect(screen.getByText(/しんどさや緩める余地を入れると、有給・在宅・転職準備などの順番が変わります/)).toBeTruthy();
    expect(screen.getByText('不安感・経験')).toBeTruthy();
    expect(screen.getByText(/不安が強いときは、投資より先に守りのミッションを出します/)).toBeTruthy();
    expect(screen.getAllByText(/結果の「生活防衛資金」に反映/).length).toBeGreaterThan(0);
    expect(screen.getByText('結果の「資産カバー率」に反映')).toBeTruthy();
    expect(screen.getByText('結果の「働き方を緩める余地」に反映')).toBeTruthy();
    expect(screen.getByText(/給料から引かれている分は入れなくて大丈夫/)).toBeTruthy();
    expect(screen.getByText(/普通は0年で大丈夫/)).toBeTruthy();
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

    expect(screen.getByRole('button', { name: /仕事を軽くしたい/ }).className).not.toContain('border-emerald-500');
    expect(screen.getByRole('button', { name: /かなりしんどい早く軽くしたい/ }).className).not.toContain('border-emerald-500');
    expect(screen.getAllByRole('option', { name: '未入力' }).length).toBeGreaterThan(0);
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
    expect(screen.getByText('もう少し詳しく入れる')).toBeTruthy();
    expect(screen.getByText('最初の4つを直す')).toBeTruthy();
  });
});
