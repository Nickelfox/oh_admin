export interface RepsCore {
  oneRep: boolean;
  threeRep: boolean;
  fiveRep: boolean;
}

export interface Reps extends RepsCore {
  id: number;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}
