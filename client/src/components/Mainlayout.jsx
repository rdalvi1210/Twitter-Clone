import { Outlet } from 'react-router-dom'
import Leftsidebar from './Leftsidebar'

const Mainlayout = () => {
  return (
    <>
    <div>
      <Leftsidebar/>
    </div>
     <div>
      <Outlet/>
     </div>
     </>
  )
}

export default Mainlayout
