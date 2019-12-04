import SVGA from 'svgaplayerweb';

export function playSvga(canvasId: string, svgaUrl: any) {
  const player = new SVGA.Player('#' + canvasId);
  const parser = new SVGA.Parser(); // 如果你需要支持 IE6+，那么必须把同样的选择器('#' + canvasId)传给 Parser。
  parser.load(svgaUrl, (videoItem: any) => {
    player.setVideoItem(videoItem);
    player.startAnimation();
  });
  return player;
}
export function stopSvga(player: any) {
  player.stopAnimation();
}


export function liteStopSvga(player: any) {
  player.stop();
  player.destroy();
}

