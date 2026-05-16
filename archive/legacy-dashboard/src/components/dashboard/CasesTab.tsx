import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import type { FireCourse } from '../../types';

const CASE_STUDIES = [
    {
        id: 'fat-fire-couple',
        title: '共働き・都市部居住でのFat FIRE',
        assets: '1.5億円',
        age: '42歳',
        course: 'fat',
        description: '高年収を活かした積極投資と、都内マンションの売却益で早期リタイアを実現。'
    },
    {
        id: 'lean-fire-single',
        title: '極限の節約生活で実現したLean FIRE',
        assets: '3500万円',
        age: '35歳',
        course: 'lean',
        description: '地方移住と徹底した固定費削減により、月8万円の生活費で自由を獲得。'
    },
    {
        id: 'side-fire-freelance',
        title: '好きな仕事と両立するSide FIRE',
        assets: '6000万円',
        age: '38歳',
        course: 'side',
        description: '週3日のフリーランスエンジニアとして働きながら、資産からの配当で生活レベルを維持。'
    },
    {
        id: 'barista-fire-cafe',
        title: '趣味のカフェ店員として楽しむBarista FIRE',
        assets: '8000万円',
        age: '45歳',
        course: 'barista',
        description: '大手企業を早期退職し、健康保険のためにパートとして働きつつ、資産寿命を延ばす戦略。'
    }
];

interface CasesTabProps {
    fireCourse: FireCourse | null;
}

export const CasesTab: React.FC<CasesTabProps> = ({ fireCourse }) => {
    const filteredCases = fireCourse
        ? CASE_STUDIES.filter(c => c.course === fireCourse)
        : CASE_STUDIES;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800">
                    {fireCourse ? `${fireCourse.toUpperCase()} FIREのロールモデル` : '注目のFIRE事例'}
                </h3>
                {fireCourse && (
                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-bold border border-indigo-100">
                        コースマッチ
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCases.map(caseStudy => (
                    <Card key={caseStudy.id} className="hover:border-indigo-200 transition-all group">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
                            <CardTitle className="text-sm font-bold text-slate-800">{caseStudy.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex gap-4 mb-3">
                                <div className="text-center p-2 bg-indigo-50 rounded-lg flex-1">
                                    <div className="text-[10px] text-indigo-400 font-bold uppercase">資産</div>
                                    <div className="text-sm font-black text-indigo-700">{caseStudy.assets}</div>
                                </div>
                                <div className="text-center p-2 bg-emerald-50 rounded-lg flex-1">
                                    <div className="text-[10px] text-emerald-400 font-bold uppercase">年齢</div>
                                    <div className="text-sm font-black text-emerald-700">{caseStudy.age}</div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-900">
                                {caseStudy.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
