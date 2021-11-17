import { DifficultyEnum, TagCategoryEnum } from '@hidden-innovation/shared/models';

export interface TestCore {
  id: number;
  name: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  category: TagCategoryEnum;
  difficulty: DifficultyEnum;
  input: string;
  status: boolean;
}
