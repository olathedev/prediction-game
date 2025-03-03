export interface PlayerData {
  username: string;
  currentStreak: bigint;
  hasPlayed: boolean;
  playerAddress: string;
  stakedAmount: bigint;
  totalCorrect: bigint;
  totalPoints: bigint;
}
