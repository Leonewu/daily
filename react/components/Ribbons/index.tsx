import React, { useEffect, useRef } from 'react';
import Ribbons from './Ribbons';

type Props = {
  run?: boolean;
  /* 宽度默认为 window.innerWidth，不支持异步数据 */
  width?: number;
  /* 高度默认为 window.innerHeight，不支持异步数据 */
  height?: number;
  style?: React.CSSProperties;
};

/**
 * @describtion 彩带飘落组件
 * */
export default React.memo<Props>((props) => {
  const ribbons = useRef<Ribbons>();
  const { run, width = window.innerWidth, height = window.innerHeight, style } = props;

  useEffect(() => {
    setTimeout(() => {
      if (!ribbons.current) {
        const r = new Ribbons({
          id: 'ribbons',
        });
        ribbons.current = r;
      }
      if (run) {
        ribbons.current?.run();
      } else {
        ribbons.current?.cancel();
      }
    });
    return () => {
      ribbons.current?.cancel();
    };
  }, [run]);

  return <canvas id="ribbons" width={width} height={height} style={style} />;
});
