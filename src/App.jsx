import { useState } from 'react'
// import BedConfiguration from './pages/BedConfiguration'
// import ComplaintForm from './pages/ComplaintForm/ComplaintForm.jsx'
// import TicketSystem from './pages/TicketSystem.jsx'
// import TicketDetailForm from './pages/TicketDetailForm.jsx'
// import Departments from './pages/Departments.jsx'
import SessionExpired from './pages/ComplaintForm/SessionExpired.jsx'
import MUIBedConfiguration from './pages/MUIBedConfiguration.jsx'
import MUIDepartments from './pages/MUIDepartments.jsx'
import MUIIssueCategory from './pages/MUIIssueCategory.jsx'
import MUITicketSystem from './pages/MUITicketSystem.jsx'
import MUIComplaintForm from './pages/ComplaintForm/MUIComplaintForm.jsx'
import DepartmentBasedReport from './pages/Report/DepartmentBasedReport.jsx'
import TicketTATReport from './pages/Report/TicketTATReport.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MUIBedConfiguration />} />
      <Route path="/complaintForm" element={<MUIComplaintForm />} />
       <Route path="/ticketSystem" element={<MUITicketSystem />} />   
      <Route path="/sessionExpired" element={<SessionExpired/>}/>
      <Route path="/Departments" element={<MUIDepartments />} />
      <Route path="/IssueCategory" element={<MUIIssueCategory />} />
      <Route path="/DepartmentBasedReport" element={<DepartmentBasedReport />} />
      <Route path="/TicketTATReport" element={<TicketTATReport />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
    </BrowserRouter>    
  )
}

export default App
