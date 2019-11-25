export const priceMap = new Map()
  .set(1, "一等奖")
  .set(2, "二等奖")
  .set(3, "三等奖");
export function dealPrice(awardList) {
  for (let item of awardList) {
    item.price = priceMap.get(item.price);
  }
  return awardList;
}
export const statusMap = new Map().set(0, "未开奖").set(1, "已开奖");
export const baseUrl = "http://47.101.135.197/#";
