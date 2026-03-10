import { RefObject, useEffect } from 'react';

export const useInfiniteLoad = ({
  targetRef,
  enabled,
  loading,
  onLoadMore
}: {
  targetRef: RefObject<Element>;
  enabled: boolean;
  loading: boolean;
  onLoadMore: () => void;
}) => {
  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) onLoadMore();
      },
      { rootMargin: '1200px 0px 1200px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, enabled, loading, onLoadMore]);
};
