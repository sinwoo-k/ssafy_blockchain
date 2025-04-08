import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IconButton from '../common/IconButton'
import { nftService } from '../../api/nftApi'
import MintNFT from '../common/MintNFT'

// 아이콘
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSelector } from 'react-redux'
import { deleteFanart } from '../../api/fanartAPI'
import { getWebtoon } from '../../api/webtoonAPI'

const MyFanartCard = ({ fanart, patchData }) => {
  const [showModal, setShowModal] = useState(false)
  const [webtoonName, setWebtoonName] = useState('')
  const userData = useSelector((state) => state.user.userData)

  const getData = async () => {
    try {
      const result = await getWebtoon(fanart.webtoonId)
      setWebtoonName(result.webtoonName)
    } catch (error) {
      console.error('웹툰 조회 실패: ', error)
    }
  }

  const deleteData = async () => {
    if (!confirm('삭제하시겠습니까?')) {
      return
    }
    try {
      const result = await deleteFanart(fanart.fanartId, userData.id)
      patchData()
    } catch (error) {
      console.error('팬아트 삭제 실패: ', error)
      alert('팬아트 정보 삭제에 실패하였습니다. 다시 시도해주세요.')
    }
  }
  useEffect(() => {
    getData()
  }, [fanart])
  return (
    <div className='flex justify-center'>
      <div className='flex flex-col gap-3'>
        <div className='relative'>
          <Link to={`/fanart/${fanart.fanartId}`} className='overflow-hidden'>
            <img
              src={fanart.fanartImage}
              alt={`${fanart.fanartName} 이미지`}
              className='h-[200px] w-[180px] rounded-lg object-cover
              transition-transform duration-150 ease-in-out hover:scale-105'
            />
          </Link>
        </div>
        <div className='flex justify-between gap-2'>
          <MintNFT item={fanart} type='fanart' afterMint={patchData} />
          <div className='flex items-center gap-1'>
            <Link
              to={`/myworks/fanart/${fanart.fanartId}/update`}
              className='text-blue-500'
            >
              <IconButton Icon={EditIcon} tooltip={'수정하기'} />
            </Link>
            <div className='text-red-500' onClick={deleteData}>
              <IconButton Icon={DeleteIcon} tooltip={'삭제하기'} />
            </div>
          </div>
        </div>
        <div>
          <Link to={`/fanart/${fanart.fanartId}`}>
            <p className='w-[180px] truncate text-lg hover:underline'>
              {fanart.fanartName}
            </p>
          </Link>
          <Link to={`/webtoon/${fanart.webtoonId}`}>
            <p className='text-text/75 w-[180px] truncate hover:underline'>
              {webtoonName}
            </p>
          </Link>
        </div>
      </div>
      {showModal && (
        <MintNFT item={fanart} type={'fanart'} setShowModal={setShowModal} />
      )}
    </div>
  )
}

export default MyFanartCard
