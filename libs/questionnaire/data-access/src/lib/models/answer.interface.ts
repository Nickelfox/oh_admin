interface Answer {
  points: number; // req
  answer: any; // req
}

export interface SliderAnswer extends Answer {
  answer: string;
}

export interface MultipleChoiceAnswer extends Answer {
  fa_icon: string; // req
  answer: string;
}

export interface VerticalSelectAnswer extends Answer {
  fa_icon: string; // req
  answer: number;
}

// Fixed count of answers YES/NO
export interface YesNoChoiceAnswer extends Answer {
  answer: string;
}

export interface ImageSelectAnswer extends Answer {
  answer: {
    media_url: string;
    media_name: string;
    title: string;
    sub_title: string;
  };
}

interface VerticleSelectAnswer extends Answer {
  fa_icon: string; // req
  answer: number;
}
