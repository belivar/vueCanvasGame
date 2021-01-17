let ua: string = "";

try {
  if (window) {
    ua = window.navigator.userAgent;
  }
} catch (err) {}

// 获取每100秒变动一次的时间戳
export function getDelayTimestamp() {
  // 100s 更新一次的时间戳     100,000 ms
  return new Date()
    .getTime()
    .toString()
    .replace(/^(\d+)\d{5}$/, '$100000');
}

export function checkArg(a: any, b: any) {
  return a == undefined ? b : a;
}
export function getRandom(a: any, b: any) {
  return a + Math.round(Math.random() * (b - a));
}

const cache = new Set();

export async function preloadImage(src: string) {
  if (cache.has(src)) return Promise.resolve();
  return new Promise(resolve => {
    var img = new Image();
    img.onload = () => {
      cache.add(src);
      resolve({
        img,
        src,
      });
    };
    img.src = src;
  });
}

export function remove(list: any, a: any) {
  console.log('remove', list);
  if (a == undefined) {
    for (var i = 0; i < list.length; ) {
      list[i].remove();
    }
  } else {
    if (a.constructor == Number) {
      for (var i = 0; i < list.length; i++) {
        if (i == a) {
          list[i].remove();
          return list;
        }
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        if (list[i] == a) {
          list[i].remove();
          return list;
        }
      }
    }
  }
}

export function sortByAttr(list: any, a: any, b: any) {
  if (!!parseFloat(list[0][a])) {
    var c = list.length;
    var d, current;
    for (var i = 1; i < c; i++) {
      d = i - 1;
      current = list[i];
      while (d >= 0 && list[d][a] > current[a]) {
        list[d + 1] = list[d];
        d--;
      }
      list[d + 1] = current;
    }
    if (b == false) {
      list.reverse();
    }
  }
  return list;
}

export function insert(list: any, a: any, i: any) {
  console.log('insert', list, a, i);
  return list.substring(0, i) + a + list.substring(i);
}
export function ArraryEach(list: any, b: any) {
  for (var a = 0; a < list.length; a++) {
    // console.log();
    b(list[a], a);
  }
  return list;
}
export function countDis(a: any, b: any) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function judgeBigScreen() {
  //，这里根据返回值 true 或false ,返回true的话 则为全面屏
  let result = false;
  const rate = window.screen.height / window.screen.width;
  let limit = window.screen.height == window.screen.availHeight ? 1.8 : 1.65;
  // 临界判断值

  if (rate > limit) {
    result = true;
  }
  return result;
}

/**
 * 是否是百度app
 */
export function isBaiduApp() {
  let ua = '';
  try {
    if (window) {
      ua = window.navigator.userAgent;
    }
  } catch (err) {}
  return ~ua.indexOf('baiduboxapp');
}

/**
 * 是否是微信
 */
export function isWechat() {
  return ua.indexOf("MicroMessenger") > -1;
}

/**
 * 是否是iOS
 * @param version ios 特定版本
 *
 */
export function isIOS(version) {
  var isIOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua);
  if (!version || !isIOS) return isIOS;
  return iOSVersion() === version;
}

/**
 * 返回iOS的版本 若不是iOS则返回空字符串
 */
export function iOSVersion() {
  if (ua.match(/cpu iphone os (.*?) like mac os/i)) {
    return ua.match(/cpu iphone os (.*?) like mac os/i)[1].replace(/_/g, '.');
  }
  return '';
}

/**
 * 是否是安卓
 */
export function isAndroid() {
  return ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
}

/**
 * 延迟
 * @param time 单位：毫秒
 */
export function sleep(time: number) {
  return new Promise(function(resolve) {
    return setTimeout(resolve, time);
  });
};