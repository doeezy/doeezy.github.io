import { CONFIG } from '../config-global';
import { Helmet } from 'react-helmet-async';
import { PostListView } from '../sections/blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Home | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PostListView category="all" />
    </>
  );
}
