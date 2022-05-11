export enum OperationTypeEnum {
  CREATE,
  EDIT
}

export enum SortingEnum {
  DESC = 'DESC',
  ASC = 'ASC'
}

export enum PublishStatusEnum {
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished'
}

export enum ContentSelectorOpType {
  SINGLE,
  OTHER
}

export interface OrderedContent {
  order: number;
  id: number;
}
