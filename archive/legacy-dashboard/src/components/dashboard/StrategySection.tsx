import React from 'react';
import { SimulationTab } from './SimulationTab';
import { AnalysisTab } from './AnalysisTab';
import { CareerPlanner } from '../CareerPlanner';
import { WorkStyleSimulator } from '../WorkStyleSimulator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import type { FireInputs, SimulationData, MonteCarloResult } from '../../utils/calculations';
import type { ExpenseBreakdown, FireCourse, SavedJob, MbtiType } from '../../types';

interface StrategySectionProps {
    inputs: FireInputs;
    fireNumber: number;
    data: SimulationData[];
    mcData: MonteCarloResult[];
    isMonteCarlo: boolean;
    setIsMonteCarlo: (val: boolean) => void;
    useNisa: boolean;
    sideFireShortcut: number | null;
    onDiagnosisSideFire: () => void;
    grossIncome: number;
    expenseBreakdown: ExpenseBreakdown | null;
    onOpenExpenseBreakdown: () => void;
    fireCourse: FireCourse | null;
    savedJobs: SavedJob[];
    onSaveJob: (job: SavedJob) => void;
    onRemoveJob: (jobId: string) => void;
    mbti: MbtiType | null;
    investmentReturnRate: number;
    monthlyPension: number;
    pensionStartAge: number;
    pastData: { age: number; assets: number }[];
    showPast: boolean;
    setShowPast: (val: boolean) => void;
}

export const StrategySection: React.FC<StrategySectionProps> = (props) => {
    return (
        <div className="space-y-6 animate-slide-in-bottom">
            <Tabs defaultValue="simulation" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="simulation">📈 資産シミュレーション</TabsTrigger>
                    <TabsTrigger value="analysis">📊 アドバイス・家計分析</TabsTrigger>
                </TabsList>

                <TabsContent value="simulation" className="space-y-6">
                    <SimulationTab
                        inputs={props.inputs}
                        fireNumber={props.fireNumber}
                        data={props.data}
                        mcData={props.mcData}
                        isMonteCarlo={props.isMonteCarlo}
                        setIsMonteCarlo={props.setIsMonteCarlo}
                        useNisa={props.useNisa}
                        sideFireShortcut={props.sideFireShortcut}
                        onDiagnosisSideFire={props.onDiagnosisSideFire}
                        pastData={props.pastData}
                        showPast={props.showPast}
                        setShowPast={props.setShowPast}
                    />

                    {/* Integrated Career & Workstyle Tools */}
                    <div className="grid grid-cols-1 gap-6 pt-6 border-t border-slate-200">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <span>🚀</span> FIREを加速させる戦略
                        </h3>
                        <WorkStyleSimulator
                            currentAge={props.inputs.currentAge}
                            currentAssets={props.inputs.currentAssets}
                            currentIncome={props.inputs.annualIncome}
                            expenses={props.inputs.annualExpenses}
                            returnRate={props.investmentReturnRate}
                            fireNumber={props.fireNumber}
                        />
                        <CareerPlanner
                            currentAge={props.inputs.currentAge}
                            currentAssets={props.inputs.currentAssets}
                            annualExpenses={props.inputs.annualExpenses}
                            returnRate={props.investmentReturnRate}
                            monthlyPension={props.monthlyPension}
                            pensionStartAge={props.pensionStartAge}
                            fireCourse={props.fireCourse}
                            mbti={props.mbti}
                            savedJobs={props.savedJobs}
                            onSaveJob={props.onSaveJob}
                            onRemoveJob={props.onRemoveJob}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="analysis">
                    <AnalysisTab
                        inputs={props.inputs}
                        fireNumber={props.fireNumber}
                        grossIncome={props.grossIncome}
                        expenseBreakdown={props.expenseBreakdown}
                        onSwitchToSimulation={() => { }} // Disabled since tabs handle this
                        onOpenExpenseBreakdown={props.onOpenExpenseBreakdown}
                        fireCourse={props.fireCourse}
                        savedJobs={props.savedJobs}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};
