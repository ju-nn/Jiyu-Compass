import type {
  CareerReadinessLevel,
  EmploymentType,
  ExperienceLevel,
  HouseholdRiskLevel,
  MoneyStressLevel,
  WorkFlexibilityLevel,
  WorkPainLevel,
  WorkReductionGoal,
} from '../../utils/compass';

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

export const employmentTypeOptions: { value: EmploymentType; label: string }[] = [
  { value: 'employee', label: '会社員・公務員' },
  { value: 'freelance', label: 'フリーランス・自営業' },
  { value: 'unstable', label: '契約・派遣・収入変動あり' },
];

export const householdRiskOptions: { value: HouseholdRiskLevel; label: string }[] = [
  { value: 'low', label: '身軽め' },
  { value: 'medium', label: '家族・家賃など少し重め' },
  { value: 'high', label: '子ども・単一収入・ローンなど重め' },
];

export const workFlexibilityOptions: { value: WorkFlexibilityLevel; label: string; detail: string }[] = [
  { value: 'none', label: '少なそう', detail: '社内では動かしにくい' },
  { value: 'some', label: '少しありそう', detail: '在宅・時差・業務量調整などは相談できる' },
  { value: 'strong', label: 'かなりありそう', detail: '時短・週4・異動なども候補にできる' },
];

export const careerReadinessOptions: { value: CareerReadinessLevel; label: string }[] = [
  { value: 'none', label: 'まだ' },
  { value: 'some', label: '情報収集中' },
  { value: 'ready', label: '書類や面談を進めている' },
];
