import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import axiosInstance from './api/axiosInstance'; // ADD this line (adjust path if needed)
import { BASE_URL, COMPLAINT_URL } from './Url';
import ticketDetailFormEditIcon from '../assets/images/ticketDetailFormEditIcon.png';
import closeIcon from '../assets/images/closeIcon.png';
import photoIcon from '../assets/images/photoIcon.svg';
import uploadButtonIcon from '../assets/images/uploadButtonIcon.svg';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  FormControl,
  Input,
  FormLabel,
  Link,
  Divider,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import useAuth from './Hooks/useAuth.jsx';


const updateFormHandler = async (data, ticket_id, fetchRows, pageNumber) => {
  try {
    console.log('Data to be updated:', data);
    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('assigned_department', data.assigned_department);
    formData.append('assigned_staff', data.assigned_staff);
    formData.append('status', data.status);
    formData.append('remarks', data.remarks);
    data.images.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axiosInstance.patch(`${BASE_URL}${COMPLAINT_URL}${ticket_id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      alert('Ticket updated successfully!');
      fetchRows(pageNumber);
    } else {
      alert(`Failed to update ticket: ${response || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error updating ticket:', error.response.data);
    alert(error.response.data || 'An error occurred while updating the ticket.');
  }

  console.log('Update Data:', data);
};


function MUITicketDetailForm({ complaintData, setViewTicket, viewTicket, fetchRows, pageNumber, departments}) {

  const {isAdmin} = useAuth();

  const fetchStaffs = async (department) => {
    try{
      const response = await axiosInstance.get(`${BASE_URL}${DEPARTMENT_URL}${department}/staff/`,{ withCredentials: true })
      console.log("Staffs", response.data.results)
      setStaffs(response.data.results)

    }
    catch(error){
      console.log("Failed to fetch tickets.")
    } 
  }

  console.log('Complaint Data:', complaintData);
  const [isEditable, setIsEditable] = useState(false);
  const [description, setDescription] = useState(complaintData.description || '');
  const [files, setFiles] = useState(
    complaintData.images.map((img, index) => ({
      ...img,
      name: `complaintimage${index + 1}`,
    }))
  );
  const [assignedDepartment, setAssignedDepartment] = useState(complaintData.assigned_department || '');
  const [status, setStatus] = useState(complaintData.status || 'open');
  const [remarks, setRemarks] = useState(complaintData.remarks || '');
  const [staffs, setStaffs] = useState([])
  const [assignedStaff, setAssignedStaff] = useState(complaintData.assigned_staff || '');
  const statusStyles = {
  open: {
    color: 'primary.main',
    borderColor: 'primary.light',
  },
  in_progress: {
    color: 'info.main',
    borderColor: 'info.light',
  },
  resolved: {
    color: 'success.main',
    borderColor: 'success.light',
  },
  closed: {
    color: 'grey.700',
    borderColor: 'grey.400',
  },
  on_hold: {
    color: 'warning.main',
    borderColor: 'warning.light',
  }
};

  useEffect(()=>{
    fetchStaffs(assignedDepartment)
  },[assignedDepartment])



  // Sample department and staff data (replace with actual data from your API)
  const staffMembers = {
    'Maintenance': ['John Smith', 'Alice Johnson', 'Bob Wilson'],
    'Housekeeping': ['Mary Brown', 'Sarah Davis', 'Tom Clark'],
    'IT Support': ['Mike Lee', 'Emma White', 'David Green'],
    'Medical Equipment': ['Lisa Taylor', 'James Anderson', 'Carol Moore'],
    'Administration': ['Robert Harris', 'Jennifer Lewis', 'Mark Walker']
  };

  const uploadOnChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    e.target.value = null;
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '60vw', 
        minHeight: '91vh',
        maxHeight: '91vh',
        overflowY: 'auto',
        position: 'absolute',
        top: '2%',
        right: '20%',
        zIndex: 30,
        bgcolor: 'white',
        borderRadius: '8px',
        boxShadow: 3,
        pb: 2,
      }}
      key="ticket-detail-form"
    >
      <Box
        component="section"
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', py: 2, px: 2.5 }}
        key="header-section"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} key="ticket-info">
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} key="ticket-header">
            <Typography variant="h6" sx={{ fontStyle: 'italic', color: 'text.primary' }} key="ticket-id">
              #{complaintData.ticket_id}
            </Typography>
            <Chip
              label={complaintData.status}
              sx={{
                ml: 2,
                height: 20,
                fontSize: '0.75rem',
                fontWeight: '600',
                border: '1px solid',
                ...statusStyles[complaintData.status],
                bgcolor: 'transparent',
                borderRadius: '16px',
              }}
              key="status-badge"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" key="room-info-summary" sx={{ paddingLeft: 0.5 }}>
            {complaintData.room.room_no} / {complaintData.room.Block} / {complaintData.Floor_no}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} key="edit-button">
          <IconButton onClick={() => setIsEditable(!isEditable)} aria-label="Edit ticket" key="edit-icon">
            <img src={ticketDetailFormEditIcon} alt="Edit Icon" className="size-9" />
          </IconButton>
          <IconButton
            onClick={() => setViewTicket(!viewTicket)}
            sx={{
              bgcolor: 'grey.900',
              '&:hover': { bgcolor: 'grey.800' },
              borderRadius: '4px', // Changed to square shape
              padding: '9px', // Adjusted padding for square appearance
            }}
            aria-label="Close ticket form"
            key="close-icon"
          >
            <img src={closeIcon} alt="Close Icon" className="size-4" /> {/* Adjusted image size */}
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#E5E7EB', borderWidth: '1px' }} />

      <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 3, py: 2.5 }} key="ticket-details-section">
        <Typography variant="h7" key="section-title">
          TICKET DETAILS
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10 }} key="details-grid">
          <Box key="room-info-detail">
            <Typography variant="body2" color="text.secondary">
              Room info
            </Typography>
            <Typography variant="body1" sx={{ color: '#202020' }}>
              {complaintData.room.room_no} / {complaintData.room.Block} / {complaintData.room.Floor_no}
            </Typography>
          </Box>
          <Box key="ward-speciality">
            <Typography variant="body2" color="text.secondary">
              Ward / Speciality
            </Typography>
            <Typography variant="body1" sx={{ color: '#202020' }}>
              {complaintData.room.ward} / {complaintData.room.speciality}
            </Typography>
          </Box>
          <Box key="issue-type">
            <Typography variant="body2" color="text.secondary">
              Issue Type
            </Typography>
            <Typography variant="body1" sx={{ color: '#202020' }}>
              {complaintData.issue_type}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} key="description-section">
          <Typography variant="body2" color="text.secondary" key="description-label">
            Description
          </Typography>
          <MDEditor
            key="description-editor"
            data-testid="description-editor"
            value={description}
            onChange={(val) => setDescription(val || '')}
            preview="preview"
            height={200}
            data-color-mode="light"
            className="w-[100%] md:w-[55%] rounded-md outline outline-[1px] outline-gray-300 p-2 bg-white"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} key="file-upload-section">
          <Typography variant="body2" color="text.secondary" key="description-label">
            Attachment
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }} key="upload-container">
            <Box
              sx={{
                display: files.length === 0 ? 'none' : 'flex',
                flexDirection: 'column',
                width: '30%',
                minWidth: 205,
                bgcolor: 'white',
              }}
              key="files-list"
            >
              {files.map((file, index) => (
                <Box
                  key={`file-${index}`}
                  sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', border: '1px solid #E5E7EB' }}
                >
                  <img className="p-3" src={photoIcon} alt="Photo Icon" key={`photo-icon-${index}`} />
                  <Link
                    onClick={() => {
                      const url = file.image || URL.createObjectURL(file);
                      window.open(url, '_blank', 'width=800,height=600');
                    }}
                    sx={{
                      color: 'text.secondary',
                      width: '60%',
                      py: 1,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline', textDecorationThickness: '1px' },
                    }}
                    className='hover:cursor-pointer'
                    key={`file-link-${index}`}
                  >
                    {file.name}
                  </Link>
                </Box>
              ))}
            </Box>
            <FormControl key="upload-button-container">
              <FormLabel htmlFor="uploadFile" key="upload-button-label">
                <img className={isEditable ? '' : 'grayscale'} src={uploadButtonIcon} alt="Upload Icon" />
              </FormLabel>
              <Input
                key="file-input"
                disabled={!isEditable}
                sx={{ display: 'none' }}
                type="file"
                id="uploadFile"
                multiple
                accept="image/*"
                onChange={uploadOnChange}
              />
            </FormControl>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#E5E7EB', borderWidth: '1px' }} />

      <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3, py: 2.5, mb: 7 }} key="additional-section">
        <Typography variant="h7" key="additional-title" sx={{ paddingBottom: 1 }}>
          ADDITIONAL DETAILS
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10 }} key="details-grid">
          <Box key="room-info-detail">
            <Typography variant="body2" color="text.secondary">
              Submitted by
            </Typography>
            <Typography variant="body1" sx={{ color: '#202020' }}>
              Patient
            </Typography>
          </Box>
          <Box key="ward-speciality">
            <Typography variant="body2" color="text.secondary" sx={{paddingBottom: 0.5}}>
              Assigned Department
            </Typography>
            {isEditable ? (
              <FormControl sx={{ minWidth: 210, height: 20 }}>
                <Select
                  labelId="department-select-label"
                  value={assignedDepartment}
                  onChange={(e) => {
                    setAssignedDepartment(e.target.value);
                    setAssignedStaff(''); // Reset staff when department changes
                  }}
                  sx={{ height: 45 }}
                >
                  <MenuItem value="">None</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.department_code} value={dept.department_name}>
                      {dept.department_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1" sx={{ color: '#202020' }}>
                {assignedDepartment || 'N/A'}
              </Typography>
            )}
          </Box>
          <Box key="issue-type">
            <Typography variant="body2" color="text.secondary" sx={{paddingBottom: 0.5}}>
              Assigned Staff
            </Typography>
            {isEditable ? (
              <FormControl sx={{ minWidth: 210, height: 20 }}>
                <Select
                  labelId="staff-select-label"
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
                  disabled={!assignedDepartment}
                  sx={{ height: 45}}
                >
                  <MenuItem value="">None</MenuItem>
                  {staffs &&
                   staffs?.map((staff) => (
                      <MenuItem key={staff.id} value={staff.username}>
                        {staff.username}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1" sx={{ color: '#202020' }}>
                {assignedStaff || 'N/A'}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#E5E7EB', borderWidth: '1px' }} />

      <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3, py: 2.5, mb: 7 }} key="ticket-status-section">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }} key="details-grid">
          <Box key="ward-speciality">
            {/* <Typography variant="body2" color="text.secondary" sx={{paddingBottom: 0.5}}>
              Ticket Status
            </Typography> */}
            {(isEditable && !isAdmin) ? (
              <FormControl sx={{ minWidth: 210, height: 20 }}>
                <Select
                  labelId="department-select-label"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  sx={{ height: 45 }}
                >
                  <MenuItem value="open" key="open">Open</MenuItem>
                  <MenuItem value="in_progress" key="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved" key="resolved">Resolved</MenuItem>
                  <MenuItem value="closed" key="closed">Closed</MenuItem>
                  <MenuItem value="on_hold" key="on_hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1" sx={{ color: '#202020' }}>
                {status || 'N/A'}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} key="description-section">
            <Typography variant="body2" color="text.secondary" key="description-label">
              Remarks
            </Typography>
            <MDEditor
              key="remarks-editor"
              data-testid="remarks-editor"
              value={remarks}
              preview={isAdmin ? 'preview' : 'edit'}
              onChange={(val) => setRemarks(val || '')}
              height={150}
              data-color-mode="light"
              className="w-[100%] md:w-[55%] rounded-md outline outline-[1px] outline-gray-300 p-2 bg-white"
            />
        </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#E5E7EB', borderWidth: '1px' }} />

      <Box
        component="section"
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 2, p: 2, paddingBottom: 0, border: 'none' }}
        key="action-buttons"
      >
        {isEditable ? (
          <>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ width: 112, borderRadius: '4px', textTransform: 'none' }}
              onClick={() => {
                setIsEditable(false);
                setAssignedDepartment(complaintData.assigned_department || '');
                setAssignedStaff(complaintData.assigned_staff || '');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                width: 112,
                bgcolor: '#04B7B1',
                color: 'white',
                borderRadius: '4px',
                textTransform: 'none',
                '&:hover': { bgcolor: '#03A6A0' },
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
              onClick={() => {
              
                updateFormHandler(
                  {
                    ticket_id: complaintData.ticket_id,
                    description,
                    images: files,
                    assigned_department: assignedDepartment,
                    assigned_staff: assignedStaff,
                    status,
                    remarks
                  },
                  complaintData.ticket_id,
                  fetchRows,
                  pageNumber
                );
        
                setIsEditable(false);
              }}
            >
              Update
            </Button>
          </>
        ) : (
          <Box sx={{ visibility: 'hidden', p: 0.8 }} key="placeholder">
            placeholder
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MUITicketDetailForm;