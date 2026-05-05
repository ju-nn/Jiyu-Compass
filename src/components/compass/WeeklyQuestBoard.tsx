import { CheckCircle2, Lightbulb, ListChecks, TimerReset } from 'lucide-react';
import type { Mission } from '../../utils/compass';

interface MissionGuideProps {
  mission: Mission;
  completed: boolean;
  checkedIds: string[];
  onToggleCheck: (missionId: string, checkId: string) => void;
  onComplete: (missionId: string) => void;
}

const categoryLabel: Record<Mission['category'], string> = {
  saving: '支出を軽くする',
  income: '収入を安定させる',
  defense: '貯金を守る',
  investment: '投資の準備',
  work: '働き方を軽くする',
};

const difficultyLabel: Record<Mission['difficulty'], string> = {
  easy: 'かんたん',
  normal: 'ふつう',
  boss: 'しっかり',
};

export function MissionGuide({
  mission,
  completed,
  checkedIds,
  onToggleCheck,
  onComplete,
}: MissionGuideProps) {
  const allChecksDone = mission.completionChecks.every((_, index) => checkedIds.includes(String(index)));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <TimerReset className="mt-1 h-5 w-5 text-emerald-700" />
          <div>
            <p className="text-xs font-black text-emerald-800">次の1手</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{mission.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{mission.body}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">
            {categoryLabel[mission.category]}
          </span>
          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">
            {difficultyLabel[mission.difficulty]}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <section className="rounded-lg bg-slate-50 p-4">
            <h4 className="font-black text-slate-950">なぜこれをやるか</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{mission.why}</p>
          </section>

          <section className="rounded-lg bg-slate-50 p-4">
            <h4 className="flex items-center gap-2 font-black text-slate-950">
              <ListChecks className="h-4 w-4 text-emerald-700" />
              やること
            </h4>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {mission.steps.map((step, index) => (
                <li key={step} className="flex gap-2">
                  <span className="font-black text-emerald-700">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-lg bg-amber-50 p-4">
            <h4 className="flex items-center gap-2 font-black text-slate-950">
              <Lightbulb className="h-4 w-4 text-amber-700" />
              生活のヒント
            </h4>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {mission.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="font-black text-slate-950">完了前チェック</h4>
            <div className="mt-3 space-y-2">
              {mission.completionChecks.map((check, index) => {
                const checkId = String(index);
                const checked = checkedIds.includes(checkId);

                return (
                  <label
                    key={check}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-emerald-100 bg-white p-3 text-sm font-bold text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleCheck(mission.id, checkId)}
                      className="mt-1 h-4 w-4 accent-emerald-600"
                    />
                    <span>{check}</span>
                  </label>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => onComplete(mission.id)}
              disabled={completed || !allChecksDone}
              className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-black transition ${
                completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {completed ? '完了済' : '完了にする'}
            </button>
            {!allChecksDone && !completed && (
              <p className="mt-2 text-xs leading-5 text-slate-500">
                チェックがそろうと完了できます。自己申告でOKです。
              </p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
