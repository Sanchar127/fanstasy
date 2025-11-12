export interface TeamData {
  userId: number;
  teamName: string;
  players: string[];
  captain: string;
  viceCaptain: string;
  pointsList: Record<string, number>;
  totalPoints: number;
}

export interface PlayerInputProps {
  players: string[];
  onPlayersChange: (players: string[]) => void;
  captain: string;
  viceCaptain: string;
  onCaptainChange: (captain: string) => void;
  onViceCaptainChange: (viceCaptain: string) => void;
}