import React from 'react'

const MyWebtoonEpisodePreview = ({ images, setShowModal }) => {
  return (
    <div className='fixed top-0 left-0 z-50'>
      <div
        className='bg-text/30 fixed flex h-full w-full items-center justify-center'
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className='flex h-[100vh] flex-col rounded-xl bg-black px-10 py-5'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='m-3 flex w-[500px] grow flex-col justify-between overflow-y-scroll'>
            {images.map((img, index) => (
              <div key={`episode-image-${index}`}>
                {img.type === 'new' && (
                  <img
                    src={URL.createObjectURL(img.file)}
                    alt='미리보기'
                    key={img.name}
                  />
                )}
                {img.type === 'old' && (
                  <img src={img.file.imageUrl} alt='미리보기' key={img.name} />
                )}
              </div>
            ))}
          </div>
          <div className='mt-2 flex justify-center gap-5'>
            <button
              className='cursor-pointer text-red-600'
              onClick={() => setShowModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonEpisodePreview
