import React, { useEffect, useState } from 'react'
import {
  Grid,
  InfiniteLoader,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized'
import FanartWebtoonCard from './FanartWebtoonCard'

const generateDummyWebtoons = (count, startId = 0) => {
  return Array.from({ length: count }, (_, i) => ({
    webtoonId: startId + i,
    userId: 1,
    writer: null,
    webtoonName: `웹툰 ${startId + i + 1}`,
    genre: null,
    episodeCount: null,
    viewCount: null,
    rating: null,
    garoThumbnail: 'http://example.com/garo3.jpg',
    seroThumbnail: `https://placehold.co/200x250?text=Webtoon+${startId + i + 1}`,
  }))
}

const FanartWebtoonList = () => {
  const [webtoons, setWebtoons] = useState([]) // 웹툰 리스트
  const [hasMore, setHasMore] = useState(true) // 추가 데이터 여부
  const [page, setPage] = useState(1) // 현재 페이지 번호

  const columnCount = 4 // 한 줄에 표시할 웹툰 개수
  const rowHeight = 320 // 각 웹툰 카드의 높이

  const fetchWebtoons = async () => {
    if (!hasMore) return

    setTimeout(() => {
      const newWebtoons = generateDummyWebtoons(50, webtoons.length)
      setWebtoons((prev) => [...prev, ...newWebtoons])

      if (webtoons.length + newWebtoons.length >= 500) {
        setHasMore(false)
      } else {
        setPage((prev) => prev + 1)
      }
    }, 500)
  }

  useEffect(() => {
    if (webtoons.length === 0) fetchWebtoons()
  }, [])

  const isRowLoaded = ({ index }) => index * columnCount < webtoons.length

  const loadMoreRows = () => fetchWebtoons()

  const cellRenderer = ({ columnIndex, rowIndex, key, style }) => {
    const webtoonIndex = rowIndex * columnCount + columnIndex
    if (webtoonIndex >= webtoons.length) return <div key={key} style={style} />

    return (
      <div key={key} style={{ ...style }} className='flex justify-center'>
        <FanartWebtoonCard webtoon={webtoons[webtoonIndex]} />
      </div>
    )
  }
  return (
    <div className='flex justify-center'>
      <div className='flex w-[1000px] flex-col'>
        <h1 className='mb-5 text-xl'>웹툰별 팬아트 보기</h1>
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={hasMore ? webtoons.length + columnCount : webtoons.length}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ width }) => (
                <WindowScroller scrollElement={window}>
                  {({ height, isScrolling, scrollTop }) => {
                    const headerOffset = 100
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
