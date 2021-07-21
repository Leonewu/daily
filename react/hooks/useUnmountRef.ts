import { useRef, useEffect } from 'react'

export const useUnmountRef = () => {
  const isUnmount = useRef(true)
  useEffect(() => {
    isUnmount.current = false
    return () => {
      isUnmount.current = true
    }
  }, [])
  return isUnmount
}
