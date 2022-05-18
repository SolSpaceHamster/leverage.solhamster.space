import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { formatUsdValue, perpContractPrecision, usdFormatter } from '../utils'
import { Table, Td, Th, TrBody, TrHead } from './TableElements'
import { useViewport } from '../hooks/useViewport'
import { breakpoints } from './TradePageGrid'
import { useTranslation } from 'next-i18next'
import useMangoStore from '../stores/useMangoStore'
import { FavoriteMarketButton } from './TradeNavMenu'
import { useSortableData } from '../hooks/useSortableData'
import { LinkButton } from './Button'
import { ArrowSmDownIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { AreaChart, Area, XAxis, YAxis } from 'recharts'

const MarketsTable = ({ isPerpMarket }) => {
  const { t } = useTranslation('common')
  const { width } = useViewport()
  const isMobile = width ? width < breakpoints.md : false
  const marketsInfo = useMangoStore((s) => s.marketsInfo)
  const actions = useMangoStore((s) => s.actions)
  const coingeckoPrices = useMangoStore((s) => s.coingeckoPrices)
  const router = useRouter()

  useEffect(() => {
    if (coingeckoPrices.length === 0) {
      actions.fetchCoingeckoPrices()
    }
  }, [coingeckoPrices])

  const perpMarketsInfo = useMemo(
    () =>
      marketsInfo
        .filter((mkt) => mkt?.name.includes('PERP'))
        .sort((a, b) => b.volumeUsd24h - a.volumeUsd24h),
    [marketsInfo]
  )

  const spotMarketsInfo = useMemo(
    () =>
      marketsInfo
        .filter((mkt) => mkt?.name.includes('USDC'))
        .sort((a, b) => b.volumeUsd24h - a.volumeUsd24h),
    [marketsInfo]
  )

  const { items, requestSort, sortConfig } = useSortableData(
    isPerpMarket ? perpMarketsInfo : spotMarketsInfo
  )

  return items.length > 0 ? (
    !isMobile ? (
      <Table>
        <thead>
          <TrHead>
            <Th>
              <LinkButton
                className="flex items-center font-normal no-underline"
                onClick={() => requestSort('name')}
              >
                <span className="text-left font-normal text-th-fgd-3">
                  {t('market')}
                </span>
                <ArrowSmDownIcon
                  className={`default-transition ml-1 h-4 w-4 flex-shrink-0 ${
                    sortConfig?.key === 'name'
                      ? sortConfig.direction === 'ascending'
                        ? 'rotate-180 transform'
                        : 'rotate-360 transform'
                      : null
                  }`}
                />
              </LinkButton>
            </Th>
            <Th>
              <LinkButton
                className="flex items-center font-normal no-underline"
                onClick={() => requestSort('last')}
              >
                <span className="text-left font-normal text-th-fgd-3">
                  {t('price')}
                </span>
                <ArrowSmDownIcon
                  className={`default-transition ml-1 h-4 w-4 flex-shrink-0 ${
                    sortConfig?.key === 'last'
                      ? sortConfig.direction === 'ascending'
                        ? 'rotate-180 transform'
                        : 'rotate-360 transform'
                      : null
                  }`}
                />
              </LinkButton>
            </Th>
            <Th>
              <LinkButton
                className="flex items-center font-normal no-underline"
                onClick={() => requestSort('change24h')}
              >
                <span className="text-left font-normal text-th-fgd-3">
                  {t('rolling-change')}
                </span>
                <ArrowSmDownIcon
                  className={`default-transition ml-1 h-4 w-4 flex-shrink-0 ${
                    sortConfig?.key === 'change24h'
                      ? sortConfig.direction === 'ascending'
                        ? 'rotate-180 transform'
                        : 'rotate-360 transform'
                      : null
                  }`}
                />
              </LinkButton>
            </Th>
            <Th>
              <LinkButton
                className="flex items-center font-normal no-underline"
                onClick={() => requestSort('volumeUsd24h')}
              >
                <span className="text-left font-normal text-th-fgd-3">
                  {t('daily-volume')}
                </span>
                <ArrowSmDownIcon
                  className={`default-transition ml-1 h-4 w-4 flex-shrink-0 ${
                    sortConfig?.key === 'volumeUsd24h'
                      ? sortConfig.direction === 'ascending'
                        ? 'rotate-180 transform'
                        : 'rotate-360 transform'
                      : null
                  }`}
                />
              </LinkButton>
            </Th>
            {isPerpMarket ? (
              <>
                <Th>
                  <LinkButton
                    className="flex items-center font-normal no-underline"
                    onClick={() => requestSort('funding1h')}
                  >
                    <span className="text-left font-normal text-th-fgd-3">
                      {t('average-funding')}
                    </span>
                    <ArrowSmDownIcon
                      className={`default-transition ml-1 h-4 w-4 flex-shrink-0 ${
                        sortConfig?.key === 'funding1h'
                          ? sortConfig.direction === 'ascending'
                            ? 'rotate-180 transform'
                            : 'rotate-360 transform'
                          : null
                      }`}
                    />
                  </LinkButton>
                </Th>
                <Th>
                  <LinkButton
                    className="flex items-center no-underline"
                    onClick={() => requestSort('openInterestUsd')}
                  >
                    <span className="text-left font-normal text-th-fgd-3">
                      {t('open-interest')}
                    </span>
                    <ArrowSmDownIcon
                      className={`default-transition ml-1 h-4 w-4 flex-shrink-0 ${
                        sortConfig?.key === 'openInterestUsd'
                          ? sortConfig.direction === 'ascending'
                            ? 'rotate-180 transform'
                            : 'rotate-360 transform'
                          : null
                      }`}
                    />
                  </LinkButton>
                </Th>
              </>
            ) : null}
            <Th>
              <span className="flex justify-end">{t('favorite')}</span>
            </Th>
          </TrHead>
        </thead>
        <tbody>
          {items.map((market) => {
            const {
              baseSymbol,
              change24h,
              funding1h,
              last,
              name,
              openInterest,
              openInterestUsd,
              volumeUsd24h,
            } = market
            const fundingApr = funding1h
              ? (funding1h * 24 * 365).toFixed(2)
              : '-'
            const coingeckoData = coingeckoPrices.find(
              (asset) => asset.symbol === baseSymbol
            )
            const chartData = coingeckoData ? coingeckoData.prices : undefined
            return (
              <TrBody key={name} className="hover:bg-th-bkg-3">
                <Td>
                  <Link href={`/?name=${name}`} shallow={true}>
                    <a className="hover:cursor-pointer">
                      <div className="flex h-full items-center text-th-fgd-2 hover:text-th-primary">
                        <img
                          alt=""
                          width="20"
                          height="20"
                          src={`/assets/icons/${baseSymbol.toLowerCase()}.svg`}
                          className={`mr-2.5`}
                        />
                        <span className="default-transition">{name}</span>
                      </div>
                    </a>
                  </Link>
                </Td>
                <Td className="flex items-center">
                  <div className="w-20">
                    {last ? (
                      formatUsdValue(last)
                    ) : (
                      <span className="text-th-fgd-4">{t('unavailable')}</span>
                    )}
                  </div>
                  <div className="pl-6">
                    {chartData !== undefined ? (
                      <AreaChart width={104} height={40} data={chartData}>
                        <Area
                          isAnimationActive={false}
                          type="monotone"
                          dataKey="1"
                          stroke="#FF9C24"
                          fill="#FF9C24"
                          fillOpacity={0.1}
                        />
                        <XAxis dataKey="0" hide />
                        <YAxis
                          domain={['dataMin', 'dataMax']}
                          dataKey="1"
                          hide
                        />
                      </AreaChart>
                    ) : (
                      t('unavailable')
                    )}
                  </div>
                </Td>
                <Td>
                  <span
                    className={change24h >= 0 ? 'text-th-green' : 'text-th-red'}
                  >
                    {change24h || change24h === 0 ? (
                      `${(change24h * 100).toFixed(2)}%`
                    ) : (
                      <span className="text-th-fgd-4">{t('unavailable')}</span>
                    )}
                  </span>
                </Td>
                <Td>
                  {volumeUsd24h ? (
                    usdFormatter(volumeUsd24h, 0)
                  ) : (
                    <span className="text-th-fgd-4">{t('unavailable')}</span>
                  )}
                </Td>
                {isPerpMarket ? (
                  <>
                    <Td>
                      {funding1h ? (
                        <>
                          <span>{`${funding1h.toFixed(4)}%`}</span>{' '}
                          <span className="text-xs text-th-fgd-3">{`(${fundingApr}% APR)`}</span>
                        </>
                      ) : (
                        <span className="text-th-fgd-4">
                          {t('unavailable')}
                        </span>
                      )}
                    </Td>
                    <Td>
                      {openInterestUsd ? (
                        <>
                          <span>{usdFormatter(openInterestUsd, 0)}</span>{' '}
                          {openInterest ? (
                            <div className="text-xs text-th-fgd-4">
                              {openInterest.toLocaleString(undefined, {
                                maximumFractionDigits:
                                  perpContractPrecision[baseSymbol],
                              })}{' '}
                              {baseSymbol}
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-th-fgd-4">
                          {t('unavailable')}
                        </span>
                      )}
                    </Td>
                  </>
                ) : null}
                <Td>
                  <div className="flex justify-end">
                    <FavoriteMarketButton market={market} />
                  </div>
                </Td>
              </TrBody>
            )
          })}
        </tbody>
      </Table>
    ) : (
      items.map((market) => {
        const { baseSymbol, change24h, funding1h, last, name } = market
        const fundingApr = funding1h ? (funding1h * 24 * 365).toFixed(2) : '-'
        const coingeckoData = coingeckoPrices.find(
          (asset) => asset.symbol === baseSymbol
        )
        const chartData = coingeckoData ? coingeckoData.prices : undefined
        return (
          <Link href={`/?name=${name}`} shallow={true} key={name}>
            <a
              className="mb-2.5 block w-full rounded-lg bg-th-bkg-3 p-4 pb-2.5"
              onClick={() =>
                router.push(`/?name=${name}`, undefined, {
                  shallow: true,
                })
              }
            >
              <div className="mb-1 flex justify-between">
                <div>
                  <div className="mb-2 flex items-center font-bold text-th-fgd-2">
                    <img
                      alt=""
                      width="20"
                      height="20"
                      src={`/assets/icons/${baseSymbol.toLowerCase()}.svg`}
                      className="mr-2"
                    />

                    {name}
                    <div
                      className={`ml-3 ${
                        change24h >= 0 ? 'text-th-green' : 'text-th-red'
                      }`}
                    >
                      {change24h || change24h === 0 ? (
                        `${(change24h * 100).toFixed(2)}%`
                      ) : (
                        <span className="text-th-fgd-4">
                          {t('unavailable')}
                        </span>
                      )}
                    </div>
                  </div>
                  {chartData !== undefined ? (
                    <AreaChart width={128} height={48} data={chartData}>
                      <Area
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="1"
                        stroke="#FF9C24"
                        fill="#FF9C24"
                        fillOpacity={0.1}
                      />
                      <XAxis dataKey="0" hide />
                      <YAxis domain={['dataMin', 'dataMax']} dataKey="1" hide />
                    </AreaChart>
                  ) : (
                    t('unavailable')
                  )}
                </div>
                <div className="text-right">
                  <p className="mb-0 mb-3 text-xl font-bold leading-none text-th-fgd-2">
                    {last ? (
                      formatUsdValue(last)
                    ) : (
                      <span className="text-th-fgd-4">{t('unavailable')}</span>
                    )}
                  </p>
                  {isPerpMarket ? (
                    funding1h ? (
                      <div className="mt-1 justify-end text-th-fgd-3">
                        <div className="text-[10px] leading-tight text-th-fgd-4">
                          {t('average-funding')}
                        </div>
                        <span className="text-xs">{`${fundingApr}% APR`}</span>
                      </div>
                    ) : (
                      <span className="text-th-fgd-4">{t('unavailable')}</span>
                    )
                  ) : null}
                </div>
              </div>
            </a>
          </Link>
        )
      })
    )
  ) : null
}

export default MarketsTable as any
