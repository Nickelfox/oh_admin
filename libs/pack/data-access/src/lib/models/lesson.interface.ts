import { Media } from '@hidden-innovation/media';
import { Tag } from '@hidden-innovation/tags/data-access';
import { TagCategoryEnum } from '@hidden-innovation/shared/models';

export interface LessonCore {
  name: string;
  category: TagCategoryEnum | undefined;
  videoId: number;
  thumbnailId: number;
  tagIds: number[] | Tag[];
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
