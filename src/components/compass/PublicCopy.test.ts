import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const publicFiles = [
  'index.html',
  'src/App.tsx',
  'src/components/compass/DiagnosisFlow.tsx',
  'src/components/compass/ResultSections.tsx',
  'src/components/compass/WeeklyQuestBoard.tsx',
];

const publicText = publicFiles
  .map((file) => readFileSync(join(root, file), 'utf8'))
  .join('\n');

describe('public release copy', () => {
  it('公開UIに古いミッション名と資産入力名を残さない', () => {
    expect(publicText).not.toContain('今週のミッション');
    expect(publicText).not.toContain('現在の資産');
  });

  it('公開UIは生活コンパスの核を先に伝える', () => {
    expect(publicText).toContain('働き方を軽くする、生活コンパス診断。');
    expect(publicText).toContain('今の余力と整える順番');
    expect(publicText).toContain('生活を壊さずに自由を増やす');
    expect(publicText).toContain('時間を取り戻す道具');
    expect(publicText).not.toContain('FIREシミュレーター');
    expect(publicText).not.toContain('おすすめ');
    expect(publicText).not.toContain('Lv.');
  });

  it('公開UIに計算前提と免責を表示する', () => {
    expect(publicText).toContain('急な出費にそなえるお金は、すぐ使える貯金だけで見ます');
    expect(publicText).toContain('投資で増える計算は、投資しているお金だけに使います');
    expect(publicText).toContain('将来の結果は約束できません');
    expect(publicText).toContain('だいたいの位置');
  });

  it('公開UIではミッション候補を選ばせない', () => {
    expect(publicText).not.toContain('他のミッション');
    expect(publicText).toContain('次の判断');
    expect(publicText).toContain('今の不足額');
    expect(publicText).toContain('今の余力');
    expect(publicText).toContain('いくら動かすと変わるか');
  });

  it('公開UIは入力やバッジの意味を曖昧にしない', () => {
    expect(publicText).toContain('月収（手取り）');
    expect(publicText).toContain('種類:');
    expect(publicText).toContain('手間:');
    expect(publicText).not.toContain('長期の自由ライン');
  });
});
