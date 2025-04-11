import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import nftService from '../../api/nftApi'

const WalletInfo = () => {
  const { userData } = useSelector((state) => state.user)
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const timeoutRef = useRef(null)

  const [walletInfo, setWalletInfo] = useState({
    walletAddress: '',
    amount: 0,
    usdValue: '0',
    krwValue: '0',
    ethToUsd: 3000,
    ethToKrw: 4500000,
    isLoading: true,
    error: null,
    currency: 'KRW',
    lastUpdated: null,
  })

  // 드래그를 위한 state
  const [position, setPosition] = useState({ x: 50, y: 150 })
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // 헤더에서 마우스를 누르면 드래그 시작
  const startDragging = (e) => {
    // 왼쪽 버튼만 허용 (e.button === 0)
    if (e.button !== 0) return
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    setDragging(true)
  }

  // 드래그 중 마우스 이동, 업 이벤트를 window에 바인딩
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
    }

    const handleMouseUp = () => {
      if (dragging) setDragging(false)
    }

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, dragOffset])

  // 지갑 정보 로드 함수 (기존 코드)
  const fetchWalletInfo = async () => {
    if (!userData?.id) return

    try {
      setRefreshing(true)

      // ETH 환율 가져오기
      let ethUsdRate = 3000
      let ethKrwRate = 4500000

      try {
        ethUsdRate = await nftService.getEthUsdRate()
        ethKrwRate = await nftService.getEthKrwRate()
      } catch (rateErr) {
        console.error('환율 정보 로드 오류:', rateErr)
      }

      // 지갑 정보 가져오기
      const walletInfoData = await nftService.getWalletInfo(userData.id)

      if (walletInfoData) {
        const ethAmount = walletInfoData.amount || 0
        const usdValue = (ethAmount * ethUsdRate).toFixed(2)
        const krwValue = Math.round(ethAmount * ethKrwRate).toLocaleString()

        setWalletInfo({
          walletAddress: walletInfoData.walletAddress || '',
          amount: ethAmount,
          usdValue: usdValue,
          krwValue: krwValue,
          ethToUsd: ethUsdRate,
          ethToKrw: ethKrwRate,
          isLoading: false,
          error: null,
          currency: walletInfo.currency || 'KRW',
          lastUpdated: new Date(),
        })
      } else {
        setWalletInfo((prev) => ({
          ...prev,
          isLoading: false,
          error: '지갑 정보를 불러올 수 없습니다.',
        }))
      }
    } catch (err) {
      console.error('지갑 정보 로드 오류:', err)
      setWalletInfo((prev) => ({
        ...prev,
        isLoading: false,
        error: '지갑 정보를 불러오는 중 오류가 발생했습니다.',
      }))
    } finally {
      setRefreshing(false)
    }
  }

  // 초기 로딩 및 주기적 업데이트
  useEffect(() => {
    fetchWalletInfo()
    const timer = setInterval(() => {
      fetchWalletInfo()
    }, 180000)

    return () => {
      clearInterval(timer)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [userData])

  // 지갑 주소 축약 함수
  const formatWalletAddress = (address) => {
    if (!address) return ''
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // 지갑 주소 복사 기능
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }

  // 통화 전환 처리
  const toggleCurrency = () => {
    setWalletInfo((prev) => ({
      ...prev,
      currency: prev.currency === 'USD' ? 'KRW' : 'USD',
    }))
  }

  // 로딩 중 표시
  if (walletInfo.isLoading) {
    return (
      <div
        className='fixed z-40 w-[190px] rounded-lg border border-gray-700 bg-gray-800/90 p-2.5 shadow-lg backdrop-blur-sm'
        style={{ left: position.x, top: position.y }}
      >
        <div className='flex items-center justify-between'>
          <h2
            className='flex cursor-move items-center text-sm font-medium'
            onMouseDown={startDragging}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mr-1 h-3 w-3'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
              />
            </svg>
            내 지갑
          </h2>
          <div className='h-3 w-3 animate-spin rounded-full border-t-2 border-b-2 border-[#3cc3ec]'></div>
        </div>
      </div>
    )
  }

  // 에러 발생 시 표시
  if (walletInfo.error) {
    return (
      <div
        className='fixed z-40 w-[190px] rounded-lg border border-gray-700 bg-gray-800/90 p-2.5 shadow-lg backdrop-blur-sm'
        style={{ left: position.x, top: position.y }}
      >
        <div className='flex items-center justify-between'>
          <h2
            className='flex cursor-move items-center text-sm font-medium'
            onMouseDown={startDragging}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mr-1 h-3 w-3'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
              />
            </svg>
            내 지갑
          </h2>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-3 w-3 text-red-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
        </div>
        <div className='mt-1 text-xs text-red-500'>{walletInfo.error}</div>
      </div>
    )
  }

  // 정상 렌더링 시
  return (
    <div
      className='fixed z-30 w-[190px] rounded-lg border border-gray-700 bg-gray-800/90 p-2.5 shadow-lg backdrop-blur-sm'
      style={{ left: position.x, top: position.y }}
    >
      <div className='mb-2 flex items-center justify-between'>
        <h2
          className='flex cursor-move items-center text-xs font-medium'
          onMouseDown={startDragging}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='mr-1 h-3 w-3'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
            />
          </svg>
          내 지갑
        </h2>

        {walletInfo.walletAddress && (
          <div className='group relative'>
            <div
              className='flex cursor-pointer items-center rounded bg-gray-700 px-1.5 py-0.5 font-mono text-xs'
              onClick={() => copyToClipboard(walletInfo.walletAddress)}
            >
              <span>{formatWalletAddress(walletInfo.walletAddress)}</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='ml-1 h-3 w-3 text-gray-400 hover:text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            </div>

            <div className='absolute -bottom-10 left-0 z-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
              <div className='max-w-[220px] overflow-hidden rounded bg-black p-1 text-[10px] whitespace-nowrap text-white'>
                {walletInfo.walletAddress}
              </div>
            </div>

            {copied && (
              <div className='absolute right-0 -bottom-6 z-50 rounded bg-green-900 px-1 py-0.5 text-[10px] text-white'>
                복사됨!
              </div>
            )}
          </div>
        )}
      </div>

      <div className='mb-1.5 rounded bg-gray-700 p-2'>
        <div className='text-[10px] text-gray-400'>ETH 잔액</div>
        <div className='text-sm font-medium'>{walletInfo.amount} ETH</div>
      </div>

      <div className='relative rounded bg-gray-700 p-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1 text-[10px] text-gray-400'>
            {walletInfo.currency}
            <button
              onClick={toggleCurrency}
              className='text-blue-400 hover:text-blue-300'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-3 w-3'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                />
              </svg>
            </button>
          </div>
          <button
            onClick={fetchWalletInfo}
            disabled={refreshing}
            className='text-[10px] text-gray-400 hover:text-white'
          >
            {refreshing ? (
              <span className='inline-block h-3 w-3 animate-spin rounded-full border-t border-b border-white' />
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-3 w-3'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
            )}
          </button>
        </div>
        <div
          className='w-full text-sm font-medium'
          style={{ wordBreak: 'break-all' }}
        >
          {walletInfo.currency === 'USD'
            ? `$${walletInfo.usdValue}`
            : `₩${walletInfo.krwValue}`}
        </div>
      </div>

      {walletInfo.lastUpdated && (
        <div className='mt-1 text-right text-[9px] text-gray-500'>
          {`업데이트: ${walletInfo.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        </div>
      )}
    </div>
  )
}

export default WalletInfo
