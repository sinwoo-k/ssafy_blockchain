import React, { useEffect, useState } from 'react'
import {
  Grid,
  InfiniteLoader,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized'
import WebtoonCard from './WebtoonCard'

// 디폴트 이미지
import fantasyCover from '../../assets/defaultCover/fantasy.webp'
import actionCover from '../../assets/defaultCover/action.webp'
import romanceCover from '../../assets/defaultCover/romance.webp'
import dramaCover from '../../assets/defaultCover/drama.webp'
import historyCover from '../../assets/defaultCover/history.webp'

const dummy = [
  { id: 0, title: '판타지', genre: 'fantasy', cover: fantasyCover },
  { id: 1, title: '액션', genre: 'action', cover: actionCover },
  { id: 2, title: '로맨스', genre: 'romance', cover: romanceCover },
  { id: 3, title: '드라마', genre: 'drama', cover: dramaCover },
  { id: 4, title: '무협/사극', genre: 'history', cover: historyCover },
]

const generateDummyWebtoons = (count, startId = 0) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    title: `웹툰 ${startId + i + 1}`,
    genre: dummy[i % 5].genre,
    cover: dummy[i % 5].cover,
  }))
}

const WebtoonList = () => {
  const [webtoons, setWebtoons] = useState([]) // 웹툰 리스트
  const [hasMore, setHasMore] = useState(true) // 추가 데이터 여부
  const [page, setPage] = useState(1) // 현재 페이지 번호

  const columnCount = 4 // 한 줄에 표시할 웹툰 개수
  const rowHeight = 380 // 각 웹툰 카드의 높이

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
      <div key={key} style={{ ...style }}>
        <WebtoonCard webtoon={webtoons[webtoonIndex]} />
      </div>
    )
  }

  return (
    <div className='flex h-full w-full justify-center'>
      <div className='flex h-full w-[1160px] flex-col'>
        <h2 className='mb-5 text-2xl'>🔥 최신 업데이트 웹툰</h2>
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

export default WebtoonList
