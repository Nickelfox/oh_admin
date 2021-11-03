export interface AnswerCore {
  point: number; // req
  name: string;
}

export interface MultipleChoiceAnswer extends AnswerCore {
  iconName: string; // req
}

export interface ImageSelectAnswer {
  point: number;
  title: string;
  sub_title: string;
  imageId: number;
}
