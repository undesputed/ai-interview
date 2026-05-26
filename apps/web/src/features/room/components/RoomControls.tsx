'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Captions,
  CaptionsOff,
  Hand,
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Video,
  VideoOff,
} from 'lucide-react';
import { RoomButton } from './RoomButton';
import type { AIMode } from '../mockSession';

interface RoomControlsProps {
  aiMode: AIMode;
}

/**
 * Bottom control bar — mic / cam / captions / nudge AI / raise hand / end.
 * Toggle state is local mock for now; will hook into Chime SDK later.
 */
export function RoomControls({ aiMode }: RoomControlsProps) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [captionsOn, setCaptionsOn] = useState(true);
  const showAiNudge = aiMode !== 'spectator';

  return (
    <div className="flex h-[96px] shrink-0 items-center justify-center gap-6 border-t border-[var(--color-rule)] bg-[var(--color-canvas)] px-6">
      <RoomButton
        state={micOn ? 'on' : 'off'}
        label={micOn ? 'mic' : 'muted'}
        icon={
          micOn ? (
            <Mic strokeWidth={1.4} className="h-4 w-4" />
          ) : (
            <MicOff strokeWidth={1.4} className="h-4 w-4" />
          )
        }
        onClick={() => setMicOn((v) => !v)}
      />
      <RoomButton
        state={camOn ? 'on' : 'off'}
        label={camOn ? 'camera' : 'off'}
        icon={
          camOn ? (
            <Video strokeWidth={1.4} className="h-4 w-4" />
          ) : (
            <VideoOff strokeWidth={1.4} className="h-4 w-4" />
          )
        }
        onClick={() => setCamOn((v) => !v)}
      />
      <RoomButton
        state={captionsOn ? 'on' : 'neutral'}
        label="captions"
        icon={
          captionsOn ? (
            <Captions strokeWidth={1.4} className="h-4 w-4" />
          ) : (
            <CaptionsOff strokeWidth={1.4} className="h-4 w-4" />
          )
        }
        onClick={() => setCaptionsOn((v) => !v)}
      />

      <RoomButton
        state="neutral"
        label="raise hand"
        icon={<Hand strokeWidth={1.4} className="h-4 w-4" />}
      />

      {showAiNudge && (
        <RoomButton
          state="amber"
          label="nudge AI"
          icon={<Sparkles strokeWidth={1.4} className="h-4 w-4" />}
        />
      )}

      <span aria-hidden className="mx-2 h-10 w-px bg-[var(--color-rule)]" />

      <Link href="/dashboard" aria-label="End interview">
        <RoomButton
          state="danger"
          label="end"
          icon={<PhoneOff strokeWidth={1.4} className="h-4 w-4" />}
        />
      </Link>
    </div>
  );
}
