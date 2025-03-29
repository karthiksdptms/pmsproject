import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useAuth } from './assets/context/authContext'

import Dashboard from './assets/components/Dashboard'
import Maindashboard from './assets/components/Maindashboard'
import Training from './assets/components/Training'
import Placementsannounce from './assets/components/Placementannounce'
import Trainingreports from './assets/components/Trainingreports'
import Trainingschedule from './assets/components/Trainingschedule'
import Aptitude from './assets/components/Aptitude'
import Trainingattendance from './assets/components/Trainingattendance'
import Aptitudeconfigurequestions from './assets/components/Aptitudeconfigurequestions'
import Aptitudescheduleexam from './assets/components/Aptitudescheduleexam'
import Accounts from './assets/components/Accounts'
import Accountsstudentaccounts from './assets/components/Accountsstudentaccounts'
import Studentdashboard from './studentcomponents/Studentdashboard'
import Studenttraining from './studentcomponents/Studenttraining'
import Studentplacement from './studentcomponents/Studentplacement'
import Login from './assets/components/Login'
import PrivateRoute from './assets/components/pages/utils/PrivateRoute'
import RoleBaseRoutes from './assets/components/pages/utils/RoleBaseRoutes'
import Studentprofile from './studentcomponents/Studentprofile'
import Adminsummmary from './assets/components/Adminsummary'
import Studentsummary from './studentcomponents/Studentsummary'
import Studenttrainingexams from './studentcomponents/Studenttrainingexams'
import Studenttrainingscores from './studentcomponents/Studenttrainingscores'
import Aptitudescores from './assets/components/Aptitudescores'
import Accountsapprovals from './assets/components/Accountapprovals'
import Studentactualtraining from './studentcomponents/Studentactualtraining'
import Studenttrainingschedules from './studentcomponents/Studenttrainingschedules'
import Studenttrainingattendance from './studentcomponents/Studenttrainingattendance'
import Settings from './assets/components/Settings'
import Settingsfilters from './assets/components/Settingsfilters'
import Settingsstaffs from './assets/components/Settingsstaffs'



function App() {
  const { user } = useAuth()

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Navigate to="/Login" />} />

          <Route path='/Login' element={<Login />} />


          <Route path='/Maindashboard' element={
            <PrivateRoute>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <Maindashboard />
              </RoleBaseRoutes>
            </PrivateRoute>
          } >
            <Route index element={<Adminsummmary />} />
            <Route path='/Maindashboard/Dashboard' element={<Dashboard />} />
            <Route path='/Maindashboard/Aptitude' element={<Aptitude />} />
            <Route path='/Maindashboard/Accounts' element={<Accounts />} />
            <Route path='/Maindashboard/Accountsstudentaccounts' element={<Accountsstudentaccounts />} />
            <Route path='/Maindashboard/Accountapprovals' element={<Accountsapprovals />} />

            <Route path='/Maindashboard/Training' element={<Training />} />
            <Route path='/Maindashboard/Trainingreports' element={<Trainingreports />} />
            <Route path='/Maindashboard/Trainingschedule' element={<Trainingschedule />} />

            <Route path='/Maindashboard/Trainingattendence' element={<Trainingattendance />} />
           
            <Route path='/Maindashboard/Placementannounce' element={<Placementsannounce />} />
            <Route path='/Maindashboard/Settings' element={<Settings />} />
            <Route path='/Maindashboard/Settingsfilters' element={<Settingsfilters />} />

            <Route path='/Maindashboard/Settingsstaffs' element={<Settingsstaffs />} />


            <Route path='/Maindashboard/Aptitudeconfigurequestions' element={<Aptitudeconfigurequestions />} />
            <Route path='/Maindashboard/Aptitudescores' element={<Aptitudescores />} />
            <Route path='/Maindashboard/Aptitudescheduleexam' element={<Aptitudescheduleexam />} />
          </Route>








          <Route path='/Studentdashboard' element={
            <PrivateRoute>
              <RoleBaseRoutes requiredRole={["student"]}>
                <Studentdashboard />
              </RoleBaseRoutes>
            </PrivateRoute>
          } >

            <Route index element={<Studentsummary/>}/>
            <Route path='/Studentdashboard/Studenttraining' element={<Studenttraining />} />
            <Route path='/Studentdashboard/Studentactualtraining' element={<Studentactualtraining />} />
            <Route path='/Studentdashboard/Studenttrainingschedules' element={<Studenttrainingschedules />} />
            <Route path='/Studentdashboard/Studenttrainingattendance' element={<Studenttrainingattendance />} />



            <Route path='/Studentdashboard/Studenttrainingexams' element={<Studenttrainingexams />} />
            <Route path='/Studentdashboard/Studenttrainingscores' element={<Studenttrainingscores />} />

            <Route path='/Studentdashboard/Studentplacement' element={<Studentplacement />} />
            <Route path='/Studentdashboard/Studentprofile' element={<Studentprofile />} />


          </Route>

         



          <Route path='/unauthorized' element={<h1>Unauthorized Access 🚫</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
