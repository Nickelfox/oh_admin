import { DifficultyEnum, TagCategoryEnum, TestInputTypeEnum } from '@hidden-innovation/shared/models';

export interface TestCore {
  id: number;
  name: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  category: TagCategoryEnum;
  difficulty: DifficultyEnum;
  input: TestInputTypeEnum;
  status: boolean;
}
