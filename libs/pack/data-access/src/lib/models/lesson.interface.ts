import { Media } from '@hidden-innovation/media';
import { Tag } from '@hidden-innovation/tags/data-access';

export interface Lesson {
  id: number;
  packId: number;
  name: string;
  category: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  thumbnail: Media;
  video: Media;
  videoFileId: number;
  thumbnailId: number;
  tags: Tag[];
}
