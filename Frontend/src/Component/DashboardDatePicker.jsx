import * as React from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function DashboardDatePicker({
  value,
  setValue,
  onClose,
}) {
  const handlePreset = (type) => {
    switch (type) {
      case "thisWeek":
        setValue([dayjs().startOf("week"), dayjs().endOf("week")]);
        break;
      case "lastWeek":
        setValue([
          dayjs().subtract(1, "week").startOf("week"),
          dayjs().subtract(1, "week").endOf("week"),
        ]);
        break;
      case "last7":
        setValue([dayjs().subtract(6, "day"), dayjs()]);
        break;
      case "currentMonth":
        setValue([dayjs().startOf("month"), dayjs().endOf("month")]);
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 3, width: 500 }}>
      <Stack direction="row" spacing={3}>
        
        {/* Left Side - Two Date Pickers */}
        <Stack spacing={2}>
          <DatePicker
            label="Start Date"
            value={value[0]}
            onChange={(newDate) =>
              setValue([newDate, value[1]])
            }
          />

          <DatePicker
            label="End Date"
            value={value[1]}
            onChange={(newDate) =>
              setValue([value[0], newDate])
            }
          />
        </Stack>

        {/* Right Side - Presets */}
        <Stack spacing={1} sx={{ minWidth: 150 }}>
          <Typography fontWeight={600}>
            Quick Select
          </Typography>

          <Button onClick={() => handlePreset("thisWeek")}>
            This Week
          </Button>
          <Button onClick={() => handlePreset("lastWeek")}>
            Last Week
          </Button>
          <Button onClick={() => handlePreset("last7")}>
            Last 7 Days
          </Button>
          <Button onClick={() => handlePreset("currentMonth")}>
            Current Month
          </Button>
          
          <Divider sx={{ my: 1 }} />

          <Button variant="contained" onClick={onClose}>
            Apply
          </Button>

          <Button onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}