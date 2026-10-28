import AcUnitIcon from '@mui/icons-material/AcUnit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import FreeBreakfastOutlinedIcon from '@mui/icons-material/FreeBreakfastOutlined';
import GrassIcon from '@mui/icons-material/Grass';
import LocalBarOutlinedIcon from '@mui/icons-material/LocalBarOutlined';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PetsIcon from '@mui/icons-material/Pets';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import WifiIcon from '@mui/icons-material/Wifi';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';

const ICONS = [
  [/pool/i, PoolIcon], [/wi-?fi|internet/i, WifiIcon], [/lawn|garden/i, GrassIcon], [/bar/i, LocalBarOutlinedIcon],
  [/breakfast/i, FreeBreakfastOutlinedIcon], [/dining|kitchen|chef/i, RestaurantOutlinedIcon], [/air|ac\b/i, AcUnitIcon],
  [/pet/i, PetsIcon], [/parking/i, LocalParkingIcon], [/housekeeping|clean/i, CleaningServicesOutlinedIcon],
];
const iconFor = (name) => (ICONS.find(([re]) => re.test(name)) || [null, CheckCircleOutlineIcon])[1];

const INITIAL = 8;

export default function Amenities({ amenities }) {
  const [showAll, setShowAll] = useState(false);
  if (!amenities.length) return null;
  const shown = showAll ? amenities : amenities.slice(0, INITIAL);
  return (
    <Box>
      <Typography variant="h5" component="h2">What this place offers</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {shown.map((a) => {
          const Icon = iconFor(a.name);
          return (
            <Grid item xs={6} sm={4} key={a.id}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Icon sx={{ color: 'secondary.dark' }} />
                <Typography>{a.name}</Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
      {amenities.length > INITIAL && (
        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => setShowAll((s) => !s)}>
          {showAll ? 'Show fewer' : `Show all ${amenities.length} amenities`}
        </Button>
      )}
    </Box>
  );
}
