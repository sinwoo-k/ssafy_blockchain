import React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '../common/IconButton'
import MintNFT from '../common/MintNFT'


// 아이콘
import StarIcon from '@mui/icons-material/Star'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const MyEpisodeCard = ({ episode, deleteData }) => {
  return (
    <div className='border-text flex h-[100px] items-center gap-10 border-b px-3'>
      {/* 썸네일 이미지 */}
      <div className='flex-none'>
        <img
          src={episode.thumbnail}
          alt=''
          className='h-auto w-[150px] rounded-lg'
        />
      </div>
      {/* 회차 정보 */}
      <div className='flex h-[80px] grow flex-col justify-evenly'>
        <p className=''>{episode.episodeName}</p>
        <div className='flex w-full justify-between'>
          <div className='flex items-center gap-2'>
            <span className='flex items-center gap-1'>
              <StarIcon sx={{ color: '#ffff19' }} />
              <span className='inline-block w-[45px] translate-y-[1px] transform'>
                {(episode.rating / 2).toFixed(2)}
              </span>
            </span>
            <span className='text-text/50 inline-block translate-y-[1px] transform'>
              {episode.uploadDate}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <MintNFT
              item={episode}
              type="webtoon"
            />
            <Link to={`/myworks/webtoon/episode/${episode.episodeId}/update`}>
              <IconButton
                Icon={EditIcon}
                tooltip={'수정하기'}
                style={{ color: '#2599ff' }}
              />
            </Link>
            <div onClick={() => deleteData(episode.episodeId)}>
              <IconButton
                Icon={DeleteIcon}
                tooltip={'삭제하기'}
                style={{ color: '#ff5050' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyEpisodeCard
