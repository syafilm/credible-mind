export type Article = {
  objectID: string;
  _highlightResult?: {} | undefined;
  _snippetResult?: {} | undefined;
  _rankingInfo?: undefined;
  _distinctSeqID?: number | undefined;
  slug: string;
  url: string;
  title: string;
  imageUrl: string;
  publicationDate: string;
  organization: Array<{
    fields: {
      name: string;
      slug: string;
    };
  }>;
  topics: Array<{
    id: string;
    title: string;
  }>;
  name: string;
  description: string;
}