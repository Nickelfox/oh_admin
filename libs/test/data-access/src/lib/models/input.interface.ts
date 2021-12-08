export interface OneRMInputField {
  pointType: string;
  point: number;
  low: number;
  high: number;
}

export interface InputInputFieldCore {
  pointType: string;
  point: number;
  low: number;
  high: number;
}

export interface InputInputField extends InputInputFieldCore {
  id: number;
  testId: number;
}
