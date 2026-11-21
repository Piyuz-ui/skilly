// Weekly study reminders added to the learner's own calendar: a Google
// Calendar link, or an .ics file for Apple Calendar / Outlook / others.
// No server needed; the calendar app sends the notification.
export const DAYS = [
  ['MO', 'Monday'], ['TU', 'Tuesday'], ['WE', 'Wednesday'], ['TH', 'Thursday'],
  ['FR', 'Friday'], ['SA', 'Saturday'], ['SU', 'Sunday'],
];
const JS_DAY = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const utcStamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
// RFC 5545 text escaping.
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

// Next date (today or later) on the given weekday at hh:mm local time.
export function nextOccurrence(day, time, now = new Date()) {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  const diff = (JS_DAY[day] - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  if (d <= now) d.setDate(d.getDate() + 7);
  return d;
}

function details(url) {
  return `Time to study with Skilly: tick this week's tasks, keep your streak going.\n${url}`;
}

export function buildIcs({ day, time, minutes = 60, url, now = new Date() }) {
  const start = nextOccurrence(day, time, now);
  const end = new Date(start.getTime() + minutes * 60000);
  const uid = `${start.getTime()}-${Math.random().toString(36).slice(2)}@skilly`;
  // Floating local times (no Z) so the event stays at the same local hour.
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Skilly//Study reminder//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${day}`,
    `SUMMARY:${esc('📚 Skilly study time')}`,
    `DESCRIPTION:${esc(details(url))}`,
    `URL:${url}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc('Skilly study time')}`, 'TRIGGER:-PT10M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
}

export function googleCalendarUrl({ day, time, minutes = 60, url, now = new Date() }) {
  const start = nextOccurrence(day, time, now);
  const end = new Date(start.getTime() + minutes * 60000);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: '📚 Skilly study time',
    details: details(url),
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: tz,
    recur: `RRULE:FREQ=WEEKLY;BYDAY=${day}`,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

export function downloadIcs(text, filename = 'skilly-study-reminder.ics') {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
