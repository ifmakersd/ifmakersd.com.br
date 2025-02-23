import type { NextApiRequest, NextApiResponse } from "next";
import { CmsClient } from "../../services/ContentfulClient";
import { CollaboratorCMS } from "./schema/collaborator";

const CONTENT_TYPE = "author";

const createCollaborator = (item: any) => {
  if (!item || !item.fields) {
    return null;
  }

  const collaborator: CollaboratorCMS = {
    name: item.fields.name,
    slug: item.fields.slug,
    photo: {
      url: item.fields.photo.fields.file.url,
      type: item.fields.photo.fields.file.contentType,
    },
    description: item.fields.description,
    webpage: item.fields.webpage,
  };
  return collaborator;
};

const createCollaboratorsAndParse = (items: any) => {
  const collaborators = [];
  for (let item of items) {
    const formatedCollaborator = createCollaborator(item);
    if (formatedCollaborator) {
      collaborators.push(formatedCollaborator);
    }
  }
  return collaborators;
};

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { limit = 10 } = req.query;
  const data = await CmsClient.getEntries({
    content_type: CONTENT_TYPE,
    order: "-sys.createdAt",
    limit,
  });

  const newData = createCollaboratorsAndParse(data.items);

  res.status(200).json(newData);
};

const fetchCollaborators = async (limitReq?: number) => {
  const limit = limitReq && 10;
  const data = await CmsClient.getEntries({
    content_type: CONTENT_TYPE,
    order: "-sys.createdAt",
    limit,
  });

  const newData = createCollaboratorsAndParse(data.items);

  return newData;
};

const fetchCollaborator = async (slug: string) => {
  const data = await CmsClient.getEntries({
    content_type: CONTENT_TYPE,
    limit: 1,
    "fields.slug": slug,
  });

  const newData = data ? createCollaborator(data.items[0]) : null;

  return newData;
};

const generateCollaboratorUrl = (slug: string) => {
  return `/collaborators/${slug}`;
};

export default handleRequest;
export { fetchCollaborators, fetchCollaborator, generateCollaboratorUrl };
