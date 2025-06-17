
import { Grid, Typography } from '@mui/material';

const CustomOverlay = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%' }}
    >
      <Typography variant="h6" color="text.secondary">
        No Data Found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Try adjusting your filters or check if data exists.
      </Typography>
    </Grid>
  );
};

export default CustomOverlay;