import { FC, ReactNode, MouseEvent } from 'react';
import styles from './index.module.scss'
import classNames from 'classnames';

// 定义 Props 类型
interface MaskProps {
  children: ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
  maskClosable?: boolean;
  className?: string;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
}

// 遮罩组件
const Mask: FC<MaskProps> = ({
  children,
  onClose,
  className,
  contentClassName,
  maskClosable = true,
  style = {},
  contentStyle = {}
}) => {
  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...style,
  };

  const contentBaseStyle: React.CSSProperties = {
    pointerEvents: 'auto',
    ...contentStyle,
  };

  const handleBackgroundClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && maskClosable) {
      onClose?.();
    }
  };

  return (
    <div className={classNames(styles.maskContainer, className)} style={baseStyle} onClick={handleBackgroundClick}>
      <div data-aos="fade-up" className={classNames(styles.maskContent, contentClassName)} style={contentBaseStyle}>{children}</div>
    </div>
  );
};


export default Mask;