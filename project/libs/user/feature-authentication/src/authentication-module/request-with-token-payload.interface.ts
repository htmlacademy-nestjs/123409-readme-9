import { TokenPayload } from '@project/core';

export interface RequestWithTokenPayload {
  user?: TokenPayload
}