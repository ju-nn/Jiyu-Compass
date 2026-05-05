import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { COMPASS_STORAGE_KEY, defaultCompassSaveData } from './utils/compass';

const renderResultScreen = () => {
  localStorage.setItem(
    COMPASS_STORAGE_KEY,
    JSON.stringify({
      ...defaultCompassSaveData,
      diagnosisStep: 'result',
    }),
  );
  render(<App />);
};

describe('App result screen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('第一ビューは3ステップ導線と詳細を含む', () => {
    renderResultScreen();

    expect(screen.getByText('今の位置')).toBeTruthy();
    expect(screen.getAllByText(/100人の村なら/).length).toBeGreaterThan(0);
    expect(screen.getByText('あなたはこういう状況です')).toBeTruthy();
    expect(screen.getByText('このままだと')).toBeTruthy();
    expect(screen.getByText('でも、こうすると')).toBeTruthy();
    expect(screen.getByText('だから、まずこれ')).toBeTruthy();
    expect(screen.getByText(/お金があなたの代わりに/)).toBeTruthy();
    expect(screen.getByText(/保証するものではありません/)).toBeTruthy();
    expect(screen.getByText('資産推移の概算')).toBeTruthy();
    expect(screen.getByText('段階ゴール')).toBeTruthy();
    expect(screen.getByText('投資についての前提')).toBeTruthy();
  });

  it('次の1手を開くと手順と完了前チェックが使える', () => {
    renderResultScreen();

    fireEvent.click(screen.getByRole('button', { name: /このミッションを進める/ }));

    expect(screen.getByText('次の1手')).toBeTruthy();
    expect(screen.getByText('やること')).toBeTruthy();
    expect(screen.getByText('生活のヒント')).toBeTruthy();
    expect(screen.getByText('完了前チェック')).toBeTruthy();
  });

  it('まずこれのボタンで選択肢ではなく1つのミッション詳細が見える', () => {
    renderResultScreen();

    fireEvent.click(screen.getByRole('button', { name: /このミッションを進める/ }));

    expect(screen.getByText('次の1手')).toBeTruthy();
    expect(screen.queryByText('選んだミッション')).toBeNull();
  });
});
