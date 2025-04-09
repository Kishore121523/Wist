'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { differenceInCalendarDays, isAfter, isBefore } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { DatePicker } from './DatePicker';

interface Props {
  startDate?: Date | Timestamp;
  endDate?: Date | Timestamp;
  onChangeStart: (date: Date | Timestamp) => void;
  onChangeEnd: (date: Date | Timestamp) => void;
}

export default function DateInputsWithCountdown({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
}: Props) {
  const today = new Date();
  const start = startDate instanceof Date ? startDate : undefined;
  const end = endDate instanceof Date ? endDate : undefined;

  const totalCountdownDays = start ? differenceInCalendarDays(start, today) : 0;
  const maxCountdown = 30;
  const fill = Math.max(0, Math.min(100, ((maxCountdown - totalCountdownDays) / maxCountdown) * 100));

  const getCountdownMessage = (fill: number) => {
    if (fill >= 100) return 'Today’s the day! Let’s go!';
    if (fill >= 76) return 'Almost there! Get pumped!';
    if (fill >= 51) return 'Not long now, stay ready!';
    if (fill >= 21) return 'You’re warming up nicely!';
    return 'Still early, perfect time to plan!';
  };

  const showStartError = start && end && isAfter(start, end);
  const showEndError = end && start && isBefore(end, start);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-[6rem] mb-6">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm mb-2">Expected Start Date</label>
          <div className="flex items-center gap-3">
            <DatePicker
              date={start}
              onChange={onChangeStart}
              placeholder="Start date"
            />
            <AnimatePresence>
              {start && !showStartError && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-muted-foreground"
                >
                  {differenceInCalendarDays(start, today) > 0
                    ? `${differenceInCalendarDays(start, today)} days to go`
                    : 'Starts today'}
                </motion.span>
              )}
              {showStartError && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-destructive"
                >
                  Start can’t be after end!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="block text-sm mb-2">Expected End Date</label>
          <div className="flex items-center gap-3">
            <DatePicker
              date={end}
              onChange={onChangeEnd}
              placeholder="End date"
            />
            <AnimatePresence>
              {end && !showEndError && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-muted-foreground"
                >
                  {differenceInCalendarDays(end, today) > 0
                    ? `${differenceInCalendarDays(end, today)} days to go`
                    : 'Ends today'}
                </motion.span>
              )}
              {showEndError && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-destructive"
                >
                  End can’t be before start!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {start && !showStartError && (
        <div className="mt-4 w-full">
          <label className="block text-sm text-foreground mb-2">
            Countdown to start: {totalCountdownDays} days
          </label>
          <div className="h-3 bg-border rounded-full w-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fill}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-foreground rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {getCountdownMessage(fill)}
          </p>
        </div>
      )}
    </div>
  );
}
