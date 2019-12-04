export function getNumb() {
  const num: number[] = [];
  for (let i = 0; i < 10; i++) {
    const val = Math.ceil(Math.random() * 30);
    let isEqu = false;
    for (const idx in num) {
      if (num[idx] === val) {
        isEqu = true;
        break;
      }
    }
    if (isEqu) {
      i--;
    } else {
      num[num.length] = val;
    }
  }
  return num;
}

// scrollTop animation
export function scrollTop(el: any, from: number = 0, to: any, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      ((callback) => {
        return window.setTimeout(callback, 1000 / 60);
      })
    );
  }
  const difference = Math.abs(from - to);
  const steps = Math.ceil(difference / duration * 50);

  function scroll(start: any, end: any, step: any) {
    if (start === end) {
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, steps);
}

export function assert(condition: any, msg: any) {
  if (!condition) {
    throw new Error(`[Apior] ${msg}`);
  }
}

// 日期转换函数
// export function monment()
