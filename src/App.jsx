import { useState } from 'react'
import BedConfiguration from './pages/BedConfiguration'
import ComplaintForm from './pages/ComplaintForm/ComplaintForm.jsx'
import TicketSystem from './pages/TicketSystem.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<BedConfiguration />} />
      <Route path="/complaintForm" element={<ComplaintForm />} />
       <Route path="/ticketSystem" element={<TicketSystem />} />   
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
    </BrowserRouter>    
  )
}

export default App
