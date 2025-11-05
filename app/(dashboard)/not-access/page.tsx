import React, { Suspense } from 'react'
import NotAccessPage from './_components/Notaccesspage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
      <NotAccessPage/>
      </Suspense>
    </div>
  )
}

export default page
