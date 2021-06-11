import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import styles from './index.less';
import Fireworks from '../../components/Fireworks';
import Ribbons from '../../components/Ribbons';
import closeIcon from './close.svg';
import bg from './celebration.png';

/**
 * @description 庆祝弹窗
 */
export default React.memo(
  forwardRef<{ show: (n: number) => void; hide: () => void }, Record<string, unknown>>(
    (props, ref) => {
      const [visible, setVisible] = useState(false);
      const [num, setNum] = useState(0);
      const [node] = useState(document.createElement('div'));
      const style = useRef<React.CSSProperties>({});
      useImperativeHandle(ref, () => ({
        show(n) {
          setVisible(true);
          setNum(n ?? 0);
        },
        hide() {
          setVisible(false);
        },
      }));

      const fontSize = useMemo(() => {
        if (num.toString().length <= 5) {
          return '120px';
        }
        if (num.toString().length <= 6) {
          return '100px';
        }
        return '90px';
      }, [num]);

      useEffect(() => {
        style.current = {
          overflow: document.body.style.overflow,
          width: document.body.style.width,
        };
        // 预加载
        const image = new Image();
        image.src = bg;
      }, []);

      useEffect(() => {
        const { overflow, width } = style.current;
        if (visible) {
          document.body.style.overflow = 'hidden';
          document.body.style.width = 'calc(100% - 17px)';
        } else {
          document.body.style.overflow = overflow as string;
          document.body.style.width = width as string;
        }
        if (visible && !document.body.contains(node)) {
          document.body.appendChild(node);
        }
        // return () => {
        //   if (document.body.contains(node)) {
        //     ReactDOM.unmountComponentAtNode(node);
        //     document.body.removeChild(node);
        //   }
        //   document.body.style.overflow = overflow;
        //   document.body.style.width = width;
        // }
      }, [visible]);

      const content = (
        <div onMouseMove={(e) => e.stopPropagation()}>
          {visible && (
            <>
              <div className={styles.mask}>
                <Ribbons
                  run={true}
                  width={window.screen.width}
                  height={window.screen.height}
                  style={{ display: 'block', position: 'absolute', inset: 0 }}
                />
                <Fireworks
                  run={true}
                  width={window.screen.width}
                  height={window.screen.height}
                  style={{
                    display: 'block',
                    position: 'absolute',
                    inset: 0,
                  }}
                />
              </div>
              <div className={styles.content}>
                <div className={styles.main} style={{ fontSize }}>
                  <div className={styles.num}>{num.toLocaleString()}</div>
                </div>
                <img src={closeIcon} className={styles.close} onClick={() => setVisible(false)} />
              </div>
            </>
          )}
        </div>
      );

      return ReactDOM.createPortal(content, node);
    },
  ),
);
