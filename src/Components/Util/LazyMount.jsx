import React, { useEffect, useRef, useState } from 'react';

/**
 * LazyMount
 * Uses IntersectionObserver to mount children only when scrolled into view (or after timeout fallback).
 * Props:
 *  - children: React node or render function
 *  - rootMargin: observer margin (default: '250px 0px') to preload slightly before visible
 *  - once: unobserve after first mount (default true)
 *  - timeout: optional ms fallback to mount even if not intersected yet
 */
export default function LazyMount({ children, rootMargin = '250px 0px', once = true, timeout }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;

    let timer;
    if (timeout) {
      timer = setTimeout(() => setVisible(true), timeout);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible(true);
              if (once) observer.disconnect();
            }
          });
        },
        { root: null, rootMargin, threshold: 0.01 }
      );
      if (ref.current) observer.observe(ref.current);
      return () => {
        observer.disconnect();
        if (timer) clearTimeout(timer);
      };
    } else {
      // Fallback: mount immediately
      setVisible(true);
      return () => timer && clearTimeout(timer);
    }
  }, [visible, rootMargin, once, timeout]);

  return <div ref={ref}>{visible ? (typeof children === 'function' ? children() : children) : null}</div>;
}
