// StoreFilter.jsx
import React from 'react'
import { genres } from '../../pages/store/storeData'

const StoreFilter = ({ onFilterChange, activeFilters = {}, activeCategory = '' }) => {
  const filterGroups = [
    {
      id: 'status',
      title: '판매 상태',
      filters: [
        { id: 'sell', label: '판매중' },
        { id: 'notsell', label: '미판매' },
      ],
    },
    {
      id: 'genre',
      title: '장르',
      filters: genres.map(genre => ({ id: genre, label: genre })),
    },
    {
      id: 'category',
      title: '카테고리',
      filters: [
        { id: '웹툰', label: '웹툰' },
        { id: '굿즈', label: '굿즈' },
        { id: '팬아트', label: '팬아트' }
      ],
    },
  ]

  // 체크 상태 확인 함수
  const isChecked = (groupId, filterId) => {
    // 카테고리 그룹의 경우 activeCategory와 비교
    if (groupId === 'category' && filterId === activeCategory && activeCategory !== '') {
      return true;
    }
    // 그 외의 경우 activeFilters에서 확인
    return activeFilters[groupId]?.includes(filterId) || false;
  };

  return (
    <div className='mr-8 w-[180px]'>
      {filterGroups.map((group) => (
        <div key={group.id} className='mb-6'>
          <h2 className='mb-3 border-b border-gray-700 pb-2 text-lg font-medium'>
            {group.title}
          </h2>
          <ul>
            {group.filters.map((filter) => (
              <li key={filter.id} className='mb-2 flex items-center'>
                <input
                  type='checkbox'
                  id={filter.id}
                  className='mr-2 h-4 w-4'
                  checked={isChecked(group.id, filter.id)}
                  onChange={() => onFilterChange(group.id, filter.id)}
                />
                <label htmlFor={filter.id} className='cursor-pointer'>
                  {filter.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default StoreFilter