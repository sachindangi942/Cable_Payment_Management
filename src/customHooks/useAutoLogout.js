import { useEffect, useRef } from 'react';

const useAutoLogout = (logoutFn, timeout = 900000) => {
  const timer = useRef();

  const resetTimer = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      logoutFn();
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click'];

    const eventHandler = () => resetTimer();

    events.forEach((event) =>
      window.addEventListener(event, eventHandler)
    );

    resetTimer(); // initialize on mount

    return () => {
      clearTimeout(timer.current);
      events.forEach((event) =>
        window.removeEventListener(event, eventHandler)
      );
    };
  }, [logoutFn, timeout]);
};

export default useAutoLogout;
