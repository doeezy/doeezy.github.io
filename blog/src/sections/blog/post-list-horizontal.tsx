import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { PostItemSkeleton } from './post-skeleton';
import { PostItemHorizontal } from './post-item-horizontal';
import { useEffect, useState } from 'react';
import matter from 'gray-matter';
import { postModules, postModulesByCategory } from '../../utils/postModules';

// ----------------------------------------------------------------------

type Props = {
  category: string;
  loading?: boolean;
  sortBy?: string;
};

export function PostListHorizontal({ category, loading, sortBy }: Props) {
  const pageSize = 10;

  const renderLoading = <PostItemSkeleton variant="horizontal" />;
  const [posts, setPosts] = useState<Array<any>>([]);
  const [sortPosts, setSortPosts] = useState<Array<any>>([]);
  const [pagingPosts, setPagingPosts] = useState<Array<any>>([]);
  const [currPage, setCurrPage] = useState<number>(1);

  useEffect(() => {
    const loadPosts = async () => {
      const targetModules = category === 'all' ? postModules : postModulesByCategory[category];
      const loaded: any[] = await Promise.all(
        Object.entries(targetModules).map(async ([path, loader]) => {
          const raw = await loader();
          const { data } = matter(raw);
          const filename = path.split('/').pop();
          return { ...data, filename };
        })
      );

      setPosts(loaded);
    };

    loadPosts();
  }, []);

  useEffect(() => {
    setSortItems();
  }, [sortBy, posts]);

  useEffect(() => {
    const startIndex = (currPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    setPagingPosts(() => {
      return [...sortPosts].slice(startIndex, endIndex);
    });
  }, [currPage, sortPosts]);

  // 날짜 순으로 정렬
  const setSortItems = () => {
    if (sortBy === 'latest') {
      setSortPosts(() => {
        return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    } else {
      setSortPosts(() => {
        return [...posts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });
    }
  };

  const onChangePage = (page: number) => {
    setCurrPage(page);
    console.log('page: ', page);
  };

  const renderList = pagingPosts.map((post) => (
    <PostItemHorizontal key={post.filename} post={post} category={category} />
  ));

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
          count={posts.length}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
          onChange={(event: any, page: number) => onChangePage(page)}
        />
      )}
    </>
  );
}
