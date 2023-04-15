export const bucketTopDir = {
  AvatarImg: 'AvatarImg',
  Test: 'Test',
};

export const noFormatRoute = [{ path: '/test', method: 'GET' }];

export const checkInNoFormatRoute = (path: string, method: string) => {
  let flag = false;
  noFormatRoute.forEach((item) => {
    if (path === item.path && method === item.method) {
      flag = true;
    }
  });
  return flag;
};

export const createImageSize = {
  sm: '256x256',
  ml: '512x512',
  lg: '1024x1024',
};
