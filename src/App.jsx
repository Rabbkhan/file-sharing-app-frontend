import React from 'react'
import FileUpload from './components/Fileupload'
import undrawupload from './assets/undraw-upload.svg'
import logo from './assets/logo1.png'

const App = () => {
  return (
<>

  <div className=''>
    <img src={logo} className='w-36' />
    </div>
    <div className='container flex items-center justify-center flex-row-reverse'>
      <div >
<img src={undrawupload} alt='bg-image' />
      </div>
      <FileUpload/>
    </div>
      </>
  )
}

export default App


