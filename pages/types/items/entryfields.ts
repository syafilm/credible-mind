import { SpaceSys, EnvironmentSys } from "./entrysys";
import { Metadata } from "./metadata";

interface AssetSys {
  space: SpaceSys;
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: EnvironmentSys;
  revision: number;
  locale: string;
}

interface AssetFields {
  title: string;
  description: string;
  file: AssetFile;
}

interface AssetDetails {
  size: number;
  image: {
    width: number;
    height: number;
  };
}

interface AssetFile {
  url: string;
  details: AssetDetails;
  fileName: string;
  contentType: string;
}

export type EntryFields = {
  ttile: string; // Note: "ttile" should be "title"
  logo: {
    metadata: Metadata;
    sys: AssetSys;
    fields: AssetFields;
  };
  searchLabel: string;
  menuLabel: string;
}