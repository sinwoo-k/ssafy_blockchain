import React, { useEffect, useState } from 'react'
import {
  Grid,
  InfiniteLoader,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized'
import FanartWebtoonCard from './FanartWebtoonCard'
import { getAdaptableWebtoonList } from '../../api/webtoonAPI'

const FanartWebtoonList = () => {
  const [webtoons, setWebtoons] = useState([]) // 웹툰 리스트
  const [hasMore, setHasMore] = useState(true) // 추가 데이터 여부
  const [page, setPage] = useState(1) // 현재 페이지 번호

  const [isLoading, setIsLoading] = useState(false)

  const columnCount = 4 // 한 줄에 표시할 웹툰 개수
  const rowHeight = 330 // 각 웹툰 카드의 높이

  const fetchWebtoons = async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const data = await getAdaptableWebtoonList(page)
      console.log(data)
      setWebtoons((prev) => [...prev, ...data])

      if (data.length < 50) {
        setHasMore(false)
      } else {
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error(`웹툰 목록 불러오기 실패: `, error)
    } finally {
      setIsLoading(false)
    }
  }

  const isRowLoaded = ({ index }) => {
    return index * columnCount < webtoons.length
  }

  const loadMoreRows = isLoading || !hasMore ? () => {} : () => fetchWebtoons()

  const cellRenderer = ({ columnIndex, rowIndex, key, style }) => {
    const webtoonIndex = rowIndex * columnCount + columnIndex
    if (webtoonIndex >= webtoons.length) return <div key={key} style={style} />

    return (
      <div key={key} style={{ ...style }}>
        <FanartWebtoonCard webtoon={webtoons[webtoonIndex]} />
      </div>
    )
  }
  useEffect(() => {
    // mount
    fetchWebtoons()
    // unmont
    return () => {}
  }, [])

  return (
    <div className='flex h-full w-full justify-center'>
      <div className='flex h-full w-[1000px] flex-col'>
        <h2 className='mb-5 text-xl'>
          🌟 최신 웹툰 업데이트! 팬아트도 함께 감상해요!
        </h2>
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={
            hasMore
              ? Math.ceil(webtoons.length / columnCount) + 1
              : Math.ceil(webtoons.length / columnCount)
          }
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ width }) => (
                <WindowScroller scrollElement={window}>
                  {({ height, isScrolling, scrollTop }) => {
                    const headerOffset = 300
                    return (
                      <Grid
                        ref={registerChild}
                        width={width}
                        height={height}
                        isScrolling={isScrolling}
                        scrollTop={Math.max(scrollTop - headerOffset, 0)}
                        rowCount={Math.ceil(webtoons.length / columnCount)}
                        columnCount={columnCount}
                        columnWidth={Math.floor(width / columnCount)}
                        rowHeight={rowHeight}
                        cellRenderer={cellRenderer}
                        autoHeight
                        onSectionRendered={({ rowStartIndex, rowStopIndex }) =>
                          onRowsRendered({
                            startIndex: rowStartIndex * columnCount,
                            stopIndex: (rowStopIndex + 1) * columnCount - 1,
                          })
                        }
                      />
                    )
                  }}
                </WindowScroller>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    </div>
  )
}

export default FanartWebtoonList
