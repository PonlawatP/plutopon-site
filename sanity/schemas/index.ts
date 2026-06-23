import { type SchemaTypeDefinition } from "sanity";

import { post } from "./post";
import { project } from "./project";
import { uiStrings } from "./uiStrings";
import { localizedString } from "./localizedString";
import { localizedText } from "./localizedText";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, project, uiStrings, localizedString, localizedText],
};
