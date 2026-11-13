
export type RankingEntry = {
  id: string;
  name: string;
  score: number;
  createdAt: number;
};

const STORAGE_KEY = "nekokan-ranking";

// 保存済みのランキングを読み込む
export function loadRanking(): RankingEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsed: unknown = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (entry): entry is RankingEntry =>
        typeof entry === "object" &&
        entry !== null &&
        typeof entry.id === "string" &&
        typeof entry.name === "string" &&
        typeof entry.score === "number" &&
        Number.isFinite(entry.score) &&
        typeof entry.createdAt === "number"
    );
  } catch {
    return [];
  }
}

// 新しい体験結果を保存する
export function saveRanking(
  name: string,
  score: number
): RankingEntry {
  const newEntry: RankingEntry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    score: score,
    createdAt: Date.now(),
  };

  const ranking = loadRanking();

  ranking.push(newEntry);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(ranking)
  );

  return newEntry;
}

// 点数が高い順に並べる
export function getSortedRanking(): RankingEntry[] {
  return loadRanking().sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return a.createdAt - b.createdAt;
  });
}

// 展示終了後などに記録をリセットする
export function clearRanking(): void {
  localStorage.removeItem(STORAGE_KEY);
}
