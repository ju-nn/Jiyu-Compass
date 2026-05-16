import type { ExperienceLevel, MoneyStressLevel, WorkPainLevel, WorkReductionGoal } from '../../utils/compass';

export const workGoalOptions: { value: WorkReductionGoal; label: string; detail: string }[] = [
  { value: 'stabilize', label: 'まず安心したい', detail: '赤字や不安定さを減らす' },
  { value: 'save', label: '貯金を増やしたい', detail: '毎月残るお金を作る' },
  { value: 'reduce_work', label: '仕事を軽くしたい', detail: '働く時間や負担を減らす' },
  { value: 'semi_retire', label: '少し働いて暮らしたい', detail: '収入と自由時間のバランスを取る' },
  { value: 'fire', label: 'いつか働かない選択がほしい', detail: '資産で生活を支える' },
];

export const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: 'none', label: 'まだ' },
  { value: 'starting', label: 'これから' },
  { value: 'some', label: '少しある' },
];

export const moneyStressOptions: { value: MoneyStressLevel; label: string; detail: string }[] = [
  { value: 'low', label: '低め', detail: '今はそこまで焦っていない' },
  { value: 'medium', label: '少し不安', detail: '早めに整えたい' },
  { value: 'high', label: '高い', detail: 'かなりしんどい。早く立て直したい' },
];

export const workPainOptions: { value: WorkPainLevel; label: string; detail: string }[] = [
  { value: 'low', label: 'まだ平気', detail: '働く量は今のままでもよい' },
  { value: 'medium', label: '少し重い', detail: 'できれば減らしたい' },
  { value: 'high', label: 'かなりしんどい', detail: '早く軽くしたい' },
];
