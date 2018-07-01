/**
 * Created by Administrator on 2018/6/15.
 */
  // 解析url参数
  // @example ?id=12345&a=b
  // @return Object {id:12345,a:b}
export function urlParse () {
  let url=window.location.search;
  let obj={};
  let reg=/[?&][^?&]+=[^?&]+/g;
  let arr=url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      let tempArr=item.substr(1).split('=');
      let key=tempArr[0];
      obj[key]=tempArr[1];
    })
  }
  return obj;
}
