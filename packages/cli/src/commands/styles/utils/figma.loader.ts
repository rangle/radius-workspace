import * as Figma from 'figma-api';
import { FigmaFileParams, processFigmaUrl } from './figma.utils';

export const setupFigma = (key: string) => {
  const api = new Figma.Api({
    personalAccessToken: key
  });
  return {
    getFile: (fileKey: string) => api.getFile(fileKey),
    getFileNode: (fileKey: string, ids: string[]) =>
      api.getFileNodes(fileKey, ids)
  };
};

export const loadFile = ({ url, token }: FigmaFileParams) => {
  const { getFileNode } = setupFigma(token);
  const { fileId, nodeId } = processFigmaUrl({ url, token });

  const input = getFileNode(fileId,[nodeId]);
  return input;
};
