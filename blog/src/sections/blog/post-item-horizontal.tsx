import type { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { maxLine } from 'src/theme/styles';
import Chip from '@mui/material/Chip';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

type Props = CardProps & {
  post: any;
  category: string;
};

export function PostItemHorizontal({ post, category, sx, ...other }: Props) {
  return (
    <>
      <Card sx={{ display: 'flex', ...sx }} {...other}>
        <Stack spacing={1} flexGrow={1} sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(post.date)}
            </Box>
          </Box>

          <Stack spacing={1} flexGrow={1}>
            <Link
              component={RouterLink}
              href={
                post?.menu
                  ? paths[post?.menu].details(
                      post?.filename.substring(0, post.filename.lastIndexOf('.')) ?? ''
                    )
                  : '/'
              }
              color="inherit"
              variant="subtitle2"
              sx={{ ...maxLine({ line: 2 }) }}
            >
              {post.title}
            </Link>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: { xs: 1, md: 2 } }}>
            {(post?.tags ?? []).map((tag) => (
              <Chip key={tag} label={tag} variant="soft" sx={{ color: '#078DEE' }} />
            ))}
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
