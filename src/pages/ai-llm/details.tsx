import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { PostDetailsView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { title } = useParams();

  return (
    <>
      <Helmet>
        <title> {`${title ?? ''} | ${CONFIG.appName}`}</title>
      </Helmet>

      <PostDetailsView title={title ?? ''} category="ai-llm" />
    </>
  );
}
