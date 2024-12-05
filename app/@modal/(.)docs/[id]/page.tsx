import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Modal } from "./modal";

interface ModalPageProps {
  params: Promise<{ id: string }>;
}

const DetailPage = async ({ params }: ModalPageProps) => {
  const { id } = await params
  const filePath = path.join(process.cwd(), `app/_docs/${id}.md`);

  // ファイルが存在しない場合のエラーハンドリング
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found');
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);
    return (
      <Modal>
        <ReactMarkdown remarkPlugins={[remarkGfm]} className='markdown'>
          {content}
        </ReactMarkdown>
      </Modal>
    );
  };
  
export default DetailPage;