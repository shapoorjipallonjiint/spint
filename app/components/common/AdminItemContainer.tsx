import React from 'react'

const AdminItemContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-14px_rgba(15,23,42,0.14)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(15,23,42,0.05),0_14px_36px_-14px_rgba(30,69,162,0.18)]'>{children}</div>
  )
}

export default AdminItemContainer