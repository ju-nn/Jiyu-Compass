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

  it('資産入力は貯金と投資資産に分かれている', () => {
    render(
      <DiagnosisFlow
        inputs={defaultCompassInputs}
        step="profile"
        onChange={vi.fn()}
        onStepChange={vi.fn()}
      />,
    );

    expect(screen.getByText('貯金')).toBeTruthy();
    expect(screen.getByText('投資資産 任意')).toBeTruthy();
    expect(screen.queryByText('現在の資産')).toBeNull();
    expect(screen.getByText(/まだなければ0円のままで大丈夫/)).toBeTruthy();
  });
});
