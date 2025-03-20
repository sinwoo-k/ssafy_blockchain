// CollectionDetailInfo.jsx
import React from 'react'
import { Link } from 'react-router-dom'
// 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import StarIcon from '@mui/icons-material/Star'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// 웹툰 디테일과 비슷한 디자인을 가진 컬렉션 디테일 컴포넌트
// 단, 버튼들은 제외함
const CollectionDetailInfo = ({ collection, tags }) => {
  if (!collection) return null;

  return (
    <div className={`relative mb-10 flex w-full justify-center py-10`}>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url(${collection.image || collection.cover})`,
          filter: 'blur(35px) brightness(0.5)',
        }}
      ></div>
      <div className='relative w-[1000px]'>
        {/* 뒤로가기 버튼 */}
        <div className='mb-4'>
          <Link to='/store' className='flex items-center text-gray-400 hover:text-white'>
            <ArrowBackIcon />
            <span className='ml-1'>스토어로 돌아가기</span>
          </Link>
        </div>
      
        <div className='mt-6 flex gap-10'>
          {/* 이미지 및 아이콘 정보 */}
          <div>
            {/* 대표 이미지 */}
            <div className='mb-3'>
              <img
                src={collection.image || collection.cover}
                alt={`${collection.title} 대표 이미지`}
                className='h-[300px] w-[250px] rounded-xl'
              />
            </div>
            {/* 정보 관련 아이콘 */}
            <div className='flex items-center justify-evenly'>
              <div className='flex items-center gap-1'>
                <FavoriteIcon sx={{ fontSize: 25, color: '#ff1919' }} />
                <span className='inline-block w-[45px] translate-y-[1px] transform'>
                  {collection.likes || 109}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <VisibilityIcon sx={{ fontSize: 30, color: '#3cc3ec' }} />
                <span className='inline-block w-[45px] translate-y-[1px] transform'>
                  {collection.views || '109K'}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <StarIcon sx={{ fontSize: 25, color: '#ffff19' }} />
                <span className='inline-block w-[45px] translate-y-[1px] transform'>
                  {collection.rating || 4.56}
                </span>
              </div>
            </div>
          </div>
          
          {/* 컬렉션 정보 */}
          <div className='flex flex-col justify-between'>
            <div className='flex flex-col gap-5'>
              <p className='text-2xl'>{collection.title}</p>
              <p className='text-xl text-[#b9b9b9]'>
                {collection.category === '웹툰' ? '작가: ' : '제작: '}
                {collection.author || '체인툰 스튜디오'}
              </p>
              <p className='text-xl text-[#b9b9b9]'>장르: {collection.genre}</p>
              <div className='text-xl'>
                {collection.description || `"${collection.title}"은(는) ${collection.genre} 장르의 작품으로, 다양한 회차와 관련 상품을 제공합니다.`}
              </div>
              
              {/* 가격 정보 */}
              <div className='text-xl font-bold'>
                가격: {collection.price} ETH
              </div>
              
              {/* 판매 상태 */}
              {collection.status === 'notsell' && (
                <div className='mt-2 rounded bg-red-500 p-2 text-center text-white'>
                  현재 판매가 종료된 상품입니다.
                </div>
              )}
            </div>
            
            {/* 태그 */}
            {tags && tags.length > 0 && (
              <div className='flex flex-wrap gap-3'>
                {tags.map((tag) => (
                  <div key={tag.id} className='bg-chaintoon/75 rounded px-2 py-1'>
                    #{tag.tagName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionDetailInfo