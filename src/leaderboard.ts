export interface LeaderboardEntry {
    name: string;
    moves: number;
  }
  
  const API_URL = 'http://localhost/api/leaderboard.php';
  
  export async function submitScore(entry: LeaderboardEntry): Promise<void> {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
  }
  
  export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      return [];
    }
  }
  