import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchNavBar from '../../components/search/SearchNavBar'
import SearchAll from '../../components/search/SearchAll'
import SearchWebtoon from '../../components/search/SearchWebtoon'
import SearchUser from '../../components/search/SearchUser'
import SearchFanart from '../../components/search/SearchFanart'
import SearchGoods from '../../components/search/SearchGoods'
import { getAllSearch } from '../../api/searchAPI'

const webtoonDummy = Array(5)
  .fill()
  .map((_, i) => {
    return {
      webtoonId: i + 1,
      title: `웹툰 ${i + 1}`,
      writer: `작가 ${i + 1}`,
      cover: `https://placehold.co/200x250?text=Webtoon+${i + 1}`,
    }
  })

const userDummy = Array(8)
  .fill()
  .map((_, i) => {
    return {
      userId: i + 1,
      nickName: `닉네임 ${i + 1}`,
      profileImage: null,
    }
  })

const fanartDummy = Array(10)
  .fill()
  .map((_, i) => {
    // 100 ~ 400 사이의 랜덤 크기를 예시로 만듭니다.
    const randomWidth = Math.floor(Math.random() * 101) + 200 // 200~300
    const randomHeight = Math.floor(Math.random() * 201) + 200 // 200~400
    return {
      fanartId: i + 1,
      fanartName: `팬아트 ${i + 1}`,
      fanartImage: `https://placehold.co/${randomWidth}x${randomHeight}?text=Fanart+${i + 1}`,
    }
  })

const goodsDummy = Array(5)
  .fill()
  .map((_, i) => {
    return {
      goodsId: i + 1,
      goodsName: `굿즈 ${i + 1}`,
      goodsImage: `https://placehold.co/300x300?text=Goods+${i + 1}`,
    }
  })

const SearchRoot = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const keywordParam = searchParams.get('keyword')
  const searchTypeParam = searchParams.get('searchType')
  const [keyword, setKeyword] = useState('')
  const [searchType, setSearchType] = useState(
    searchParams.get('searchType') || 'all',
  )

  const [webtoonList, setWebtoonList] = useState([])
  const [userList, setUserList] = useState([])
  const [fanartList, setFanartList] = useState([])
  const [goodsList, setGoodsList] = useState([])

  const getData = async () => {
    try {
      const result = await getAllSearch(keyword)
      console.log(result)
    } catch (error) {
      console.error('통합 검색 조회 실패: ', error)
    }
  }

  useEffect(() => {
    // mount
    setKeyword(keywordParam)

    setWebtoonList(webtoonDummy)
    setUserList(userDummy)
    setFanartList(fanartDummy)
    setGoodsList(goodsDummy)

    setSearchType(searchTypeParam || 'all')
    // unmont
    return () => {}
  }, [keywordParam, searchTypeParam])

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='py-[60px]'>
      <div className='flex flex-col items-center'>
        <div className='my-10 flex justify-center'>
          <h1 className='mb-5 text-2xl'>
            "<span className='text-chaintoon'>{keyword}</span>"에 대한 결과
          </h1>
        </div>
        <SearchNavBar keyword={keyword} />
        {searchType === 'all' && (
          <SearchAll
            keyword={keyword}
            webtoonList={webtoonList}
            userList={userList}
            fanartList={fanartList}
            goodsList={goodsList}
          />
        )}
        {searchType === 'webtoon' && (
          <SearchWebtoon webtoonList={webtoonList} />
        )}
        {searchType === 'user' && <SearchUser userList={userList} />}
        {searchType === 'fanart' && <SearchFanart fanartList={fanartList} />}
        {searchType === 'goods' && <SearchGoods goodsList={goodsList} />}
      </div>
    </div>
  )
}

export default SearchRoot
