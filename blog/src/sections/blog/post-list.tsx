import type { IPostItem } from 'src/types/blog';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { Iconify } from 'src/components/iconify';

import { PostItemSkeleton } from './post-skeleton';
import { PostItem, PostItemLatest } from './post-item';
import {useEffect, useState} from "react";
import matter from "gray-matter"

// ----------------------------------------------------------------------

type Props = {
  loading?: boolean;
};

// 글 목록 스캔
const modules2 = import.meta.glob('/src/pages-post/*/*.md', { as: 'raw' });

export function PostList({ loading }: Props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      const loaded = await Promise.all(
        Object.entries(modules2).map(async ([path, loader]) => {
          const raw = await loader();
          const { data } = matter(raw);
          const filename = path.split("/").pop();
          return { ...data, filename};
        })
      )

      // 날짜 순으로 정렬
      loaded.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(loaded);
    }

    loadPosts();
  }, [])

  const renderLoading = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
    >
      <PostItemSkeleton />
    </Box>
  );

  const renderList = (
    <Grid container spacing={3}>
      {posts.slice(0, 3).map((post, index) => (
        <Grid
          key={post.filename}
          xs={12}
          sm={6}
          md={4}
          lg={index === 0 ? 6 : 3}
          sx={{ display: { xs: 'none', lg: 'block' } }}
        >
          <PostItemLatest post={post} index={index} />
        </Grid>
      ))}

      {posts.slice(0, 3).map((post) => (
        <Grid key={post.id} xs={12} sm={6} md={4} lg={3} sx={{ display: { lg: 'none' } }}>
          <PostItem post={post} />
        </Grid>
      ))}

      {posts.slice(3, posts.length).map((post) => (
        <Grid key={post.id} xs={12} sm={6} md={4} lg={3}>
          <PostItem post={post} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      {loading ? renderLoading : renderList}

      {posts.length > 8 && (
        <Stack alignItems="center" sx={{ mt: 8, mb: { xs: 10, md: 15 } }}>
          <Button
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="svg-spinners:12-dots-scale-rotate" width={24} />}
          >
            Load More
          </Button>
        </Stack>
      )}
    </>
  );
}
