import { useMemo, useState } from 'react';
import { useStore } from '../lib/store.js';
import { streakInfo } from '../lib/streak.js';
import { PROBLEMS } from '../data/codeProblems.js';
import { PATHS } from '../data/paths.js';
import { DAYS, buildIcs, googleCalendarUrl, downloadIcs } from '../lib/calendar.js';
import { weekProgress } from '../lib/roadmap.js';
import { reviewStats } from '../lib/revise.js';
import { ShareButton } from './ShareCard.jsx';
import { progressCard, hasProgress } from '../lib/shareCard.js';

const REMINDER_KEY = 'skilly:reminder';
const readPref = () => { try { return JSON.parse(localStorage.getItem(REMINDER_KEY)) || null; } catch { return null; } };
const savePref = (v) => { try { localStorage.setItem(REMINDER_KEY, JSON.stringify(v)); } catch { /* ignore */ } };

// What to do next, most specific first.
function nextSteps(s) {
  const out = [];
  if (s.attempt?.status === 'active') out.push({ icon: '⏱', text: 'Finish your test in progress', href: '#/test' });
  const { due } = reviewStats(s.review);
  if (due) out.push({ icon: '🔁', text: `Fix my mistakes: ${due} question${due === 1 ? '' : 's'} to review today`, href: '#/revise' });
  const plan = s.activePlanId && s.plans[s.activePlanId];
  if (plan) {
    const i = plan.weeks.findIndex((w) => !weekProgress(plan, w).complete);
    if (i >= 0) out.push({ icon: '🗺', text: `${plan.title}: week ${i + 1}, ${plan.weeks[i].title}`, href: '#/plan' });
  }
  for (const p of PATHS) {
    const prog = s.paths?.[p.id];
    if (!prog || (!Object.keys(prog.weeks || {}).length && !Object.keys(prog.done || {}).length)) continue;
    const step = p.steps.find((st) => !prog.done?.[st.id]);
    if (step) { out.push({ icon: p.icon, text: `${p.title}: ${step.title}`, href: `#/paths/${p.id}` }); break; }
  }
  const lang = (() => { try { return localStorage.getItem('skilly:codeLang') === 'js' ? 'js' : 'py'; } catch { return 'py'; } })();
  const unsolved = PROBLEMS.find((p) => !s.code?.[p.id]?.[lang]);
  if (unsolved) out.push({ icon: '💻', text: `Solve a coding problem: ${unsolved.title}`, href: `#/code/${unsolved.id}` });
  return out.slice(0, 3);
}

export function ThisWeek() {
  const s = useStore((x) => x);
  const info = useMemo(() => streakInfo(s.activity), [s.activity]);
  const steps = useMemo(() => nextSteps(s), [s]);
  const [open, setOpen] = useState(false);
  const pref = readPref() || { day: 'MO', time: '19:00' };
  const [day, setDay] = useState(pref.day);
  const [time, setTime] = useState(pref.time);
  const [added, setAdded] = useState('');
  const url = `${location.origin}${location.pathname}#/`;

  const addIcs = () => { savePref({ day, time }); downloadIcs(buildIcs({ day, time, url })); setAdded('ics'); };
  const onGoogle = () => { savePref({ day, time }); setAdded('google'); };

  const flame = info.current > 0;
  return (
    <section className="slab panel this-week" aria-labelledby="tw-h">
      <div className="tw-top">
        <div className={`streak${flame ? ' lit' : ''}`} aria-label={`${info.current}-day streak`}>
          <span className="flame" aria-hidden="true">🔥</span>
          <b>{info.current}</b>
          <span>day{info.current === 1 ? '' : 's'}</span>
        </div>
        <div className="tw-text">
          <h2 id="tw-h">This week</h2>
          <p className="muted small">
            {info.activeToday ? 'You studied today. Nice!' : info.current ? 'Study today to keep your streak alive.' : 'Do one small thing today to start a streak.'}
            {info.best > 1 && ` Best: ${info.best} days.`}
          </p>
        </div>
        <ol className="week-dots" aria-label="Days studied this week">
          {info.week.map((d) => (
            <li key={d.key} className={`${d.active ? 'on' : ''}${d.today ? ' today' : ''}${d.future ? ' future' : ''}`} title={d.key}>
              <span aria-hidden="true">{d.label}</span>
              <span className="sr-only">{d.key}: {d.active ? 'studied' : d.future ? 'upcoming' : 'not studied'}</span>
            </li>
          ))}
        </ol>
      </div>
      <ul className="next-up" role="list" aria-label="Next up">
        {steps.map((x) => (
          <li key={x.href + x.text}><a href={x.href}><span aria-hidden="true">{x.icon}</span><span>{x.text}</span><span aria-hidden="true" className="go">→</span></a></li>
        ))}
      </ul>
      {hasProgress(progressCard(s)) && (
        <div className="row tw-share"><ShareButton kind="progress" label="Share my progress" className="btn ghost sm" getCard={() => progressCard(s)} /></div>
      )}
      <div className="reminder">
        {!open ? (
          <button type="button" className="link small" onClick={() => setOpen(true)} aria-expanded="false">📅 Add a weekly study reminder to my calendar</button>
        ) : (
          <div className="reminder-form">
            <label><span className="small">Every</span>
              <select value={day} onChange={(e) => { setDay(e.target.value); setAdded(''); }}>{DAYS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </label>
            <label><span className="small">at</span>
              <input type="time" value={time} onChange={(e) => { setTime(e.target.value || '19:00'); setAdded(''); }} />
            </label>
            <a className="btn ghost sm" href={googleCalendarUrl({ day, time, url })} target="_blank" rel="noreferrer" onClick={onGoogle}>Google Calendar</a>
            <button type="button" className="btn ghost sm" onClick={addIcs}>Apple / Outlook (.ics)</button>
            {added && <p className="small ok-text" role="status">{added === 'ics' ? 'Downloaded. Open the file to add the weekly reminder.' : 'Opened Google Calendar. Press Save there to add the reminder.'}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
