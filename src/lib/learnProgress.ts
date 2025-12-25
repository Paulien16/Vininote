export type ModuleProgress = {
    passed: boolean;
    bestScore: number;
    attempts: number;
    xp: number;
  };
  
  export const MODULE_KEYS = {
    grapeQuiz: "learn:basics:grape:quiz",
    // plus tard :
    // regionQuiz: "learn:basics:region:quiz",
    // vintageQuiz: "learn:basics:vintage:quiz",
  } as const;
  
  export function readModuleProgress(key: string): ModuleProgress | null {
    if (typeof window === "undefined") return null;
  
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
  
      return {
        passed: Boolean(parsed?.passed),
        bestScore: Number(parsed?.bestScore ?? 0),
        attempts: Number(parsed?.attempts ?? 0),
        xp: Number(parsed?.xp ?? 0),
      };
    } catch {
      return null;
    }
  }
  