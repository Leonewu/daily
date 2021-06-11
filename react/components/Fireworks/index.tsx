import React, { useEffect, useRef } from 'react';
import Fireworks from './Fireworks';

type Props = {
  run?: boolean;
  /* 宽度默认为 window.innerWidth，不支持异步数据 */
  width?: number;
  /* 高度默认为 window.innerHeight，不支持异步数据 */
  height?: number;
  style?: React.CSSProperties;
};

export default React.memo<Props>((props) => {
  const fireworks = useRef<Fireworks>();
  const { run, width = window.innerWidth, height = window.innerHeight, style } = props;

  useEffect(() => {
    setTimeout(() => {
      // 需要等待 dom 节点渲染之后再初始化，推一个宏任务
      if (!fireworks.current) {
        const f = new Fireworks({
          id: 'fireworks',
        });
        fireworks.current = f;
      }
      if (run) {
        fireworks.current?.run();
      } else {
        fireworks.current?.cancel();
      }
    }, 0);
    return () => {
      fireworks.current?.cancel();
    };
  }, [run]);

  return <canvas id="fireworks" width={width} height={height} style={style} />;
});
