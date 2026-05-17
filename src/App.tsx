import { useEffect, useMemo, useState } from 'react';
import { Flag, ListChecks, MapPinned, RefreshCcw, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import './App.css';
import {
  COMPASS_STORAGE_KEY,
  defaultCompassSaveData,
  evaluateCompass,
  normalizeCompassSaveData,
  selectQuest,
  type CompassInputs,
  type CompassSaveData,
  type DiagnosisStep,
} from './utils/compass';
import { safeGetLocalStorage, safeSetLocalStorage } from './utils/storage';
import { DiagnosisFlow } from './components/compass/DiagnosisFlow';
import {
  CollapsibleSection,
  DiagnosisScopeNote,
  MoneyTools,
  ResultStory,
  TimeRecoveryTools,
} from './components/compass/ResultSections';
import { MissionGuide } from './components/compass/WeeklyQuestBoard';

const INTRO_DISMISSED_KEY = `${COMPASS_STORAGE_KEY}:introDismissed`;

function App() {
  const [saveData, setSaveData] = useState<CompassSaveData>(() => {
    const stored = safeGetLocalStorage<CompassSaveData | CompassInputs>(
      COMPASS_STORAGE_KEY,
      defaultCompassSaveData,
    );

    const normalized = normalizeCompassSaveData(stored);
    return {
      ...normalized,
      diagnosisStep: 'inputs' in stored
        ? normalized.diagnosisStep
        : safeGetLocalStorage(`${COMPASS_STORAGE_KEY}:started`, false)
          ? 'result'
          : 'profile',
    };
  });
  const [showMissionGuide, setShowMissionGuide] = useState(false);
  const [activeView, setActiveView] = useState<'diagnosis' | 'tools' | 'time'>('diagnosis');
  const [showIntro, setShowIntro] = useState(() => !safeGetLocalStorage(INTRO_DISMISSED_KEY, false));

  const result = useMemo(() => evaluateCompass(saveData.inputs), [saveData.inputs]);
  const primaryMission = result.recommendedQuests.find(q => !saveData.completedQuestIds.includes(q.id)) ?? result.recommendedQuests[0] ?? null;

  useEffect(() => {
    safeSetLocalStorage(COMPASS_STORAGE_KEY, saveData);
  }, [saveData]);

  const updateInput = <K extends keyof CompassInputs>(key: K, value: CompassInputs[K]) => {
    setSaveData((current) => ({
      ...current,
      inputs: {
        ...current.inputs,
        [key]: value,
      },
    }));
  };

  const setDiagnosisStep = (diagnosisStep: DiagnosisStep) => {
    setSaveData((current) => ({
      ...current,
      diagnosisStep,
    }));
    if (diagnosisStep !== 'quest') {
      setShowMissionGuide(false);
    }
    if (diagnosisStep === 'profile' || diagnosisStep === 'life') {
      setActiveView('diagnosis');
    }
  };

  const reset = () => {
    setSaveData(defaultCompassSaveData);
    setActiveView('diagnosis');
    setShowMissionGuide(false);
  };

  const dismissIntro = () => {
    setShowIntro(false);
    safeSetLocalStorage(INTRO_DISMISSED_KEY, true);
  };

  const handleOpenMission = (questId: string) => {
    setShowMissionGuide(true);
    setSaveData((current) => selectQuest(current, questId));
  };

  const hasResult = saveData.diagnosisStep === 'result' || saveData.diagnosisStep === 'quest';

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/35 px-4 pb-4 pt-16 sm:items-center sm:justify-center sm:p-6">
          <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  <MapPinned className="h-4 w-4" />
                  生活コンパス
                </p>
                <h2 className="text-2xl font-black leading-tight text-slate-950">
                  30秒で、生活の土台と最初の一歩を見る。
                </h2>
              </div>
              <button
                type="button"
                onClick={dismissIntro}
                aria-label="説明を閉じる"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              最初は年齢、貯金、月収（手取り）、生活費だけで大丈夫です。生活防衛資金、資産が生活費を支える割合、働き方を軽くする順番をまとめて見ます。
            </p>
            <button
              type="button"
              onClick={dismissIntro}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
            >
              診断をはじめる
            </button>
          </section>
        </div>
      )}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                <Flag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-emerald-700">生活コンパス診断</p>
                <h1 className="text-2xl font-black tracking-normal text-slate-950">ジユウノコンパス</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="https://ju-nn.github.io/archive/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                作者の情報をみる
              </a>
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                リセット
              </button>
            </div>
          </div>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              お金と働き方の現在地がわかる、生活コンパス診断。
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              生活費・貯金・投資額・仕事のしんどさから、今の余力と整える順番を確認します。
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              退職や投資を煽らず、生活を壊さずに自由を増やすための、小さな生活設計ツールです。
            </p>
          </div>
          {hasResult && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setActiveView('diagnosis')}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-black transition ${
                  activeView === 'diagnosis'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Flag className="h-4 w-4" />
                診断結果
              </button>
              <button
                type="button"
                onClick={() => setActiveView('tools')}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-black transition ${
                  activeView === 'tools'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                固定費を軽くする
              </button>
              <button
                type="button"
                onClick={() => setActiveView('time')}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-black transition ${
                  activeView === 'time'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                時間を取り戻す
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="space-y-6">
          {(!hasResult || saveData.diagnosisStep === 'profile' || saveData.diagnosisStep === 'life') && (
            <DiagnosisFlow
              inputs={saveData.inputs}
              step={saveData.diagnosisStep}
              onChange={updateInput}
              onStepChange={setDiagnosisStep}
            />
          )}

          {hasResult && activeView === 'tools' && (
            <MoneyTools result={result} />
          )}

          {hasResult && activeView === 'time' && (
            <TimeRecoveryTools result={result} />
          )}

          {hasResult && activeView === 'diagnosis' && saveData.diagnosisStep !== 'profile' && saveData.diagnosisStep !== 'life' && (
            <>
              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-emerald-700">Compass</p>
                    <h2 className="text-lg font-black text-slate-950">今の状態</h2>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setDiagnosisStep('life')}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-black text-white transition hover:bg-slate-800"
                    >
                      <ListChecks className="h-4 w-4" />
                      詳しく入れる
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiagnosisStep('profile')}
                      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      最初の4つを直す
                    </button>
                  </div>
                </div>
              </section>

              {primaryMission && (
                <ResultStory
                  result={result}
                  mission={primaryMission}
                  completed={saveData.completedQuestIds.includes(primaryMission.id)}
                  onSelect={handleOpenMission}
                />
              )}
              {primaryMission && showMissionGuide && (
                <MissionGuide
                  result={result}
                  mission={primaryMission}
                />
              )}
              <CollapsibleSection
                title="この診断の見方"
                body="計算で見ている範囲と、将来の変化として注意したいこと。必要なときだけ開けます。"
              >
                <DiagnosisScopeNote />
              </CollapsibleSection>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
