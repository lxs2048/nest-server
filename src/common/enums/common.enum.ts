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
