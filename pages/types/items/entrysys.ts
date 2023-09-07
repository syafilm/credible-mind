export interface SpaceSys {
  type: string;
  linkType: string;
  id: string;
}

export interface EnvironmentSys {
  id: string;
  type: string;
  linkType: string;
}

interface ContentTypeSys {
  type: string;
  linkType: string;
  id: string;
}

export type EntrySys = {
  space: SpaceSys;
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: EnvironmentSys;
  revision: number;
  contentType: ContentTypeSys;
  locale: string;
}
