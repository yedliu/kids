export const isMobile = () => {
  return /Android|webOS|iPhone|iPad/i.test(navigator.userAgent);
};
export const isAndroid = () => /android/g.test(navigator.userAgent.toLowerCase());
