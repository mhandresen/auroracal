import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button } from "../../components/custom/button";
import { Input } from "../../components/custom/input";
import { useAuth } from "../../hooks/use-auth";
import {
  listMeetingTypes,
  createMeetingType,
  updateMeetingType,
  deleteMeetingType,
  type MeetingType,
} from "../../features/meeting-types/meetingTypes.api";
import { suggestSlug } from "../../features/meeting-types/slug";

// If you have shadcn Dialog:
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";

export const Route = createFileRoute("/app/meeting-types")({
  component: RouteComponent,
});

function RouteComponent() {
  const qc = useQueryClient();
  const { role } = useAuth();

  const listQ = useQuery({
    queryKey: ["meeting-types"],
    queryFn: listMeetingTypes,
  });

  const createM = useMutation({
    mutationFn: createMeetingType,
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["meeting-types"] }),
  });

  const updateM = useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => updateMeetingType(id, input),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["meeting-types"] }),
  });

  const deleteM = useMutation({
    mutationFn: deleteMeetingType,
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["meeting-types"] }),
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MeetingType | null>(null);

  const items = listQ.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
    createM.reset();
    updateM.reset();
  };

  const openEdit = (mt: MeetingType) => {
    setEditing(mt);
    setOpen(true);
    createM.reset();
    updateM.reset();
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
    createM.reset();
    updateM.reset();
  };

  const busy = createM.isPending || updateM.isPending || deleteM.isPending;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Meeting types</h1>
          <p className='mt-1 text-sm text-zinc-400'>Define what guests can book. Keep names short and URLs readable.</p>
        </div>

        <div className='flex items-center gap-2'>
          <Button onClick={openCreate} className='rounded-xl'>
            New meeting type
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className='rounded-2xl border border-zinc-900 bg-zinc-950/40 shadow-sm'>
        {/* Table header */}
        <div className='hidden grid-cols-12 gap-3 border-b border-zinc-900 px-4 py-3 text-xs text-zinc-500 md:grid'>
          <div className='col-span-5'>Name</div>
          <div className='col-span-3'>URL</div>
          <div className='col-span-2'>Duration</div>
          <div className='col-span-2 text-right'>Actions</div>
        </div>

        {/* Empty state */}
        {listQ.isLoading ? (
          <div className='p-6 text-sm text-zinc-400'>Loading…</div>
        ) : items.length === 0 ? (
          <div className='p-8'>
            <div className='max-w-lg'>
              <div className='text-base font-medium'>Create your first meeting type</div>
              <p className='mt-1 text-sm text-zinc-400'>
                Meeting types define duration and location details guests see on your booking page.
              </p>
              <div className='mt-4'>
                <Button onClick={openCreate} className='rounded-xl'>
                  New meeting type
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className='divide-y divide-zinc-900'>
            {items.map((mt) => (
              <div key={mt.id} className='grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-12 md:items-center md:gap-3'>
                <div className='md:col-span-5'>
                  <div className='font-medium leading-5'>{mt.name}</div>
                  <div className='mt-1 text-xs text-zinc-500'>
                    {mt.locationValue ? mt.locationValue : "Manual location"}
                  </div>
                </div>

                <div className='md:col-span-3'>
                  <div className='inline-flex items-center rounded-lg border border-zinc-900 bg-black/30 px-2 py-1 text-xs text-zinc-300'>
                    /{mt.slug}
                  </div>
                </div>

                <div className='md:col-span-2'>
                  <div className='text-sm text-zinc-200'>{mt.durationMinutes} min</div>
                </div>

                <div className='md:col-span-2 md:text-right'>
                  <div className='flex gap-2 md:justify-end'>
                    <Button variant='ghost' className='rounded-xl' onClick={() => openEdit(mt)} disabled={busy}>
                      Edit
                    </Button>

                    {role === "OWNER" ? (
                      <Button
                        variant='ghost'
                        className='rounded-xl'
                        onClick={() => deleteM.mutate(mt.id)}
                        disabled={busy}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </div>

                {/* Mobile-only quick meta */}
                <div className='md:hidden text-xs text-zinc-500'>
                  /{mt.slug} • {mt.durationMinutes} min
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {listQ.isError ? <div className='text-sm text-red-400'>{(listQ.error as Error).message}</div> : null}
      {deleteM.isError ? <div className='text-sm text-red-400'>{(deleteM.error as Error).message}</div> : null}

      {/* Create/Edit Modal */}
      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
        <DialogContent className='rounded-2xl border border-zinc-900 bg-zinc-950 text-zinc-100'>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit meeting type" : "New meeting type"}</DialogTitle>
            <DialogDescription className='text-zinc-400'>
              This controls what guests see and the URL they’ll visit.
            </DialogDescription>
          </DialogHeader>

          <MeetingTypeForm
            key={editing?.id ?? "new"}
            initial={editing ?? undefined}
            busy={createM.isPending || updateM.isPending}
            serverError={
              (createM.isError && (createM.error as Error).message) ||
              (updateM.isError && (updateM.error as Error).message) ||
              null
            }
            onCancel={close}
            onSave={(values) => {
              if (editing) updateM.mutate({ id: editing.id, input: values }, { onSuccess: close });
              else createM.mutate(values, { onSuccess: close });
            }}
          />

          <DialogFooter className='mt-2' />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MeetingTypeForm(props: {
  initial?: MeetingType;
  busy: boolean;
  serverError: string | null;
  onCancel: () => void;
  onSave: (values: {
    name: string;
    slug: string;
    durationMinutes: number;
    locationType: "manual";
    locationValue: string | null;
  }) => void;
}) {
  const [name, setName] = useState(props.initial?.name ?? "");
  const [slug, setSlug] = useState(props.initial?.slug ?? "");
  const [durationMinutes, setDurationMinutes] = useState<number>(props.initial?.durationMinutes ?? 30);
  const [locationValue, setLocationValue] = useState<string>(props.initial?.locationValue ?? "");

  const suggested = useMemo(() => suggestSlug(name), [name]);
  const finalSlug = (slug.trim() || suggested).trim();

  const canSave = name.trim().length >= 2 && finalSlug.length >= 2 && durationMinutes >= 5;

  return (
    <div className='space-y-4'>
      {props.serverError ? <div className='text-sm text-red-400'>{props.serverError}</div> : null}

      <div className='grid gap-3'>
        <Field label='Name' hint='Shown to guests on the booking page.'>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Intro call'
            disabled={props.busy}
          />
        </Field>

        <Field
          label='URL'
          hint={
            <>
              Guests will visit <span className='text-zinc-300'>/{finalSlug || "your-slug"}</span>. We’ll auto-suffix if
              taken.
            </>
          }
        >
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={suggested || "intro-call"}
            disabled={props.busy}
          />
        </Field>

        <div className='grid gap-3 md:grid-cols-2'>
          <Field label='Duration (minutes)' hint='Common: 15, 30, 45, 60.'>
            <Input
              type='number'
              min={5}
              max={480}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              disabled={props.busy}
            />
          </Field>

          <Field label='Location' hint='Optional. Example: Google Meet, Phone, Address.'>
            <Input
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              placeholder='Google Meet'
              disabled={props.busy}
            />
          </Field>
        </div>
      </div>

      <div className='flex items-center justify-end gap-2 pt-2'>
        <Button variant='ghost' className='rounded-xl' onClick={props.onCancel} disabled={props.busy}>
          Cancel
        </Button>
        <Button
          className='rounded-xl'
          onClick={() =>
            props.onSave({
              name: name.trim(),
              slug: finalSlug,
              durationMinutes,
              locationType: "manual",
              locationValue: locationValue.trim() || null,
            })
          }
          disabled={!canSave || props.busy}
        >
          {props.busy ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

function Field(props: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className='space-y-1'>
      <div className='text-xs font-medium text-zinc-200'>{props.label}</div>
      {props.children}
      {props.hint ? <div className='text-[11px] text-zinc-500'>{props.hint}</div> : null}
    </div>
  );
}
