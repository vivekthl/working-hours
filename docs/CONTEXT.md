# Working Hours

A personal, browser-only app that records how much time is spent working each calendar day and shows the history as a log grouped by week.

## Language

### Tracking time

**Working Hours**:
The total time worked on one calendar day, shown as `HH:MM:SS`. Each day has at most one Working Hours value.
_Avoid_: duration, time spent, elapsed time

**Stopwatch**:
The running counter that accumulates today's Working Hours while it is running. Starting it resumes from the value already recorded for today, not from zero.
_Avoid_: timer, clock

**Running / Paused**:
The two states of the Stopwatch. The user toggles between them with Start/Stop (or the `s` key), and the favicon shows which state it is in.
_Avoid_: active/idle, on/off

**Adjustment**:
A manual correction to today's Working Hours by a fixed amount (±1m, ±5m, ±10m, ±1hr), used when the Stopwatch was left running or not started.
_Avoid_: edit, offset

**Clear**:
Resetting today's Working Hours to `00:00:00`. It affects only today, not past days.
_Avoid_: reset, delete

**Split**:
The Stopwatch value (today's Working Hours so far) at the moment the Stopwatch is started or stopped. It is not the time of day.
_Avoid_: timestamp, checkpoint, clock time

**Lap**:
The difference between a Split and the one before it on the same day, written like `1h 2m 1s`. A Lap that ends at a Stop is time worked. Any other non-zero Lap comes from Adjustments or Clear.
_Avoid_: gap, interval, session length, break

**Laps**:
The panel listing today's Splits, newest first, each with its Lap.
_Avoid_: timeline, timestamps, history, activity log

### History

**Day Key**:
The identity of a calendar day in local time, written `YYYY/MM/DD`. Each Log Entry has exactly one Day Key.
_Avoid_: date string, timestamp

**Log Entry**:
One day's record: a Day Key paired with that day's Working Hours.
_Avoid_: record, row, item

**Work Log**:
All Log Entries, shown newest first.
_Avoid_: history, list, table

**Delete Entry**:
Removing a Log Entry, and that day's Splits, from the Work Log entirely, for example a day that was logged incorrectly. This is different from Clear, which sets today to zero and keeps the entry.
_Avoid_: clear, remove day

**Week**:
An ISO-8601 week (Monday to Sunday). The Work Log puts a separator between Log Entries from different Weeks.
_Avoid_: 7 days, last week

**Week Total**:
The sum of Working Hours across one Week. It is currently disabled.
_Avoid_: weekly hours, subtotal

**Average** _(planned)_:
Mean Working Hours across the Log Entries that are kept. Deleted Log Entries do not count toward it.
_Avoid_: mean, daily average
