import React from 'react'

const StoreFilter = ({ categories, onFilterChange }) => {
  const filterGroups = [
    {
      id: 'main',
      title: '모바일 상점',
      filters: [
        { id: 'all', label: '전체품목' },
        { id: 'new', label: '이벤트' },
        { id: 'sale', label: '할인' },
      ],
    },
    {
      id: 'category',
      title: '장르',
      filters: categories.map(cat => ({ id: cat, label: cat })),
    },
    {
      id: 'character',
      title: '캐릭터 고리',
      filters: [
        { id: 'char1', label: '판롤' },
        { id: 'char2', label: '주주' },
        { id: 'char3', label: '바비' },
        { id: 'char4', label: '체크' },
        { id: 'char5', label: '스퀘어' },
        { id: 'char6', label: '트라이앵글' },
        { id: 'char7', label: '서클' },
      ],
    },
  ]

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