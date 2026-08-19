import { ProgressData, DEFAULT_PROGRESS } from '../types/progress';

const STORAGE_KEY = 'cardioqbank_progress';
const LEGACY_KEY = 'cvqbank_progress';

/** Ids belonging to the five QBanks that used to share the legacy key. */
const FOREIGN_IDS = /^(bo|bl|im|pa|ph)/;

function belongs(id: string): boolean {
  return !FOREIGN_IDS.test(id);
}

/** Keep only this QBank's rows: the six subjects shared one key until 2026-08-19. */
function split(data: ProgressData): ProgressData {
  const answers: ProgressData['answers'] = {};
  for (const [id, rec] of Object.entries(data.answers || {})) {
    if (belongs(id)) answers[id] = rec;
  }
  return {
    version: 1,
    answers,
    sessions: (data.sessions || []).filter(s =>
      (s.questionIds || []).some(belongs)),
    bookmarkedQuestions: (data.bookmarkedQuestions || []).filter(belongs),
    lastTopicFilter: data.lastTopicFilter || [],
  };
}

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.version !== 1) return { ...DEFAULT_PROGRESS };
      return data;
    }

    // First run on this key: take this QBank's rows out of the shared blob.
    // The blob is read but never rewritten — the other five QBanks migrate from
    // it too, and whichever runs first must not strip it for the others.
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed.version === 1) {
        const mine = split(parsed);
        saveProgress(mine);
        return mine;
      }
    }
    return { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(data: ProgressData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
