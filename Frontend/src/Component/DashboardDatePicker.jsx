import * as React from "react";
import dayjs from "dayjs";
import { Box, Button, Stack, Typography, Divider, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function DashboardDatePicker({ 
  initialStartDate, 
  initialEndDate, 
  onApply, 
  onClose 
}) {
  // Internal draft states (won't trigger any API calls yet)
  const [tempStart, setTempStart] = React.useState(dayjs(initialStartDate));
  const [tempEnd, setTempEnd] = React.useState(dayjs(initialEndDate));

  const handlePreset = (type) => {
    let newStart, newEnd;

    switch (type) {
      case "thisWeek":
        newStart = dayjs().startOf("week");
        newEnd = dayjs().endOf("week");
        break;
      case "lastWeek":
        newStart = dayjs().subtract(1, "week").startOf("week");
        newEnd = dayjs().subtract(1, "week").endOf("week");
        break;
      case "last7":
        newStart = dayjs().subtract(6, "day");
        newEnd = dayjs();
        break;
      case "currentMonth":
        newStart = dayjs().startOf("month");
        newEnd = dayjs().endOf("month");
        break;
      case "lastMonth":
        newStart = dayjs().subtract(1, "month").startOf("month");
        newEnd = dayjs().subtract(1, "month").endOf("month");
        break;
      case "thisYear":
        newStart = dayjs().startOf("year");
        newEnd = dayjs().endOf("year");
        break;
      case "lastYear":
        newStart = dayjs().subtract(1, "year").startOf("year");
        newEnd = dayjs().subtract(1, "year").endOf("year");
        break;
      case "allTime":
        // Safe past and future dates to ensure all DB records are captured
        newStart = dayjs("2000-01-01");
        newEnd = dayjs().add(1, "year").endOf("year");
        break;
      default:
        return;
    }

    // Update the draft state when a preset is clicked
    setTempStart(newStart);
    setTempEnd(newEnd);
  };

  const handleApply = () => {
    // ONLY pass the dates up to the parent when Apply is clicked
    onApply(tempStart.toISOString(), tempEnd.toISOString());
    onClose();
  };

  return (
    <Box sx={{ p: 3, width: 550 }}>
      <Stack direction="row" spacing={3}>
        
        {/* Left Side: Custom Date Pickers */}
        <Stack spacing={3} sx={{ pt: 1, minWidth: 200 }}>
          <Typography fontWeight={600} color="text.primary">
            Custom Range
          </Typography>
          <DatePicker
            label="Start Date"
            value={tempStart}
            onChange={(newDate) => setTempStart(newDate)}
            format="DD/MM/YYYY"
          />

          <DatePicker
            label="End Date"
            value={tempEnd}
            onChange={(newDate) => setTempEnd(newDate)}
            format="DD/MM/YYYY"
          />
        </Stack>

        <Divider orientation="vertical" flexItem />

        {/* Right Side: Quick Select Presets */}
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography fontWeight={600} color="text.primary" mb={1}>
            Quick Select
          </Typography>

          <Grid container spacing={1}>
            {/* Column 1 */}
            <Grid item xs={6}>
              <Stack spacing={0.5}>
                <Button size="small" sx={{ justifyContent: "flex-start", textTransform: 'none', fontWeight: 500 }} onClick={() => handlePreset("thisWeek")}>
                  This Week
                </Button>
                <Button size="small" sx={{ justifyContent: "flex-start", textTransform: 'none', fontWeight: 500 }} onClick={() => handlePreset("lastWeek")}>
                  Last Week
                </Button>
                <Button size="small" sx={{ justifyContent: "flex-start", textTransform: 'none', fontWeight: 500 }} onClick={() => handlePreset("last7")}>
                  Last 7 Days
                </Button>
                <Button size="small" sx={{ justifyContent: "flex-start", textTransform: 'none', fontWeight: 500 }} onClick={() => handlePreset("allTime")}>
                  All Time
                </Button>
              </Stack>
            </Grid>
            
            {/* Column 2 */}
            <Grid item xs={6}>
              <Stack spacing={0.5}>
                <Button size="small" sx={{ justifyContent: "flex-start", textTransform: 'none', fontWeight: 500 }} onClick={() => handlePreset("currentMonth")}>
                  This Month
                </Button>
                <Button size="small" sx={{ justifyContent: "flex-start", textTransform: 'none', fontWeight: 500 }} onClick={() => handlePreset("lastMonth")}>
                  Last Month
                </Button>
                <Button size="small" sx={{ justifyContent: "flex-start", textTransform: 'none', fontWeight: 500 }} onClick={() => handlePreset("thisYear")}>
                  This Year
                </Button>
                <Button size="small" sx={{ justifyContent: "flex-start", textTransform: 'none', fontWeight: 500 }} onClick={() => handlePreset("lastYear")}>
                  Last Year
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt="auto" pt={1}>
            <Button color="inherit" onClick={onClose} sx={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button variant="contained" disableElevation onClick={handleApply} sx={{ fontWeight: 600 }}>
              Apply
            </Button>
          </Stack>
        </Stack>
        
      </Stack>
    </Box>
  );
}