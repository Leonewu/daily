import { useState, useCallback } from 'react'

/**
 * @description 只获取一次数据的方法
 * @example
 * const [loading, getListOnce] = useFetchOnce(getList);
 * getListOnce();
 * getListOnce();
 */
export function useFetchOnce<T, P>(fn: (params: P) => Promise<T>) {
  const [promise, setPromise] = useState<Promise<T>>()
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<T>()
  const fetchData = useCallback(async (params: P) => {
    if (res) return res
    if (loading && promise) return promise
    const p = fn(params)
      .then((r: T) => {
        setRes(r)
        setLoading(false)
        setPromise(undefined)
        return r
      })
      .catch((err) => {
        setLoading(false)
        setPromise(undefined)
        throw err
      })
    setPromise(p)
    return p
  }, [])
  return [loading, fetchData]
}
