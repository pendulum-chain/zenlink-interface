import { useMemo } from 'react'
import { useQuery } from 'wagmi'

const QUERY_ENDPOINT = 'https://zenlink-stats-two.vercel.app'

interface ZLKStats {
  chainId: number
  holders: number
  totalBurn: string
  totalDistribute: string
  totalTvlUSD: string
  totalVolumeUSD: string
}

export const useZLKStats = () => {
  const queryKey = useMemo(() => [`${QUERY_ENDPOINT}/api/v0`], [])
  const {
    data: zlkStatusData,
    isError,
    isLoading,
  } = useQuery(
    queryKey,
    () => fetch(`${QUERY_ENDPOINT}/api/v0`).then(response => response.json()),
    { staleTime: 20000, enabled: true },
  )

  return useMemo(() => ({
    isError,
    isLoading,
    data:
      zlkStatusData && !isError && !isLoading
        ? zlkStatusData.data.map((data: any) => ({ chainId: data.chainId, ...data.zenlinkInfo })) as ZLKStats[]
        : undefined,
  }), [isError, isLoading, zlkStatusData])
}
