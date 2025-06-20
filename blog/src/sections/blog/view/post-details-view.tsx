import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/main';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import Card from '@mui/material/Card';
import { fDate, fDateTime } from '../../../utils/format-time';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Unstable_Grid2';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../../routes/components';

import { Label } from '../../../components/label';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

type Props = {
  post: any;
  info: any;
  backLink: string;
};

export function PostDetailsView({ post, info, backLink }: Props) {
  const renderHeader = (
    <>
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4">{info?.title ?? ''}</Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDate(info?.date)}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: { xs: 1, md: 2 } }}>
              {(info?.tags ?? []).map((tag) => (
                <Chip key={tag} label={tag} variant="soft" sx={{ color: '#078DEE' }} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
  const renderContent = (
    <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Markdown children={post} />
    </Card>
  );

  return (
    <DashboardContent>
      <Grid container spacing={2}>
        <Grid xs={12} md={12}>
          {renderHeader}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={12} md={12}>
          {renderContent}
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
