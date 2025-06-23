import { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';

import { POST_SORT_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/main';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostSort } from '../post-sort';
import { PostListHorizontal } from '../post-list-horizontal';

// ----------------------------------------------------------------------

type Props = {
  category: string;
};

export function PostListView({ category }: Props) {
  const [sortBy, setSortBy] = useState('latest');

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="전체"
        links={[
          { name: 'Javascript', href: paths.javascript.root },
          { name: 'React', href: paths.react.root },
          { name: 'Vue.js', href: paths.vuejs.root },
          { name: 'Nuxt.js', href: paths.nuxtjs.root },
          { name: 'Keycloak', href: paths.keycloak.root },
          { name: 'Troubleshooting', href: paths.troubleshooting.root },
        ]}
        activeLast={true}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <PostSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
      </Stack>

      <PostListHorizontal sortBy={sortBy} category={category} />
    </DashboardContent>
  );
}
