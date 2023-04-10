export interface RepsCore {
  oneRep: boolean;
  twoRep: boolean;
  threeRep: boolean;
  fourRep: boolean;
  fiveRep: boolean;
}

export interface Reps extends RepsCore {
  id: number;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}
