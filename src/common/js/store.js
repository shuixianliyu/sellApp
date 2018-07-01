/**
 * Created by Administrator on 2018/6/19.
 */
export function setStorage (id, key, value) {
  let seller=window.localStorage._seller_;
  if (!seller) {
    seller={};
  } else {
    seller=JSON.parse(seller);
  }
  seller[id]={};
  seller[id][key]=value;
  window.localStorage._seller_=JSON.stringify(seller);
}
export function readStorage (id, key, def) {
  let seller=window.localStorage._seller_;
  if (!seller) {
    return def
  } else {
    seller=JSON.parse(seller);
    if (!seller[id]) {
      return def;
    }
    return seller[id][key];
  }
}
