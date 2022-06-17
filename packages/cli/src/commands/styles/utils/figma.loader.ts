import * as Figma from 'figma-api';
import { FigmaFileParams } from './figma.utils';
import { assert, regexSingleMatch } from './common.utils';
import { logger } from '../../../logger';
import figmaConfig from '../../../../figmaFileConfig.json';



export const getFigmaBlobs = (userToken: string) => {
  const promises = [];
  for (const url of figmaConfig.urls) {
    promises.push(loadFile({ url, token: userToken }));
  }
  return Promise.all(promises);
};

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

  assert(url,'Figma URL Not Found, please run styles command again and provide the URL: ');
  assert(token, 'Figma Token Not Found, please run styles command again and provide the token: ');

  const { getFileNode } = setupFigma(token);
  const { fileId, nodeId } = processFigmaUrl({ url, token });
  assertFigmaData({ fileId, nodeId, token });

  const input = getFileNode(fileId,[nodeId]).catch(() => {
    logger.error('Error loading Figma file');
    process.exit(1);
  });
  return input;
};

export type FigmaData = {
  fileId: string,
  nodeId: string,
  token: string,
};

export function assertFigmaData(d: unknown): asserts d is FigmaData {
  const { fileId, nodeId } = (d as FigmaData) ?? {};
  assert(Boolean(fileId), 'Please enter the URL for a valid Figma file');
  assert(Boolean(nodeId), 'Please enter the URL for a valid Figma file');
}

export const processFigmaUrl = ({ url, token }: FigmaFileParams): FigmaData => {
  const fileId = regexSingleMatch(url, /\/file\/(.*)\//);
  const encodedId = regexSingleMatch(url, /\?node-id=(.*)&?$/);
  const nodeId = encodedId && decodeURIComponent(encodedId);
  return { fileId, nodeId, token };
};
