import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/custom/button";
import { Input } from "../../components/custom/input";
import {
  getWeeklyAvailability,
  saveWeeklyAvailability,
  type DayKey,
  type TimeRange,
  type WeeklyAvailability,
} from "../../features/availability/availability.api";

export const Route = createFileRoute("/app/availability")({
  component: RouteComponent,
});

const DAYS: { key: DayKey; label: string; long: string }[] = [
  { key: "mon", label: "Mon", long: "Monday" },
  { key: "tue", label: "Tue", long: "Tuesday" },
  { key: "wed", label: "Wed", long: "Wednesday" },
  { key: "thu", label: "Thu", long: "Thursday" },
  { key: "fri", label: "Fri", long: "Friday" },
  { key: "sat", label: "Sat", long: "Saturday" },
  { key: "sun", label: "Sun", long: "Sunday" },
];

function RouteComponent() {
  const qc = useQueryClient();

  const weeklyQ = useQuery({
    queryKey: ["availability", "weekly"],
    queryFn: getWeeklyAvailability,
  });

  const saveM = useMutation({
    mutationFn: saveWeeklyAvailability,
    onSuccess: async (data) => {
      // keep cache fresh + sync local state to server-normalized response
      qc.setQueryData(["availability", "weekly"], data);
      setModel(data);
      markSaved();
    },
    onError: () => markError(),
  });

  // Model is the actual state of the page (no “Save” button).
  const [model, setModel] = useState<WeeklyAvailability | null>(null);

  // Day selection for bulk actions
  const [selectedDays, setSelectedDays] = useState<DayKey[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("17:00");

  // Polishing toggles
  const [showAllDays, setShowAllDays] = useState(false);

  // Undo support
  const lastStableRef = useRef<WeeklyAvailability | null>(null);
  const undoTimerRef = useRef<number | null>(null);
  const [undoOpen, setUndoOpen] = useState(false);

  // Save status (premium UX)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const savedTimerRef = useRef<number | null>(null);

  function markSaving() {
    setSaveState("saving");
    if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
  }
  function markSaved() {
    setSaveState("saved");
    if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
    savedTimerRef.current = window.setTimeout(() => setSaveState("idle"), 1500);
  }
  function markError() {
    setSaveState("error");
  }

  // Initialize model once
  useEffect(() => {
    if (!weeklyQ.data) return;
    if (model) return;

    setModel(weeklyQ.data);
    lastStableRef.current = weeklyQ.data;

    // Preselect days with existing availability; fallback to Mon–Fri
    const enabled = DAYS.map((d) => d.key).filter((k) => {
      const day = weeklyQ.data.days[k];
      return day?.enabled && day.ranges.length > 0;
    });
    setSelectedDays(enabled.length ? enabled : ["mon", "tue", "wed", "thu", "fri"]);
  }, [weeklyQ.data, model]);

  const busy = weeklyQ.isLoading || saveM.isPending;

  const hasAnyAvailability = useMemo(() => {
    if (!model) return false;
    return DAYS.some((d) => model.days[d.key].enabled && model.days[d.key].ranges.length > 0);
  }, [model]);

  const selectedLabel = useMemo(() => {
    if (!selectedDays.length) return "no days selected";
    return selectedDays.map((k) => DAYS.find((d) => d.key === k)!.label).join(", ");
  }, [selectedDays]);

  const visibleDays = useMemo(() => {
    if (!model) return [];
    if (showAllDays) return DAYS;

    // Show: selected days + days that already have ranges (so you don’t “lose” configured days)
    const set = new Set<DayKey>(selectedDays);
    for (const d of DAYS) {
      const day = model.days[d.key];
      const has = day.enabled && day.ranges.length > 0;
      if (has) set.add(d.key);
    }
    return DAYS.filter((d) => set.has(d.key));
  }, [model, selectedDays, showAllDays]);

  const canAddWindow = selectedDays.length > 0 && isValidWindow(newStart, newEnd) && !busy;

  const toggleSelectedDay = (day: DayKey) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  function openUndo(previous: WeeklyAvailability) {
    lastStableRef.current = previous;
    setUndoOpen(true);

    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    undoTimerRef.current = window.setTimeout(() => setUndoOpen(false), 8000);
  }

  function persist(next: WeeklyAvailability, opts?: { undoFrom?: WeeklyAvailability }) {
    setModel(next);
    markSaving();
    if (opts?.undoFrom) openUndo(opts.undoFrom);
    saveM.mutate(next);
  }

  const onResetToServer = () => {
    if (!weeklyQ.data) return;
    setModel(weeklyQ.data);
    lastStableRef.current = weeklyQ.data;
    setSaveState("idle");
    setUndoOpen(false);
  };

  const onUndo = () => {
    const prev = lastStableRef.current;
    if (!prev) return;
    setUndoOpen(false);
    persist(prev); // persist the undo state too
  };

  const addWindow = () => {
    if (!model) return;
    if (!canAddWindow) return;

    const before = structuredClone(model);
    const next: WeeklyAvailability = structuredClone(model);

    for (const day of selectedDays) {
      next.days[day].enabled = true;
      next.days[day].ranges = normalizeRanges([...next.days[day].ranges, { start: newStart, end: newEnd }]);
    }

    persist(next, { undoFrom: before });
  };

  const clearSelected = () => {
    if (!model) return;
    if (!selectedDays.length) return;

    const before = structuredClone(model);
    const next: WeeklyAvailability = structuredClone(model);

    for (const day of selectedDays) {
      next.days[day].enabled = false;
      next.days[day].ranges = [];
    }

    persist(next, { undoFrom: before });
  };

  const removeRange = (day: DayKey, idx: number) => {
    if (!model) return;

    const before = structuredClone(model);
    const next: WeeklyAvailability = structuredClone(model);

    next.days[day].ranges = next.days[day].ranges.filter((_, i) => i !== idx);
    if (next.days[day].ranges.length === 0) next.days[day].enabled = false;

    persist(next, { undoFrom: before });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Availability</h1>
          <p className='mt-1 text-sm text-zinc-400'>Set your default weekly schedule. Exceptions can be added later.</p>
        </div>

        <div className='flex items-center gap-3'>
          <SaveStatus state={saveState} />
          <Button variant='ghost' className='rounded-xl' onClick={onResetToServer} disabled={!weeklyQ.data || busy}>
            Reset
          </Button>
        </div>
      </div>

      {/* Weekly availability hero */}
      <div className='rounded-2xl border border-zinc-900 bg-zinc-950/40 shadow-sm overflow-hidden'>
        <div className='border-b border-zinc-900 px-5 py-5'>
          <div className='flex items-start justify-between gap-4'>
            <div className='space-y-1'>
              <div className='text-sm font-medium'>Weekly availability</div>
              <div className='text-xs text-zinc-500'>
                Select days, then add one or more time windows. Changes save automatically.
              </div>
            </div>

            <button
              type='button'
              onClick={() => setShowAllDays((v) => !v)}
              className='text-xs text-zinc-400 hover:text-zinc-200'
            >
              {showAllDays ? "Show selected only" : "Show all days"}
            </button>
          </div>

          {/* Empty onboarding */}
          {!hasAnyAvailability ? (
            <div className='mt-4 rounded-xl border border-zinc-900 bg-black/25 p-4'>
              <div className='text-sm text-zinc-200'>No availability yet</div>
              <div className='mt-1 text-xs text-zinc-500'>
                Pick the days you want, add a time window, and you’re done.
              </div>
            </div>
          ) : null}

          {/* Day selector (strong selection state) */}
          <div className='mt-5 flex flex-wrap gap-2'>
            {DAYS.map((d) => {
              const active = selectedDays.includes(d.key);
              const enabled = !!model?.days[d.key]?.enabled && model.days[d.key].ranges.length > 0;

              return (
                <button
                  key={d.key}
                  type='button'
                  disabled={busy}
                  onClick={() => toggleSelectedDay(d.key)}
                  className={[
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition select-none",
                    active
                      ? "border-zinc-700 bg-zinc-200/10 text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                      : "border-zinc-900 bg-black/20 text-zinc-300 hover:border-zinc-800 hover:bg-white/5",
                  ].join(" ")}
                >
                  <span className='font-medium'>{d.label}</span>

                  {active ? (
                    <span className='inline-flex h-4 w-4 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300'>
                      ✓
                    </span>
                  ) : (
                    <span
                      className={["h-1.5 w-1.5 rounded-full", enabled ? "bg-emerald-400/80" : "bg-zinc-700"].join(" ")}
                      title={enabled ? "Has availability" : "No availability"}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Add window row */}
          <div className='mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-sm text-zinc-400'>Add a time window</span>

              <div className='flex items-center gap-2'>
                <Input type='time' value={newStart} onChange={(e) => setNewStart(e.target.value)} disabled={busy} />
                <span className='text-sm text-zinc-500'>→</span>
                <Input type='time' value={newEnd} onChange={(e) => setNewEnd(e.target.value)} disabled={busy} />
              </div>

              <span className='text-sm text-zinc-500'>
                to <span className='text-zinc-300'>{selectedLabel}</span>
              </span>
            </div>

            <div className='flex gap-2'>
              <Button className='rounded-xl' onClick={addWindow} disabled={!canAddWindow}>
                Add window
              </Button>
              <Button
                variant='ghost'
                className='rounded-xl'
                onClick={clearSelected}
                disabled={busy || selectedDays.length === 0}
              >
                Clear selected
              </Button>
            </div>
          </div>

          {!isValidWindow(newStart, newEnd) ? (
            <div className='mt-3 text-xs text-red-400'>Start time must be before end time.</div>
          ) : null}

          {saveState === "error" ? (
            <div className='mt-3 text-xs text-red-400'>Couldn’t save changes. Check your connection and try again.</div>
          ) : null}
        </div>

        {/* Per-day list (only relevant days unless “show all”) */}
        <div className='divide-y divide-zinc-900'>
          {weeklyQ.isLoading ? (
            <div className='p-6 text-sm text-zinc-400'>Loading…</div>
          ) : !model ? (
            <div className='p-6 text-sm text-zinc-400'>No data.</div>
          ) : visibleDays.length === 0 ? (
            <div className='px-5 py-8 text-sm text-zinc-400'>Select days above and add your first time window.</div>
          ) : (
            visibleDays.map((d) => {
              const day = model.days[d.key];
              const ranges = day.ranges ?? [];
              const enabled = day.enabled && ranges.length > 0;

              return (
                <div key={d.key} className='px-5 py-4'>
                  <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                    <div>
                      <div className='flex items-center gap-2'>
                        <div className='text-sm font-medium'>{d.long}</div>
                        <span className={["text-xs", enabled ? "text-emerald-300/80" : "text-zinc-500"].join(" ")}>
                          {enabled ? "Available" : "Not set"}
                        </span>
                      </div>
                      <div className='mt-1 text-xs text-zinc-500'>
                        {enabled ? "Guests can book within these windows." : "No time windows yet."}
                      </div>
                    </div>

                    <div className='flex flex-wrap gap-2 md:justify-end'>
                      {ranges.length ? (
                        ranges.map((r, idx) => (
                          <div
                            key={`${r.start}-${r.end}-${idx}`}
                            className='inline-flex items-center gap-2 rounded-xl border border-zinc-900 bg-black/25 px-3 py-2 text-sm text-zinc-200'
                          >
                            <span className='tabular-nums'>
                              {r.start}–{r.end}
                            </span>
                            <button
                              type='button'
                              disabled={busy}
                              onClick={() => removeRange(d.key, idx)}
                              className='text-xs text-zinc-500 hover:text-zinc-200'
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className='text-sm text-zinc-500'>—</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className='border-t border-zinc-900 px-5 py-4'>
          {!hasAnyAvailability ? (
            <div className='text-sm text-zinc-400'>
              Availability is currently <span className='text-zinc-200'>disabled</span>. Add at least one window to
              enable booking.
            </div>
          ) : (
            <div className='text-sm text-zinc-400'>Looks good. Guests will only see slots within these windows.</div>
          )}
        </div>
      </div>

      {/* Unavailable times (ship-safe placeholder) */}
      <div className='rounded-2xl border border-zinc-900 bg-zinc-950/40 shadow-sm overflow-hidden'>
        <div className='flex flex-col gap-3 border-b border-zinc-900 px-5 py-5 md:flex-row md:items-center md:justify-between'>
          <div>
            <div className='text-sm font-medium'>Unavailable times</div>
            <div className='mt-1 text-xs text-zinc-500'>
              Coming soon — block specific dates (vacation, appointments, etc.).
            </div>
          </div>

          <div className='flex gap-2'>
            <Button variant='ghost' className='rounded-xl' disabled>
              Block dates
            </Button>
            <Button variant='ghost' className='rounded-xl' disabled>
              Recurring unavailable
            </Button>
          </div>
        </div>

        <div className='p-6 text-sm text-zinc-400'>
          For V1, weekly schedule is fully supported. Availability blocks will be added next.
        </div>
      </div>

      {/* Undo toast */}
      {undoOpen ? (
        <div className='fixed bottom-6 right-6 z-50 rounded-2xl border border-zinc-900 bg-zinc-950/80 px-4 py-3 shadow-lg backdrop-blur'>
          <div className='flex items-center gap-3'>
            <div className='text-sm text-zinc-200'>Changes saved.</div>
            <button
              type='button'
              onClick={onUndo}
              className='text-sm text-zinc-100 underline underline-offset-4 hover:text-white'
            >
              Undo
            </button>
            <button
              type='button'
              onClick={() => setUndoOpen(false)}
              className='text-sm text-zinc-500 hover:text-zinc-200'
              aria-label='Dismiss'
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SaveStatus({ state }: { state: "idle" | "saving" | "saved" | "error" }) {
  if (state === "idle") return null;
  if (state === "saving") return <div className='text-xs text-zinc-500'>Saving…</div>;
  if (state === "saved") return <div className='text-xs text-emerald-300/80'>Saved</div>;
  return <div className='text-xs text-red-400'>Not saved</div>;
}

function isValidWindow(start: string, end: string) {
  return toMinutes(start) < toMinutes(end);
}

function toMinutes(t: string) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}

/** Sort + merge adjacent/overlapping windows (keeps the UI clean). */
function normalizeRanges(ranges: TimeRange[]): TimeRange[] {
  const sorted = ranges
    .map((r) => ({ ...r, s: toMinutes(r.start), e: toMinutes(r.end) }))
    .filter((r) => !Number.isNaN(r.s) && !Number.isNaN(r.e))
    .sort((a, b) => a.s - b.s);

  const merged: { s: number; e: number }[] = [];
  for (const r of sorted) {
    if (r.s >= r.e) continue;
    const last = merged[merged.length - 1];
    if (!last) merged.push({ s: r.s, e: r.e });
    else if (r.s <= last.e) last.e = Math.max(last.e, r.e);
    else merged.push({ s: r.s, e: r.e });
  }

  return merged.map((m) => ({
    start: `${String(Math.floor(m.s / 60)).padStart(2, "0")}:${String(m.s % 60).padStart(2, "0")}`,
    end: `${String(Math.floor(m.e / 60)).padStart(2, "0")}:${String(m.e % 60).padStart(2, "0")}`,
  }));
}
