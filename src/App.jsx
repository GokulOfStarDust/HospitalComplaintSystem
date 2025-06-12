import { useState } from 'react'
import BedConfiguration from './pages/BedConfiguration'
import ComplaintForm from './pages/ComplaintForm/ComplaintForm.jsx'
import TicketSystem from './pages/TicketSystem.jsx'
import TicketDetailForm from './pages/TicketDetailForm.jsx'
import SessionExpired from './pages/ComplaintForm/SessionExpired.jsx'
import Departments from './pages/Departments.jsx'
import IssueCategory from './pages/IssueCategory.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<BedConfiguration />} />
      <Route path="/complaintForm" element={<ComplaintForm />} />
       <Route path="/ticketSystem" element={<TicketSystem />} />   
      <Route path="/ticketDetailForm" element={<TicketDetailForm />} />
      <Route path="/sessionExpired" element={<SessionExpired/>}/>
      <Route path="/Departments" element={<Departments />} />
      <Route path="/IssueCategory" element={<IssueCategory />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
    </BrowserRouter>    
  )
}

export default App
