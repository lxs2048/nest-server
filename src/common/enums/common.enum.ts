export enum Role {
  /** 超管 */
  SUPER_ADMIN = 0,
  /** 普通用户 */
  ORDINARY_USER = 1,
}

export enum StatusValue {
  /** 禁用,未支付 */
  FORBIDDEN = 0,
  /** 正常使用,已支付 */
  NORMAL = 1,
}

export const bucketTopDir = {
  AvatarImg: 'AvatarImg',
  Test: 'Test',
};

export const noFormatRoute = [
  { path: '/test', method: 'GET' },
  { path: '/order/payCb', method: 'POST' },
];

export const checkInNoFormatRoute = (path: string, method: string) => {
  let flag = false;
  noFormatRoute.forEach((item) => {
    if (path === item.path && method === item.method) {
      flag = true;
    }
  });
  return flag;
};
