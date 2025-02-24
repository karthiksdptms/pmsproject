import './App.css'
import Dashboard from './assets/components/Dashboard'
import Login from './assets/components/Login'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Maindashboard from './assets/components/Maindashboard'
import Trainingreports from './assets/components/Trainingreports'
import Placementsannounce from './assets/components/Placementannounce'
import Training from './assets/components/Training'
import Trainingschedule from './assets/components/Trainingschedule'
import Aptitude from './assets/components/Aptitude'
import Trainingattendance from './assets/components/Trainingattendance'
import Aptitudeconfigurequestions from './assets/components/Aptitudeconfigurequestions'
import Aptitudescheduleexam from './assets/components/Aptitudescheduleexam'

import { useEffect } from 'react'
import Studentdashboard from './studentcomponents/Studentdashboard'
import Studenttraining from './studentcomponents/Studenttraining'
import Studentplacement from './studentcomponents/Studentplacement'



function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/Maindashboard' element={<Maindashboard/>}/>
        <Route path='/Training' element={<Training/>}/>
        <Route  path='/Placementannounce' element= {<Placementsannounce/>}/>
        <Route  path='/Trainingreports' element= {<Trainingreports/>} />
        <Route path='/Trainingschedule' element={<Trainingschedule/>}/>
        <Route path='/Aptitude' element={<Aptitude/>}/>
        <Route path='/Trainingattendance' element={<Trainingattendance/>}/>
        <Route path='/Aptitudeconfigurequestions' element={<Aptitudeconfigurequestions/>}/>
        <Route path='/Aptitudescheduleexam' element={<Aptitudescheduleexam/>}/>
       
       <Route path='/Studentdashboard' element={<Studentdashboard/>}/>
       <Route path='/Studenttraining' element={<Studenttraining/>}/>
       <Route path='/Studentplacement' element={<Studentplacement/>}/>

      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App