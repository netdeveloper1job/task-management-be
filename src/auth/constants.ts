export const jwtConstants = {
  secret: 'secretKey',
};

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); //Add @Public() decorator on any endpoint to skipAuth
