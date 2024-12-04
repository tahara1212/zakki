import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const docsData = path.join(process.cwd(), `app/_docs/`);
  const fileNames = fs.readdirSync(docsData);
  const allDocsTitle = fileNames.map((fileName) => {
    // .md拡張子を除去してidを取得
    const id = fileName.replace(/\.md$/, '');

    // マークダウンファイルを文字列として読み込む
    const fullPath = path.join(docsData, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // マークダウンファイルのメタデータ部分を解析する
    const matterResult = matter(fileContents);

    // idとメタデータを返す
    return {
      id,
      title: matterResult.data.title || id,
      ...matterResult.data,
    };
  });
  return (
    <div className='docs'>
      <ul className='docs__container'>
        {allDocsTitle.map(({ id, title }) => (
          <li key={id} className='docs__item'>
            <Link href={`docs/${id}`}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
