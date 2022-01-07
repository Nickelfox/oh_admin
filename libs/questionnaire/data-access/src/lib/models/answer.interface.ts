import { Media } from '@hidden-innovation/media';

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
  subTitle: string;
  imageId: number;
  imageBlob: string;
  imageName: string;
}

export interface ImageSelectAnswerExtended extends ImageSelectAnswer {
  image: Media;
}

export interface MinMaxPoints {
  min: number | undefined;
  max: number | undefined;
}
