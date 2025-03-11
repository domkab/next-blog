export interface FormData {
  title: string
  content: string;
  image?: string;
  category: string;
}

export enum PostCategory {
  Uncategorized = 'uncategorized',
  JavaScript = 'javascript',
  ReactJS = 'reactjs',
  NextJS = 'nextjs'
}