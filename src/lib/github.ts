export interface ContributionDay {
  date: string;
  level: number; // 0-4
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface MonthLabel {
  label: string;
  colspan: number;
}

export interface ContributionData {
  weeks: ContributionWeek[];
  months: MonthLabel[];
  totalContributions: number;
}

/**
 * Fetches the last ~52 weeks of GitHub contribution data
 * from the public contributions page (no token needed).
 *
 * GitHub's HTML is a <table> with 7 <tr> rows (Sun–Sat),
 * each containing ~53 <td> cells (one per week-column).
 * We transpose that into week-columns of 7 day-rows.
 */
export async function fetchContributions(
  username: string
): Promise<ContributionData> {
  const res = await fetch(
    `https://github.com/users/${username}/contributions`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    return { weeks: [], months: [], totalContributions: 0 };
  }

  const html = await res.text();

  // ── Total contributions ──
  const totalMatch = html.match(
    /(\d[\d,]*)\s+contributions?\s+in\s+the\s+last\s+year/i
  );
  const totalContributions = totalMatch
    ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
    : 0;

  // ── Month labels from <thead> ──
  // Each <td class="ContributionCalendar-label" colspan="N"> holds a month
  const monthRegex =
    /ContributionCalendar-label"[^>]*colspan="(\d+)"[^>]*>[\s\S]*?<span[^>]*>(\w+)<\/span>/g;
  const months: MonthLabel[] = [];
  let monthMatch: RegExpExecArray | null;
  while ((monthMatch = monthRegex.exec(html)) !== null) {
    months.push({
      label: monthMatch[2].slice(0, 3), // "January" → "Jan"
      colspan: parseInt(monthMatch[1], 10),
    });
  }

  // ── Contribution cells ──
  // HTML has 7 <tr> rows (Sun=0 … Sat=6).
  // Within each row, cells appear left-to-right (week 0, 1, 2 …).
  // We need to collect them by row, then transpose into columns (weeks).

  // Split the <tbody> into individual <tr> blocks
  const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/);
  if (!tbodyMatch) {
    return { weeks: [], months, totalContributions };
  }
  const tbody = tbodyMatch[1];

  // Each <tr> is one day-of-week row
  const trBlocks = tbody.split(/<tr[^>]*>/).filter((b) => b.includes("data-date"));

  const rows: ContributionDay[][] = [];
  const cellRegex =
    /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;

  for (const tr of trBlocks) {
    const row: ContributionDay[] = [];
    let cell: RegExpExecArray | null;
    cellRegex.lastIndex = 0;
    while ((cell = cellRegex.exec(tr)) !== null) {
      row.push({ date: cell[1], level: parseInt(cell[2], 10) });
    }
    rows.push(row);
  }

  // Transpose: rows[dayOfWeek][weekIndex] → weeks[weekIndex].days[dayOfWeek]
  const numWeeks = Math.max(...rows.map((r) => r.length));
  const weeks: ContributionWeek[] = [];

  for (let w = 0; w < numWeeks; w++) {
    const days: ContributionDay[] = [];
    for (let d = 0; d < rows.length; d++) {
      if (rows[d][w]) {
        days.push(rows[d][w]);
      }
    }
    if (days.length > 0) {
      weeks.push({ days });
    }
  }

  return { weeks, months, totalContributions };
}

// ── Streak computation ──

export interface StreakData {
  current: number;
  longest: number;
}

export function computeStreaks(weeks: ContributionWeek[]): StreakData {
  // Flatten all days in chronological order
  const days = weeks.flatMap((w) => w.days);
  let longest = 0;
  let current = 0;

  for (const day of days) {
    if (day.level > 0) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }

  return { current, longest };
}

// ── Top languages via GraphQL (weighted by bytes across all contributed repos) ──

export interface LanguageStat {
  name: string;
  bytes: number;
  percent: number;
}

const USER_LANGUAGES_QUERY = `
  query($username: String!) {
    user(login: $username) {
      repositories(ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
        nodes {
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges { size node { name } }
          }
        }
      }
    }
  }
`;

const ORG_LANGUAGES_QUERY = `
  query($org: String!) {
    organization(login: $org) {
      repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
        nodes {
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges { size node { name } }
          }
        }
      }
    }
  }
`;

const GITHUB_ORGS = ["converty-shop"];

async function graphqlFetch(token: string, query: string, variables: Record<string, string>) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchTopLanguages(
  username: string
): Promise<LanguageStat[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return fetchTopLanguagesREST(username);
  }

  // Fetch user repos + org repos in parallel
  const [userJson, ...orgJsons] = await Promise.all([
    graphqlFetch(token, USER_LANGUAGES_QUERY, { username }),
    ...GITHUB_ORGS.map((org) =>
      graphqlFetch(token, ORG_LANGUAGES_QUERY, { org })
    ),
  ]);

  const allRepos: { languages?: { edges: { size: number; node: { name: string } }[] } }[] = [];

  const userRepos = userJson?.data?.user?.repositories?.nodes;
  if (userRepos) allRepos.push(...userRepos);

  for (let i = 0; i < GITHUB_ORGS.length; i++) {
    const orgRepos = orgJsons[i]?.data?.organization?.repositories?.nodes;
    if (orgRepos) allRepos.push(...orgRepos);
  }

  if (allRepos.length === 0) return fetchTopLanguagesREST(username);

  // Cap each repo's contribution at 1MB to prevent bloated repos from skewing results
  const MAX_REPO_BYTES = 1_000_000;

  const bytes: Record<string, number> = {};
  for (const repo of allRepos) {
    const edges = repo.languages?.edges ?? [];
    const repoTotal = edges.reduce((s: number, e: { size: number }) => s + e.size, 0);
    const scale = repoTotal > MAX_REPO_BYTES ? MAX_REPO_BYTES / repoTotal : 1;
    for (const edge of edges) {
      const name = edge.node.name;
      bytes[name] = (bytes[name] || 0) + Math.round(edge.size * scale);
    }
  }

  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(bytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, b]) => ({
      name,
      bytes: b,
      percent: Math.round((b / total) * 100),
    }));
}

/** REST fallback — only counts personal public repos */
async function fetchTopLanguagesREST(
  username: string
): Promise<LanguageStat[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const repos: { language: string | null }[] = await res.json();

  const counts: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) {
      counts[r.language] = (counts[r.language] || 0) + 1;
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      bytes: count,
      percent: Math.round((count / total) * 100),
    }));
}
