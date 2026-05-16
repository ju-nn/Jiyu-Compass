export interface UpdateItem {
    id: string;
    date: string;
    title: string;
    type: 'feature' | 'fix' | 'content';
    description?: string;
}

export const updates: UpdateItem[] = [
    {
        id: '10',
        date: '2024.12.18',
        title: 'ゲーミフィケーション機能の強化',
        type: 'feature',
        description: '「インフレモンスター」と「SNSシェア機能」を追加しました。'
    },
    {
        id: '9',
        date: '2024.12.18',
        title: 'ヘッダーとナビゲーションの刷新',
        type: 'fix',
        description: 'メニューをヘッダーに移動し、モバイルでの操作性を大幅に向上させました。'
    },
    {
        id: '8',
        date: '2024.12.17',
        title: '詳細シミュレーション設定の追加',
        type: 'feature',
        description: '現役給与のインフレ連動設定と、引退後の想定月収入力が可能になりました。'
    },
    {
        id: '7',
        date: '2024.12.17',
        title: '全体UXブラッシュアップ',
        type: 'fix',
        description: 'モバイルレスポンシブ対応、アニメーション追加、配色の統一を行いました。'
    },
    {
        id: '6',
        date: '2024.12.16',
        title: '家計詳細診断ツールのリリース',
        type: 'feature',
        description: '支出の内訳を入力し、項目ごとの改善アドバイスを受けられるようになりました。'
    },
    {
        id: '5',
        date: '2024.12.15',
        title: '学習コンテンツ機能の追加',
        type: 'content',
        description: 'FIREについて学べる「学習タブ」を追加し、進捗を保存できるようになりました。'
    },
    {
        id: '4',
        date: '2024.12.14',
        title: 'FIRE RPG ランクシステム',
        type: 'feature',
        description: '資産形成の進捗に応じてランク（称号）が付与されるようになりました。'
    },
    {
        id: '3',
        date: '2024.12.13',
        title: '高度なシミュレーション機能',
        type: 'feature',
        description: 'モンテカルロ法による確率計算と、NISA設定の切替に対応しました。'
    },
    {
        id: '2',
        date: '2024.12.10',
        title: '比較チャート機能',
        type: 'feature',
        description: '世間平均との比較ができるレーダーチャートと棒グラフを追加しました。'
    },
    {
        id: '1',
        date: '2024.12.01',
        title: 'ベータ版リリース',
        type: 'content',
        description: '「ジユウノコンパス」のベータ版を公開しました。'
    }
];
