import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className='container mx-auto px-4 pt-[90px]'>
      <h1 className='mb-4 text-3xl font-bold'>개인정보처리방침</h1>
      <p className='mb-6'>
        Chaintoon의 개인정보처리방침에 오신 것을 환영합니다. 본 방침은 귀하의
        개인정보 수집, 이용, 보호에 관한 회사의 방침을 설명합니다.
      </p>
      <section className='mb-6'>
        <h2 className='mb-2 text-2xl font-semibold'>
          제1조 (개인정보의 수집 및 이용 목적)
        </h2>
        <p>
          회사는 서비스 제공, 운영 및 개선, 고객 지원 등을 위해 개인정보를
          수집하고 이용합니다.
        </p>
      </section>
      <section className='mb-6'>
        <h2 className='mb-2 text-2xl font-semibold'>
          제2조 (수집하는 개인정보 항목)
        </h2>
        <ul className='list-inside list-disc'>
          <li>필수정보: 이름, 이메일 주소, 지갑 주소 등</li>
          <li>서비스 이용 과정에서 생성되는 정보: 웹툰 이용 기록 등</li>
        </ul>
      </section>
      <section className='mb-6'>
        <h2 className='mb-2 text-2xl font-semibold'>
          제3조 (개인정보의 보유 및 이용 기간)
        </h2>
        <p>
          수집된 개인정보는 이용 목적이 달성되면 지체 없이 파기되며, 관련 법령에
          따라 일정 기간 보관될 수 있습니다.
        </p>
      </section>
      <section className='mb-6'>
        <h2 className='mb-2 text-2xl font-semibold'>
          제4조 (개인정보의 제3자 제공)
        </h2>
        <p>
          회사는 이용자의 사전 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
        </p>
      </section>
      <p className='mt-8 text-sm text-gray-500'>
        마지막 업데이트: 2025년 4월 7일
      </p>
    </div>
  )
}

export default PrivacyPolicy
