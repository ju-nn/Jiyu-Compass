import { useEffect, useMemo, useState } from 'react';
import { Flag, RefreshCcw } from 'lucide-react';
import './App.css';
import {
  COMPASS_STORAGE_KEY,
  completeQuest,
  defaultCompassSaveData,
  evaluateCompass,
  normalizeCompassSaveData,
  selectQuest,
  toggleQuestCheck,
  type CompassInputs,
  type CompassSaveData,
  type DiagnosisStep,
} from './utils/compass';
import { safeGetLocalStorage, safeSetLocalStorage } from './utils/storage';
import { DiagnosisFlow } from './components/compass/DiagnosisFlow';
import {
  DiagnosisScopeNote,
  ResultStory,
  StartPanel,
} from './components/compass/ResultSections';
import { MissionGuide } from './components/compass/WeeklyQuestBoard';

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

  const result = useMemo(() => evaluateCompass(saveData.inputs), [saveData.inputs]);
  const primaryMission = result.recommendedQuests.find(q => !saveData.completedQuestIds.includes(q.id)) ?? result.recommendedQuests[0] ?? null;
  const primaryMissionChecks = primaryMission ? saveData.questCheckState[primaryMission.id] ?? [] : [];

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
  };

  const reset = () => {
    setSaveData(defaultCompassSaveData);
  };

  const handleOpenMission = (questId: string) => {
    setShowMissionGuide(true);
    setSaveData((current) => selectQuest(current, questId));
  };

  const handleCompleteQuest = (questId: string) => {
    const quest = primaryMission?.id === questId ? primaryMission : null;
    const requiredCheckIds = quest?.completionChecks.map((_, index) => String(index)) ?? [];
    setSaveData((current) => completeQuest(current, questId, requiredCheckIds));
  };

  const handleToggleQuestCheck = (questId: string, checkId: string) => {
    setSaveData((current) => toggleQuestCheck(current, questId, checkId));
  };

  const hasResult = saveData.diagnosisStep === 'result' || saveData.diagnosisStep === 'quest';

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                <Flag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-emerald-700">Jiyu Compass v0.7</p>
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
            <p className="text-base leading-7 text-slate-600">
              貯金がうまくできない人も、毎月ギリギリの人も、働く時間を少し減らしたい人も。
              まずは今できる一歩から、生活を整えるミッション診断。
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <aside className="self-start lg:sticky lg:top-6">
          <DiagnosisFlow
            inputs={saveData.inputs}
            step={saveData.diagnosisStep}
            onChange={updateInput}
            onStepChange={setDiagnosisStep}
          />
        </aside>

        <section className="space-y-6">
          {!hasResult ? (
            <StartPanel />
          ) : (
            <>
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
                  mission={primaryMission}
                  completed={saveData.completedQuestIds.includes(primaryMission.id)}
                  checkedIds={primaryMissionChecks}
                  onToggleCheck={handleToggleQuestCheck}
                  onComplete={handleCompleteQuest}
                />
              )}
              <div className="pt-4">
                <DiagnosisScopeNote />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
