  import {playSvga, stopSvga} from 'plugins/svga';

  const togglePraise = (nodeId: string, svgaSource: any) => {

    const player = playSvga(nodeId, svgaSource);
    setTimeout(
      () => {
        stopSvga(player);
      }, 1000
    );

  };

export default togglePraise;
