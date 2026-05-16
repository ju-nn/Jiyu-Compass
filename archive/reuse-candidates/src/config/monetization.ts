// 収益化に関する設定・データを一元管理するファイル

export const MONETIZATION = {
    // 投げ銭 (Buy Me a Coffee) のクリエイターURL
    // ※後でご自身のURL (例: https://buymeacoffee.com/yourname) に変更してください
    buyMeACoffeeUrl: 'https://buymeacoffee.com/',

    // AmazonアソシエイトのトラッキングID（タグ）
    // ※審査通過後に「your-tag-22」のようなご自身のIDに変更してください
    amazonTrackingId: 'YOUR_AMAZON_TAG-22',
};

const amazonBookUrl = (asin: string) =>
    `https://www.amazon.co.jp/dp/${asin}?tag=${MONETIZATION.amazonTrackingId}`;

// おすすめ書籍リスト
export const RECOMMENDED_BOOKS = [
    {
        id: 'book-1',
        title: '本当の自由を手に入れる お金の大学',
        author: '両＠リベ大学長',
        description: 'FIREを目指すなら必読。貯める・稼ぐ・増やす・守る・使うの5つの力を鍛える実践的なガイド。',
        imageUrl: 'https://m.media-amazon.com/images/I/81I-R7-W3TL._SY466_.jpg',
        amazonUrl: amazonBookUrl('447810996X'),
        category: '基礎',
        fitFor: ['lean', 'barista', 'side', 'fat'],
        reason: 'まず家計・副業・投資の全体像をつかみたい段階に合います。',
    },
    {
        id: 'book-2',
        title: 'DIE WITH ZERO 人生が豊かになりすぎる究極のルール',
        author: 'ビル・パーキンス',
        description: 'ただお金を貯めるだけでなく、どう使うかに焦点を当てた、人生の満足度を最大化する考え方。',
        imageUrl: 'https://m.media-amazon.com/images/I/71R12H19tDL._SY466_.jpg',
        amazonUrl: amazonBookUrl('4478111247'),
        category: 'マインドセット',
        fitFor: ['fat', 'barista'],
        reason: 'お金を増やすだけでなく、時間と経験への使い方を整えたい人向けです。',
    },
    {
        id: 'book-3',
        title: 'ウォール街のランダム・ウォーカー',
        author: 'バートン・マルキール',
        description: 'インデックス投資のバイブル。個別株投資やアクティブファンドの問題点をデータで解説。',
        imageUrl: 'https://m.media-amazon.com/images/I/81dGXYYf+kL._AC_UY218_.jpg',
        amazonUrl: amazonBookUrl('453235831X'),
        category: '投資',
        fitFor: ['lean', 'fat'],
        reason: '長期投資の方針をブレにくくしたい段階に向いています。',
    },
    {
        id: 'book-4',
        title: 'サイコロジー・オブ・マネー',
        author: 'モーガン・ハウセル',
        description: 'お金に対する人間の心理と行動の法則。投資のテクニック以上に重要な「心の持ち方」を学ぶ。',
        imageUrl: 'https://m.media-amazon.com/images/I/71tQ9wSntEL._SY466_.jpg',
        amazonUrl: amazonBookUrl('429600049X'),
        category: 'マインドセット',
        fitFor: ['side', 'fat', 'barista'],
        reason: '収入や資産が増えてきた時の判断ミスを減らす助けになります。',
    },
    {
        id: 'book-5',
        title: 'FIRE 最強の早期リタイア術',
        author: 'クリスティー・シェン、ブライス・リャン',
        description: 'FIRE達成者の実例をもとに、貯蓄率・投資・生活設計を現実的に組み立てるための一冊。',
        imageUrl: 'https://m.media-amazon.com/images/I/71k8NoHtxlL._SY466_.jpg',
        amazonUrl: amazonBookUrl('4478108572'),
        category: 'FIRE実践',
        fitFor: ['lean', 'side'],
        reason: 'FIREまでの道筋を具体的な行動に落とし込みたい人に合います。',
    },
    {
        id: 'book-6',
        title: 'JUST KEEP BUYING 自動的に富が増え続ける「お金」と「時間」の法則',
        author: 'ニック・マジューリ',
        description: 'データをもとに、収入・貯蓄・投資の意思決定をシンプルにするための考え方を学べます。',
        imageUrl: 'https://m.media-amazon.com/images/I/71PUV4dY85L._SY466_.jpg',
        amazonUrl: amazonBookUrl('4478116982'),
        category: '投資',
        fitFor: ['side', 'fat', 'lean'],
        reason: '積立投資を続ける根拠を持ちたい人におすすめです。',
    }
];
