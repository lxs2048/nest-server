export const customExceptionInfo = (status: number, oldMessage: string) => {
  switch (status) {
    case 500:
      return '服务端错误，请联系管理员';
    case 401:
      return '未登录，请前往登录';
    case 403:
      return '没有操作权限';
    case 404:
      return '资源跑丢了';
    default:
      return oldMessage;
  }
};
