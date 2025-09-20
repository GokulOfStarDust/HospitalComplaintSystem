
import MUIBedConfiguration from './pages/MasterSettings/MUIBedConfiguration.jsx'
import MUIDepartments from './pages/MasterSettings/MUIDepartments.jsx'
import MUIIssueCategory from './pages/MasterSettings/MUIIssueCategory.jsx'
import MUITicketSystem from './pages/MUITicketSystem.jsx'
import DepartmentBasedReport from './pages/Report/DepartmentBasedReport.jsx'
import TicketTATReport from './pages/Report/TicketTATReport.jsx'
import Login from './pages/Login.jsx'
import Navbar from './pages/Components/Navbar.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthProvider } from './pages/Context/AuthProvider.jsx'
import ProtectedRoute from './pages/Components/ProtectedRoute.jsx'


function App() {
//rachel48
//fuckyounigga
//nursing_department


  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <ProtectedRoute><Navbar/></ProtectedRoute>}>
              <Route index element={<MUITicketSystem />} />
              <Route path='/masterSettings' >
                <Route index element={<MUIBedConfiguration />} />
                <Route path='bedConfiguration' element={<MUIBedConfiguration />} />
                <Route path="issueCategory" element={<MUIIssueCategory />} />
                <Route path="departments" element={<MUIDepartments />} />
              </Route>
              <Route path='/report'>
                <Route index element={<DepartmentBasedReport />} />
                <Route path="departmentBasedReport" element={<DepartmentBasedReport />} />
                <Route path="ticketTATReport" element={<TicketTATReport />} />
              </Route>
              <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
  </AuthProvider>
  )
}

export default App
