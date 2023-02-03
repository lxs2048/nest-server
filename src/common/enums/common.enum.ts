export const bucketTopDir = {
  AvatarImg: 'AvatarImg',
  Test: 'Test',
};

export enum Role {
  /** 超管 */
  SUPER_ADMIN = 0,
  /** 普通用户 */
  ORDINARY_USER = 1,
}

export enum StatusValue {
  /** 禁用 */
  FORBIDDEN = 0,
  /** 正常使用 */
  NORMAL = 1,
}

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
