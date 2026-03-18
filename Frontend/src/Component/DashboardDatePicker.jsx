import * as React from "react";
import dayjs from "dayjs";
import { Box, Button, Stack, Typography, Divider, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

const PRESET_CONFIG = [
  { key: "thisWeek", label: "This Week" },
  { key: "lastWeek", label: "Last Week" },
  { key: "last7", label: "Last 7 Days" },
  { key: "allTime", label: "All Time" },
  { key: "currentMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "thisYear", label: "This Year" },
  { key: "lastYear", label: "Last Year" }
];

const getPresetRange = (type) => {
  switch (type) {
    case "thisWeek":
      return {
        start: dayjs().startOf("week"),
        end: dayjs().endOf("week")
      };
    case "lastWeek":
      return {
        start: dayjs().subtract(1, "week").startOf("week"),
        end: dayjs().subtract(1, "week").endOf("week")
      };
    case "last7":
      return {
        start: dayjs().subtract(6, "day").startOf("day"),
        end: dayjs().endOf("day")
      };
    case "currentMonth":
      return {
        start: dayjs().startOf("month"),
        end: dayjs().endOf("month")
      };
    case "lastMonth":
      return {
        start: dayjs().subtract(1, "month").startOf("month"),
        end: dayjs().subtract(1, "month").endOf("month")
      };
    case "thisYear":
      return {
        start: dayjs().startOf("year"),
        end: dayjs().endOf("year")
      };
    case "lastYear":
      return {
        start: dayjs().subtract(1, "year").startOf("year"),
        end: dayjs().subtract(1, "year").endOf("year")
      };
    case "allTime":
      return {
        start: dayjs("2000-01-01").startOf("day"),
        end: dayjs().endOf("day")
      };
    default:
      return null;
  }
};

const isSameRange = (startA, endA, startB, endB) =>
  startA?.startOf("day").valueOf() === startB?.startOf("day").valueOf() &&
  endA?.endOf("day").valueOf() === endB?.endOf("day").valueOf();

export default function DashboardDatePicker({ 
  initialStartDate, 
  initialEndDate, 
  onApply, 
  onClose 
}) {
  // Internal draft states (won't trigger any API calls yet)
  const [tempStart, setTempStart] = React.useState(dayjs(initialStartDate));
  const [tempEnd, setTempEnd] = React.useState(dayjs(initialEndDate));
  const [isApplying, setIsApplying] = React.useState(false);
  
  const selectedPreset = React.useMemo(() => {
    return (
      PRESET_CONFIG.find(({ key }) => {
        const presetRange = getPresetRange(key);
        return presetRange && isSameRange(tempStart, tempEnd, presetRange.start, presetRange.end);
      })?.key || null
    );
  }, [tempStart, tempEnd]);

  React.useEffect(() => {
    setTempStart(dayjs(initialStartDate));
    setTempEnd(dayjs(initialEndDate));
  }, [initialStartDate, initialEndDate]);

  const handlePreset = (type) => {
    const presetRange = getPresetRange(type);
    if (!presetRange) return;

    // Update the draft state when a preset is clicked
    setTempStart(presetRange.start);
    setTempEnd(presetRange.end);
  };

const handleApply = () => {
  if (isApplying) return;

  setIsApplying(true);
  onApply(tempStart.toISOString(), tempEnd.toISOString());
  onClose();
};

  const getPresetButtonSx = (presetKey) => ({
    justifyContent: "flex-start",
    textTransform: "none",
    fontWeight: selectedPreset === presetKey ? 700 : 500,
    borderRadius: 2,
    px: 1.5,
    py: 1,
    color: selectedPreset === presetKey ? "primary.main" : "text.primary",
    bgcolor: selectedPreset === presetKey ? "primary.50" : "transparent",
    border: "1px solid",
    borderColor: selectedPreset === presetKey ? "primary.main" : "transparent",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: selectedPreset === presetKey ? "primary.100" : "action.hover",
      borderColor: selectedPreset === presetKey ? "primary.main" : "transparent"
    }
  });

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
            disableFuture
            maxDate={tempEnd}
          />

          <DatePicker
            label="End Date"
            value={tempEnd}
            onChange={(newDate) => setTempEnd(newDate)}
            format="DD/MM/YYYY"
            disableFuture
            minDate={tempStart}
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
                <Button size="small" sx={getPresetButtonSx("thisWeek")} onClick={() => handlePreset("thisWeek")}>
                  This Week
                </Button>
                <Button size="small" sx={getPresetButtonSx("lastWeek")} onClick={() => handlePreset("lastWeek")}>
                  Last Week
                </Button>
                <Button size="small" sx={getPresetButtonSx("last7")} onClick={() => handlePreset("last7")}>
                  Last 7 Days
                </Button>
                <Button size="small" sx={getPresetButtonSx("allTime")} onClick={() => handlePreset("allTime")}>
                  All Time
                </Button>
              </Stack>
            </Grid>
            
            {/* Column 2 */}
            <Grid item xs={6}>
              <Stack spacing={0.5}>
                <Button size="small" sx={getPresetButtonSx("currentMonth")} onClick={() => handlePreset("currentMonth")}>
                  This Month
                </Button>
                <Button size="small" sx={getPresetButtonSx("lastMonth")} onClick={() => handlePreset("lastMonth")}>
                  Last Month
                </Button>
                <Button size="small" sx={getPresetButtonSx("thisYear")} onClick={() => handlePreset("thisYear")}>
                  This Year
                </Button>
                <Button size="small" sx={getPresetButtonSx("lastYear")} onClick={() => handlePreset("lastYear")}>
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
            <Button variant="contained" disableElevation disabled={isApplying} onClick={handleApply} sx={{ fontWeight: 600 }}>
              {isApplying ? "Applying..." : "Apply"}
            </Button>
          </Stack>
        </Stack>
        
      </Stack>
    </Box>
  );
}
