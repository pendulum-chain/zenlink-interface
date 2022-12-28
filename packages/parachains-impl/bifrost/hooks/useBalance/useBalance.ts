import type { QueryableStorageEntry } from '@polkadot/api/types'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { isZenlinkAddress } from '@zenlink-interface/format'
import { JSBI } from '@zenlink-interface/math'
import { useApi, useCallMulti, useNativeBalancesAll } from '@zenlink-interface/polkadot'
import type { OrmlAccountData } from '@zenlink-types/bifrost/interfaces'
import { useMemo } from 'react'
import { addressToNodeCurrency, isNativeCurrency } from '../../libs'
import type { NodePrimitivesCurrency } from '../../types'
import type { BalanceMap } from './types'

interface UseBalancesParams {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ParachainId
}

type UseBalances = (params: UseBalancesParams) => {
  data: BalanceMap
  isLoading: boolean
  isError: boolean
}

export const useBalances: UseBalances = ({
  chainId,
  account,
  currencies,
}) => {
  const api = useApi(chainId)
  const nativeBalancesAll = useNativeBalancesAll(chainId, account)

  const validatedTokens = useMemo(
    () =>
      currencies.filter(
        (currency): currency is Token =>
          !!chainId && !!currency && isZenlinkAddress(currency.wrapped.address),
      ),
    [chainId, currencies],
  )

  const balances = useCallMulti<OrmlAccountData[]>({
    chainId,
    calls: validatedTokens
      .map(currency => [api?.query.tokens.accounts, [account, addressToNodeCurrency(currency.wrapped.address)]])
      .filter((call): call is [QueryableStorageEntry<'promise'>, [string, NodePrimitivesCurrency]] => !!call[0]),
  })

  const balanceMap: BalanceMap = useMemo(() => {
    const result: BalanceMap = {}
    if (balances.length !== validatedTokens.length)
      return result
    for (let i = 0; i < validatedTokens.length; i++) {
      const value = balances[i]?.free.toString()
      const amount = value ? JSBI.BigInt(value.toString()) : undefined

      if (!result[validatedTokens[i].address])
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      if (amount)
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], amount)
      else
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      // BNC
      if (isNativeCurrency(validatedTokens[i]))
        result[validatedTokens[i].wrapped.address] = Amount.fromRawAmount(validatedTokens[i], nativeBalancesAll?.freeBalance.toString() || '0')
    }
    return result
  }, [balances, nativeBalancesAll?.freeBalance, validatedTokens])

  return useMemo(() => ({
    data: balanceMap,
    isLoading: !nativeBalancesAll || !balances.length,
    isError: false,
  }), [balanceMap, nativeBalancesAll, balances.length])
}

interface UseBalanceParams {
  account: string | undefined
  currency: Type | undefined
  chainId?: ParachainId
}

type UseBalance = (params: UseBalanceParams) => Pick<ReturnType<typeof useBalances>, 'isError' | 'isLoading'> & {
  data: Amount<Type> | undefined
}

export const useBalance: UseBalance = ({
  chainId,
  account,
  currency,
}) => {
  const currencies = useMemo(() => [currency], [currency])
  const { data, isLoading, isError } = useBalances({ chainId, currencies, account })

  return useMemo(() => {
    const balance = currency
      ? data?.[currency.wrapped.address]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [isError, isLoading, currency, data])
}