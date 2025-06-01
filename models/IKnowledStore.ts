export interface ICreateKnowledgeStore{
    name: string,
    description: string
}

export interface IAddMaterialToKnowledgeStore {
  knowledgeStoreId: number;
  materialIds: Array<number>
}

export interface IUpdate{
  name: string,
  description: string
}