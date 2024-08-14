import { useEffect, useState } from 'react'
import api from '../api'
import axios from 'axios'
import API_URL from '../url'

export default function usePin({query, pageNumber}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [pins, setPins] = useState([])
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setPins([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: `${API_URL}/api/pin`,
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setPins(prev => [...new Set([...prev, ...res.data.items])])
      setHasMore(res.data.items.length > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [query, pageNumber])

  return { loading, error, pins, hasMore }
}
