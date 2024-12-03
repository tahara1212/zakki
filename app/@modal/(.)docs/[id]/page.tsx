import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ParsedUrlQuery } from 'querystring';

interface Params extends ParsedUrlQuery {
  id: string;
}
import Link from "next/link";
import { Modal } from "./modal";

interface ModalPageProps {
  params: Params;
}

const DetailPage = ({ params }: ModalPageProps) => {
  const { id } = params;
  const filePath = path.join(process.cwd(), `app/_docs/${id}.md`);
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