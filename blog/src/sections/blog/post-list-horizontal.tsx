import type { IPostItem } from 'src/types/blog';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { PostItemSkeleton } from './post-skeleton';
import { PostItemHorizontal } from './post-item-horizontal';
import {useEffect, useState} from "react";
import matter from "gray-matter";

// ----------------------------------------------------------------------

type Props = {
  loading?: boolean;
};

// 글 목록 스캔
const modules = import.meta.glob('/src/pages-post/*/*.md', { as: 'raw' });

export function PostListHorizontal({ loading }: Props) {
  const renderLoading = <PostItemSkeleton variant="horizontal" />;
  const [posts, setPosts] = useState<Array<any>>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const loaded: any[] = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          const raw = await loader();
          const { data } = matter(raw);
          const filename = path.split("/").pop();
          return { ...data, filename};
        })
      )

      // 날짜 순으로 정렬
      loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(loaded);
    }

    loadPosts();
  }, [])

  const renderList = posts.map((post) => <PostItemHorizontal key={post.title} post={post} />);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      >
        {loading ? renderLoading : renderList}
      </Box>

      {posts.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
