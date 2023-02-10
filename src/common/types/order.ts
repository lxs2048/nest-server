/* 微信支付通知结果 */
interface IResource {
  original_type?: string;
  algorithm?: string;
  ciphertext?: string;
  associated_data?: string;
  nonce?: string;
}

export interface IPayCbOption {
  id?: string;
  create_time?: string;
  resource_type?: string;
  event_type?: string;
  summary?: string;
  resource?: IResource;
}
/* nest-wechatpay-node-v3解析通知结果 */

interface IPayer {
  openid?: string;
}

interface IAmount {
  total?: number;
  payer_total?: number;
  currency?: string;
  payer_currency?: string;
}

export interface IParsePayCbOption {
  mchid?: string;
  appid?: string;
  out_trade_no?: string;
  transaction_id?: string;
  trade_type?: string;
  trade_state?: string; //交易状态
  trade_state_desc?: string;
  bank_type?: string;
  attach?: string;
  success_time?: string;
  payer?: IPayer;
  amount?: IAmount;
}

/* 交易状态trade_state */
export enum TradeState {
  SUCCESS = 'SUCCESS', //支付成功
  REFUND = 'REFUND', //转入退款
  NOTPAY = 'NOTPAY', //未支付
  CLOSED = 'CLOSED', //已关闭
  REVOKED = 'REVOKED', //已撤销（付款码支付）
  USERPAYING = 'USERPAYING', //用户支付中（付款码支付）
  PAYERROR = 'PAYERROR', //支付失败(其他原因，如银行返回失败)
}
