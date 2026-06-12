import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

type PaginatedResult<TItem> = {
  items: TItem[];
  total: number;
};

type FetchPage<TItem> = (
  skip: number,
  limit: number,
) => Promise<PaginatedResult<TItem>>;

type UsePaginationOptions<TItem> = {
  limit?: number;
  fetchPage: FetchPage<TItem>;
  enabled?: boolean;
};

type UsePaginationReturn<TItem> = {
  data: TItem[];
  page: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
};

export function usePagination<TItem>({
  limit = 10,
  fetchPage,
  enabled = true,
}: UsePaginationOptions<TItem>): UsePaginationReturn<TItem> {
  const [data, setData] = useState<TItem[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const hasMore = useMemo(() => data.length < total, [data.length, total]);

  const fetchAndSet = useCallback(
    async (nextPage: number, mode: 'append' | 'replace') => {
      if (!enabled) {
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setError(null);

      if (mode === 'replace') {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const skip = nextPage * limit;
        const result = await fetchPage(skip, limit);

        if (requestIdRef.current !== requestId) {
          return;
        }

        setTotal(result.total);
        setPage(nextPage);
        setData(previous =>
          mode === 'replace'
            ? result.items
            : mergeUniqueItems(previous, result.items),
        );
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to fetch data right now.';
        setError(message);
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [enabled, fetchPage, limit],
  );

  const refresh = useCallback(async () => {
    await fetchAndSet(0, 'replace');
  }, [fetchAndSet]);

  const loadMore = useCallback(async () => {
    if (loading || refreshing || !hasMore) {
      return;
    }

    await fetchAndSet(page + 1, 'append');
  }, [fetchAndSet, hasMore, loading, page, refreshing]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    page,
    loading,
    refreshing,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

function mergeUniqueItems<TItem>(previous: TItem[], next: TItem[]): TItem[] {
  const merged = [...previous];

  next.forEach(item => {
    if (!merged.includes(item)) {
      merged.push(item);
    }
  });

  return merged;
}
