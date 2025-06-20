import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetPost } from 'src/actions/blog';

import { PostDetailsView } from 'src/sections/blog/view';
import { useEffect, useState } from 'react';
import matter from 'gray-matter';
import { postModulesByCategory } from '../../utils/postModules';
import { paths } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function Page() {
  const { title } = useParams();
  const [markdown, setMarkdown] = useState('');
  const [info, setInfo] = useState<{ [key: string]: any }>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const matchPost = Object.entries(postModulesByCategory.troubleshooting).find(([path, loader]) =>
        path.includes(`${title}.md`)
      );

      if (!matchPost) {
        setMarkdown('파일을 찾을 수 없습니다');
        return;
      }

      const [path, loader] = matchPost;
      const raw = await loader();
      const { data, content } = matter(raw);
      setInfo(data);
      setMarkdown(content);

    };
    fetchPost();
  }, [title]);

  return (
    <>
      <Helmet>
        <title> {`${info?.title ?? ''} | ${CONFIG.appName}`}</title>
      </Helmet>

      <PostDetailsView info={info} post={markdown} backLink={paths.troubleshooting.root} />
    </>
  );
}
