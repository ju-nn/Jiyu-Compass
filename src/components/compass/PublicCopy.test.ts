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

  it('公開UIに計算前提と免責を表示する', () => {
    expect(publicText).toContain('生活防衛資金は貯金だけで判定');
    expect(publicText).toContain('投資利回りは投資資産だけに適用');
    expect(publicText).toContain('将来の成果を保証しません');
    expect(publicText).toContain('ざっくりした位置の目安');
  });

  it('公開UIではミッション候補を選ばせない', () => {
    expect(publicText).not.toContain('他のミッション');
    expect(publicText).toContain('次の1手');
    expect(publicText).toContain('生活のヒント');
  });
});
