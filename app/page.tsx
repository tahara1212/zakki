import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from "next/link";

// ドキュメントの型定義
interface Doc {
  id: string;
  title: string;
  category: string;
  [key: string]: string | undefined; // その他のメタデータを許可するためのインデックスシグネチャ
}

// カテゴリごとにグループ化したオブジェクトの型定義
interface Acc {
  [category: string]: Doc[]; // カテゴリをキーに持ち、Docの配列を値に持つオブジェクト
}

export default function Home() {
  const docsData = path.join(process.cwd(), `app/_docs/`);
  const fileNames = fs.readdirSync(docsData);
  const allDocsData = fileNames.map((fileName) => {
    // .md拡張子を除去してidを取得
    const id = fileName.replace(/\.md$/, '');

    // マークダウンファイルを文字列として読み込む
    const fullPath = path.join(docsData, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // マークダウンファイルのメタデータ部分を解析する
    const matterResult = matter(fileContents);

    const category = matterResult.data.category || "未分類"

    // idとメタデータを返す
    return {
      id,
      title: matterResult.data.title || id,
      category,
      ...matterResult.data,
    };
  });
  
  // カテゴリごとに記事をグループ化
  const groupedByCategory = allDocsData.reduce<Acc>((acc, doc) => {
    (acc[doc.category] = acc[doc.category] || []).push(doc);
    return acc;
  }, {});

  return (
    <main className='main'>
      <div className='docs'>
        {Object.entries(groupedByCategory).map(([category, docs]) => (
          <div key={category}>
            <h2 className='docs__category'>{category}</h2>
            <hr className='hr' />
            <ul className='docs__container'>
              {docs.map(({ id, title }) => (
                <li key={id} className='docs__item'>
                  <Link href={`docs/${id}`}>
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className='playground'>
        <Link href={`key?key=hoge`}>
          Keyへ
        </Link>
      </div>
    </main>

  );
}
