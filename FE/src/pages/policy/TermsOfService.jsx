import React from 'react'

const TermsOfService = () => {
  return (
    <div className='container mx-auto px-4 pt-[90px]'>
      <h1 className='mb-4 text-3xl font-bold'>이용 약관</h1>
      <p className='mb-6'>
        Chaintoon 서비스 이용 약관에 오신 것을 환영합니다. 본 약관은 귀하가
        당사의 서비스를 이용함에 있어 동의해야 하는 법적 조건들을 규정합니다.
      </p>
      <section className='mb-6'>
        <h2 className='mb-2 text-2xl font-semibold'>제1조 (목적)</h2>
        <p>
          본 약관은 Chaintoon(이하 "회사")이 제공하는 NFT 기반 웹툰 서비스(이하
          "서비스")의 이용에 관한 제반 조건 및 절차를 규정함을 목적으로 합니다.
        </p>
      </section>
      <section className='mb-6'>
        <h2 className='mb-2 text-2xl font-semibold'>제2조 (이용자의 의무)</h2>
        <ul className='list-inside list-disc'>
          <li>이용자는 본 약관 및 관련 법령을 준수해야 합니다.</li>
          <li>
            타인의 권리를 침해하지 않으며, 정당한 사용 목적에 따라 서비스를
            이용해야 합니다.
          </li>
          <li>기타 회사가 정하는 사항을 준수해야 합니다.</li>
        </ul>
      </section>
      <section className='mb-6'>
        <h2 className='mb-2 text-2xl font-semibold'>제3조 (서비스 이용)</h2>
        <p>
          서비스 이용 방법 및 절차는 별도로 정한 서비스 이용 가이드에 따릅니다.
        </p>
      </section>
      <section className='mb-6'>
        <h2 className='mb-2 text-2xl font-semibold'>기타</h2>
        <p>본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.</p>
      </section>
      <p className='mt-8 text-sm text-gray-500'>
        마지막 업데이트: 2025년 4월 7일
      </p>
    </div>
  )
}

export default TermsOfService
