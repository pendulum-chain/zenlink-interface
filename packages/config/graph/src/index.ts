import { ParachainId } from '@zenlink-interface/chain'

export const ZENLINK_ENABLED_NETWORKS = [
  ParachainId.MOONBEAM,
  ParachainId.MOONRIVER,
  ParachainId.ASTAR,
  ParachainId.AMPLITUDE,
  ParachainId.BIFROST_KUSAMA,
  ParachainId.BIFROST_POLKADOT,
] as const

export const SQUID_HOST_ENDPOINT = 'https://squid.subsquid.io'

export const SQUID_HOST: Record<number | string, string> = {
  [ParachainId.ASTAR]: `${SQUID_HOST_ENDPOINT}/Zenlink-Astar-Squid/graphql`,
  [ParachainId.MOONRIVER]: `${SQUID_HOST_ENDPOINT}/Zenlink-Moonriver-Squid/graphql`,
  [ParachainId.MOONBEAM]: `${SQUID_HOST_ENDPOINT}/Zenlink-Moonbeam-Squid/graphql`,
  [ParachainId.AMPLITUDE]: `${SQUID_HOST_ENDPOINT}/foucoco-squid/graphql`,
  [ParachainId.BIFROST_KUSAMA]: `${SQUID_HOST_ENDPOINT}/zenlink-bifrost-kusama-squid/graphql`,
  [ParachainId.BIFROST_POLKADOT]: `${SQUID_HOST_ENDPOINT}/zenlink-bifrost-polkadot-squid/graphql`,
  [ParachainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',
}

export const ARCHIVE_HOST: Record<number | string, string> = {
  [ParachainId.AMPLITUDE]: 'https://foucoco.explorer.subsquid.io/graphql',
  [ParachainId.BIFROST_KUSAMA]: 'https://bifrost.explorer.subsquid.io/graphql',
  [ParachainId.BIFROST_POLKADOT]: 'https://bifrost-polkadot.explorer.subsquid.io/graphql',
}
