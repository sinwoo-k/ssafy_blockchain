// NFTCreateModal.jsx → 버튼 모달 제거 & API 연동
import React, { useState } from 'react'
import { nftService, NFT_MARKETPLACE_ABI } from '../../api/nftApi'
import { ethers } from 'ethers'
import { useSelector } from 'react-redux'
import Loader from './Loader' // Loader 컴포넌트 import

const NFTCreateModal = ({ item, type, setShowModal }) => {
  const [loading, setLoading] = useState(false) // 로딩 상태 추가
  const [timerActive, setTimerActive] = useState(false) // 최소 1분 버튼 비활성화 상태

  const userData = useSelector((state) => state.user.userData)
  const isMetamask = userData?.ssoType === 'METAMASK'
  console.log('isMetamask:', isMetamask)
  const handleMint = async () => {
    const proceed = window.confirm(
      'NFT 발행 진행 시 1~2분 정도 소요될 수 있습니다. 진행 하시겠습니까?',
    )
    if (!proceed) return
    setLoading(true) // 민팅 시작 전 로딩 on
    setTimerActive(true)

    try {
      const payload = {
        webtoonId: item.webtoonId || item.webtoon?.webtoonId, // 웹툰 ID
        type: type, // 'fanart' | 'goods' | 'webtoon'
        typeId: item.fanartId || item.goodsId || item.episodeId, // 실제 아이템 ID
      }

      if (!isMetamask) {
        await nftService.mintNFT(payload)
        alert('NFT 발행 등록이 완료되었습니다.')
      } else {
        const requestRes = await nftService.mintNftMetamaskRequest(payload)
        if (!requestRes.needSignature) {
          throw new Error('민팅 요청이 실패했습니다(needSignature=false).')
        }

        // 2) personal_sign
        const signature = await nftService.signMessageWithMetamask(
          requestRes.messageToSign,
        )
        if (!signature) {
          throw new Error('서명 실패')
        }
        // 3) confirm-signature
        const confirmRes = await nftService.confirmSignature({
          userId: userData.userId,
          signature,
        })
        if (!confirmRes.success) {
          throw new Error('confirmSignature fail')
        }
        // 4) sendTransaction
        const receipt = await nftService.sendTransactionWithMetamask(
          confirmRes.metamaskPayload,
        )
        let mintedTokenId = null
        try {
          // receipt.logs => parse with contract interface
          const contractInterface = new ethers.Interface(NFT_MARKETPLACE_ABI)
          for (const log of receipt.logs) {
            try {
              const parsedLog = contractInterface.parseLog(log)
              if (parsedLog.name === 'Minted') {
                mintedTokenId = parsedLog.args.tokenId.toString()
                break
              }
            } catch (e) {
              /* ignore non-matching logs */
            }
          }
        } catch (e) {
          console.error('이벤트 파싱 실패:', e)
        }

        // *** DB 기록 단계 ***
        if (mintedTokenId) {
          // 필요한 필드:
          const dbPayload = {
            userId: userData.id,
            webtoonId: payload.webtoonId,
            type,
            typeId: payload.typeId,
            tokenId: mintedTokenId,
            contractAddress: confirmRes.contractAddress || '', // confirmRes 또는 상수 사용
            imageUrl: confirmRes.imageUrl || item.imageUrl || "",       // 우선 confirmRes에서, 없으면 item에서
            metadataUri: confirmRes.metadataUri || '', // 반드시 저장되어 있어야 함
          }
          await nftService.recordMintToDb(dbPayload)
        }
      }
    } catch (err) {
      console.error('NFT 발행 실패:', err)
      alert('NFT 발행 중 오류가 발생했습니다')
    } finally {
      setLoading(false) // 작업 완료 후 로딩 off
      setTimeout(() => {
        setTimerActive(false)
      }, 60000)
    }
  }

  return (
    <>
      {/* 민팅 진행 중 로딩 화면 표시 */}
      {loading || timerActive ? (
        <button
          className='text-chaintoon border-chaintoon rounded border px-4 py-1 hover:text-white'
          disabled={loading}
        >
          NFT 발행 중...
        </button>
      ) : (
        <button
          className='text-chaintoon border-chaintoon rounded border px-4 py-1 hover:text-white'
          onClick={handleMint}
          disabled={loading}
        >
          NFT 발행하기
        </button>
      )}
    </>
  )
}

export default NFTCreateModal
