// Simple placeholder metrics route to avoid "No metrics available" when
// the real metrics implementation is missing or fails. Replace this with
// the full GitHub/LeetCode fetching implementation later.

export async function GET() {
  function makeWeeks(weeks = 20) {
    // create `weeks` array where each week is 7 day objects
    const result: Array<Array<{ date: string; contributionCount: number }>> = [];
    const today = new Date();
    // align to last Sunday
    const dayOfWeek = today.getDay();
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - dayOfWeek);

    for (let w = 0; w < weeks; w++) {
      const week: Array<{ date: string; contributionCount: number }> = [];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(lastSunday);
        dt.setDate(lastSunday.getDate() - (weeks - 1 - w) * 7 + d);
        week.push({ date: dt.toISOString().slice(0, 10), contributionCount: Math.floor(Math.random() * 4) });
      }
      result.push(week);
    }
    return result;
  }

  const github = {
    totalContributions: 128,
    currentStreak: 5,
    avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    publicRepos: 42,
    weeks: makeWeeks(26),
  };

  const leetcode = {
    totalSolved: 131,
    weeks: makeWeeks(26),
    submissionsPastYear: 146,
    latestBadgeUrl: null,
  };

  return new Response(JSON.stringify({ github, leetcode }), {
    headers: { "Content-Type": "application/json" },
  });
}
