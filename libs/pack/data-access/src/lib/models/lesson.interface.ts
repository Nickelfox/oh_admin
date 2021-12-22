import { Media } from '@hidden-innovation/media';
import { Tag } from '@hidden-innovation/tags/data-access';

export interface LessonCore {
  name: string;
  category: string;
  videoId: number;
  thumbnailId: number;
  tagIds: number[];
}

export interface Lesson extends LessonCore {
  id: number;
  packId: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  thumbnail: Media;
  video: Media;
  tags: Tag[];
}
