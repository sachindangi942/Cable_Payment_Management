import React, { useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useMeasure } from 'react-use';

const TextMotion = ({ text }) => {
  const [ref, { width }] = useMeasure();
  const containerRef = useRef(null);

  const props = useSpring({
    from: { transform: `translateX(${containerRef.current?.offsetWidth || 0}px)` },
    to: { transform: `translateX(-${width}px)` },
    config: { duration: 10000 },
    loop: true,
    reset: true,
  });

  return (
    <div
      ref={containerRef}
      className="d-flex justify-content-center align-items-center overflow-hidden  py-3 w-50 mx-auto"
    >
      <animated.div
        ref={ref}
        className="d-inline-block text-success   fs-4 fw-bolder"
        style={props}
      >
        {text}
      </animated.div>
    </div>
  );
};

export default TextMotion;
