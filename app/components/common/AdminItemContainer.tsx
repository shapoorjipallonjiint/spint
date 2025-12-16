import React from 'react'

const AdminItemContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col gap-2 bg-white rounded-xl shadow-lg'>{children}</div>
  )
}

export default AdminItemContainer