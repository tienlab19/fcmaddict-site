export type PlayerReview = {
  id: number;
  slug: string;
  name: string;
  position: string;
  event: string;
  image: string;
  rating: number;
  weakFoot: string;
  skillMoves: string;
  stamina: number;
  pros: string;
  cons: string;
  verdict: string;
  skillPoints: string[];
  alternatives: string[];
  playstyles: string[];
  author: string;
  createdDate: string;
  stats: { label: string; value: number }[];
};

export type LatestPlayer = {
  id: number;
  name: string;
  rating: number;
  position: string;
  added: string;
  auctionable: boolean;
  image: string;
  club: string;
  nation: string;
  program: string;
  stats: Record<string, number>;
};

export type RankingCard = {
  rank: number;
  name: string;
  image: string;
  marketValue: string;
  weakFoot: string;
  skillMoves: string;
  stamina: string;
  reviewLink: string;
};

export type RankingGroup = {
  updatedAt: string;
  cards: RankingCard[];
};

export type ShardPlayer = {
  id: string;
  name: string;
  image: string;
  overall: number;
  position: string;
  shardValue: number;
  event: string;
  quality: string;
  alternatives: string[];
};

export type ShardCombo = {
  players: { player: ShardPlayer; assignedPosition: string }[];
  totalCost: number;
  score: number;
  percentage: number;
};

export type Asset = {
  id: number;
  name: string;
  image: string;
  primary: string;
  secondary: string;
};

export type RedeemCode = {
  id: number;
  code: string;
  reward: string;
  addedDate: string;
  active: boolean;
};

export type CardAsset = {
  id: number;
  title: string;
  image: string;
  animatedImage: string;
  type: string;
};

export type AppData = {
  generatedAt: string;
  reviews: PlayerReview[];
  codes: RedeemCode[];
  cards: CardAsset[];
  playerRenders: Asset[];
  iconRenders: Asset[];
  rankings: Record<string, { top: RankingGroup; mid: RankingGroup; low: RankingGroup }>;
  shardPlayers: ShardPlayer[];
  latestPlayers: LatestPlayer[];
};
