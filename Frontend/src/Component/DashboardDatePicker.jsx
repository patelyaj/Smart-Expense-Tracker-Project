import * as React from "react";
import dayjs from "dayjs";
import { Box, Button, Stack, Typography, Divider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function DashboardDatePicker({ 
  initialStartDate, 
  initialEndDate, 
  onApply, 
  onClose 
}) {
  // 1. Internal draft states (won't trigger any API calls yet)
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
      default:
        return;
    }

    // 2. Just update the draft state when a preset is clicked
    setTempStart(newStart);
    setTempEnd(newEnd);
  };

  const handleApply = () => {
    // 3. ONLY pass the dates up to the parent when Apply is clicked!
    onApply(tempStart.toISOString(), tempEnd.toISOString());
    onClose();
  };

  return (
    <Box sx={{ p: 3, width: 500 }}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={2}>
          <DatePicker
            label="Start Date"
            value={tempStart}
            onChange={(newDate) => setTempStart(newDate)}
          />

          <DatePicker
            label="End Date"
            value={tempEnd}
            onChange={(newDate) => setTempEnd(newDate)}
          />
        </Stack>

        <Stack spacing={1} sx={{ minWidth: 150 }}>
          <Typography fontWeight={600} color="text.primary" mb={1}>
            Quick Select
          </Typography>

          <Button sx={{ justifyContent: "flex-start", textTransform: 'none' }} onClick={() => handlePreset("thisWeek")}>
            This Week
          </Button>
          <Button sx={{ justifyContent: "flex-start", textTransform: 'none' }} onClick={() => handlePreset("lastWeek")}>
            Last Week
          </Button>
          <Button sx={{ justifyContent: "flex-start", textTransform: 'none' }} onClick={() => handlePreset("last7")}>
            Last 7 Days
          </Button>
          <Button sx={{ justifyContent: "flex-start", textTransform: 'none' }} onClick={() => handlePreset("currentMonth")}>
            Current Month
          </Button>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
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