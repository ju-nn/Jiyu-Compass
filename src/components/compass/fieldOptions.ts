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

export const moneyReadinessOptions: { value: ExperienceLevel; label: string; detail: string }[] = [
  { value: 'none', label: 'これから整える', detail: '貯金や投資はまだ手探り' },
  { value: 'starting', label: '少し始めている', detail: '貯金や少額投資を始めたところ' },
  { value: 'some', label: 'だいたい把握している', detail: '貯金・投資の方針が少しある' },
];

export const moneyStressOptions: { value: MoneyStressLevel; label: string; detail: string }[] = [
  { value: 'low', label: '落ち着いている', detail: '今はそこまで焦っていない' },
  { value: 'medium', label: '少し不安', detail: '早めに整えたい' },
  { value: 'high', label: 'かなり不安', detail: 'まず守りを優先したい' },
];

export const workPainOptions: { value: WorkPainLevel; label: string; detail: string }[] = [
  { value: 'low', label: 'まだ平気', detail: '働く量は今のままでもよい' },
  { value: 'medium', label: '少し重い', detail: 'できれば減らしたい' },
  { value: 'high', label: 'かなりしんどい', detail: '早く軽くしたい' },
];

export const employmentTypeOptions: { value: EmploymentType; label: string; detail: string }[] = [
  { value: 'employee', label: '会社員・公務員', detail: '収入は比較的読みやすい' },
  { value: 'freelance', label: '自営業・フリーランス', detail: '収入の波に少し厚めに備えたい' },
  { value: 'unstable', label: '変動が大きい働き方', detail: '契約・派遣・短時間などを含む' },
];

export const householdRiskOptions: { value: HouseholdRiskLevel; label: string; detail: string }[] = [
  { value: 'low', label: '身軽め', detail: '扶養や大きな固定費は少ない' },
  { value: 'medium', label: '少し重め', detail: '家族・家賃・返済のどれかが気になる' },
  { value: 'high', label: '厚めに守りたい', detail: '子ども・単一収入・大きな返済などがある' },
];

export const workFlexibilityOptions: { value: WorkFlexibilityLevel; label: string; detail: string }[] = [
  { value: 'none', label: '少なそう', detail: '社内では動かしにくい' },
  { value: 'some', label: '少しありそう', detail: '在宅・時差・業務量調整などは相談できる' },
  { value: 'strong', label: 'かなりありそう', detail: '時短・週4・異動なども候補にできる' },
];

export const careerReadinessOptions: { value: CareerReadinessLevel; label: string; detail: string }[] = [
  { value: 'none', label: 'まだ動いていない', detail: 'まず今の負荷を下げる準備から' },
  { value: 'some', label: '情報を見ている', detail: '求人保存や条件整理を始めている' },
  { value: 'ready', label: '面談・応募の準備中', detail: '書類や相談を進めている' },
];
