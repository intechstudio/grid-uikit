import { writable } from "svelte/store";
import type { LogMessageType } from "./LogMessageType";

export type LogStreamMessage = {
  type: LogMessageType;
  message: string;
};

type LogStreamEntry = {
  data: LogStreamMessage;
  count: number;
};

export type LogStreamOptions = {
  /** Max number of entries kept on screen at once; oldest is dropped first. */
  maxVisible?: number;
  /** How long an entry stays before auto-clearing, in ms. */
  autoDismissMs?: number;
};

export function createLogStream(options: LogStreamOptions = {}) {
  const { maxVisible = 3, autoDismissMs = 5000 } = options;

  const store = writable<LogStreamEntry[]>([]);
  let isTimeoutEnabled = true;
  let clearHandle: ReturnType<typeof setTimeout> | undefined;

  function clearLogs(force = false) {
    if (isTimeoutEnabled || force) {
      store.set([]);
    } else {
      clearHandle = setTimeout(() => clearLogs(), 500);
    }
  }

  function push(entry: LogStreamMessage) {
    clearTimeout(clearHandle);

    store.update((entries) => {
      const last = entries.at(-1);
      if (last && last.data.message === entry.message) {
        last.count++;
        return entries;
      }

      const next = [...entries, { data: entry, count: 1 }];
      if (next.length > maxVisible) {
        next.shift();
      }
      return next;
    });

    clearHandle = setTimeout(() => clearLogs(), autoDismissMs);
  }

  function dismissLog({ index }: { index: number }) {
    store.update((entries) => {
      entries.splice(index, 1);
      return entries;
    });
  }

  function enableTimeout(value: boolean) {
    isTimeoutEnabled = value;
  }

  function reset() {
    clearTimeout(clearHandle);
    clearLogs(true);
  }

  return {
    subscribe: store.subscribe,
    push,
    dismissLog,
    enableTimeout,
    reset,
  };
}

export type LogStream = ReturnType<typeof createLogStream>;

export const logStreamStore = createLogStream();
