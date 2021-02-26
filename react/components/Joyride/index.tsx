import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import ReactJoyride, {
  Props,
  Step,
  Styles,
  CallBackProps,
  ACTIONS,
  EVENTS,
  LIFECYCLE,
  STATUS,
} from 'react-joyride';
import { useThrottleFn } from 'ahooks';
import finger from './guide_finger.svg';
import styles from './Joyride.less';

/**
 * react-joyride
 * @documention https://docs.react-joyride.com/
 * @compare https://www.npmtrends.com/driver.js-vs-intro.js-vs-react-joyride
 * @description 虽然不太好用，但比 driver.js, intro.js 强，除了样式不够灵活，勉强能满足需求
 * @enhancement 基于 react-joyride 封装了手指
 * */

interface PointerProps {
  position?: string;
  style?: React.CSSProperties;
  zIndex?: string | number;
  target: HTMLElement | string;
}

const PointerPortal: React.FC<PointerProps> = React.memo((props) => {
  const id = 'react-joyride-pointer';
  const [node] = useState(document.createElement('DIV'));
  const { style = {}, zIndex = 100, target, position } = props;
  const [pointerStyle, setPointerStyle] = useState<React.CSSProperties>();

  const onResize = useCallback(() => {
    const defaultStyle: React.CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 100,
      transition: 'all 0.5s ease'
    };
    let element;
    if (typeof target === 'string') {
      element = document.querySelector(target);
    } else if (target instanceof HTMLElement) {
      element = target;
    }
    const rect = element?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    // 默认放中间
    let left = rect.width / 2;
    let top = rect.height / 2;
    if (position && position.split(' ').length) {
      let arr = position.split(' ');
      if (arr.length === 1) {
        arr = arr.concat(arr);
      }
      if (arr.length > 2) {
        arr = arr.slice(0, 2);
      }
      const [a, b] = arr;
      if (/\d/.test(a)) {
        left = parseInt(a, 10);
      }
      if (/\d/.test(b)) {
        top = parseInt(b, 10);
      }
    }
    defaultStyle.left = `${rect.left + left}px`;
    defaultStyle.top = `${rect.top + top}px`;
    setPointerStyle({
      ...defaultStyle,
      ...style,
    });
  }, [target]);

  const { run: onResizeThrottle } = useThrottleFn(
    () => {
      onResize();
    },
    {
      wait: 500,
      leading: false,
    },
  );

  useEffect(() => {
    node.id = id;
    node.style.zIndex = zIndex.toString();
    document.body.appendChild(node);
    window.addEventListener('resize', onResizeThrottle);
    return () => {
      // 卸载
      ReactDOM.unmountComponentAtNode(node);
      document.body.removeChild(node);
      window.removeEventListener('resize', onResizeThrottle);
    };
  }, []);

  useEffect(() => {
    onResize();
  }, [target]);

  if (!target) {
    return null;
  }

  const content = (
    <div style={pointerStyle}>
      <div className={styles.outer} />
      <div className={styles.inner} />
      <img alt="" src={finger} className={styles.finger} />
    </div>
  );

  return ReactDOM.createPortal(content, node);
});

// 改写 props，增加对 spotlignt 中鼠标指示的配置支持
export type JoyrideProps = Omit<Props, 'steps'> & {
  steps: JoyrideStep[];
};

export type JoyrideStyles = Styles & {
  pointer?: React.CSSProperties;
};

export type JoyrideStep = Omit<Step, 'styles'> & {
  /* 手指指向的元素 */
  pointerTarget?: string | HTMLElement;
  /* 手指位置，默认在中间，语法为相对于 pointerTarget 的 'left top'，如 pointerPosition: '10px 10px' */
  pointerPosition?: string;
  styles?: JoyrideStyles;
};
const Joyride: React.FC<JoyrideProps> = React.memo((props) => {
  const { stepIndex, steps, callback, ...restProps } = props;
  const [pointerVisible, setPointerVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<JoyrideStep | undefined>(undefined);
  const handleJoyrideCallback = (data: CallBackProps) => {
    callback?.(data);
    const { action, lifecycle, index, status, type } = data;
    if (lifecycle === LIFECYCLE.READY) {
      // ready 的时候就显示指针
      const step = steps[index];
      if (step.pointerTarget) {
        setPointerVisible(true);
        setCurrentStep(step);
      } else {
        setPointerVisible(false);
        setCurrentStep(undefined);
      }
    }
  };

  const defaultProps = {
    // 禁用遮罩按下 esc 关闭
    disableCloseOnEsc: true,
    // 禁用滚动到某个步骤
    disableScrolling: true,
    // 禁用遮罩点击关闭
    disableOverlayClose: true,
    // spotlight 可点击
    spotlightClicks: true,
    // 箭头样式
    floaterProps: {
      styles: {
        arrow: {
          length: 6,
          spread: 8,
        },
      },
    },
  };

  return (
    <>
      <ReactJoyride
        stepIndex={stepIndex}
        steps={steps}
        callback={handleJoyrideCallback}
        {...defaultProps}
        {...restProps}
      />
      {pointerVisible && currentStep?.pointerTarget && (
        <PointerPortal
          target={currentStep!.pointerTarget!}
          style={currentStep?.styles?.pointer}
          position={currentStep?.pointerPosition}
        />
      )}
    </>
  );
});

export default Joyride;
