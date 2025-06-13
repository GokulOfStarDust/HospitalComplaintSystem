import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Changed to react-router-dom
import MUITicketDetailForm from './MUITicketDetailForm';
import axios from 'axios';
import { BASE_URL, COMPLAINT_URL } from './Url';
import SearchIcon from '@mui/icons-material/Search';
import { MoreVert } from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  Typography,
  InputAdornment,
} from '@mui/material';

function MUITicketSystem() {
  const [tableContent, setTableContent] = useState({ results: [] });
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewTicket, setViewTicket] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    console.log('Search Params:', params);
    const queryString = new URLSearchParams(params).toString();
    fetchFilteredRows(queryString);
  }, [searchParams]);

  const fetchFilteredRows = async (queryString) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${COMPLAINT_URL}?page=${pageNumber}${queryString ? `&${queryString}` : ''}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setTableContent(response.data);
      console.log('Filtered Table Content:', response.data);
    } catch (error) {
      console.error('Error fetching filtered data:', error.response?.statusText || error.message);
    }
  };

  const fetchRows = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${COMPLAINT_URL}?page=${pageNumber}`);
      setTableContent(response.data);
      console.log('Table Content:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error.response?.statusText || error.message);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [pageNumber]);

  const deleteRows = async (ticket_id) => {
    try {
      await axios.delete(`${BASE_URL}${COMPLAINT_URL}${ticket_id}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Row deleted successfully');
      setTableContent((prev) => ({
        ...prev,
        results: prev.results.filter((item) => item.ticket_id !== ticket_id),
      }));
      fetchRows();
    } catch (error) {
      console.error('Error deleting data:', error.response?.statusText || error.message);
    }
  };

  return (
    <main className="flex flex-col overflow-x-hidden h-screen">
      <Box component="section" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 2, rowGap: 5 , columnGap: 1}}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'white',
            py: 2,
            px: 4,
            borderRadius: '4px',
            border: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="h6" fontWeight="600">
            {tableContent.count || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Tickets
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'white',
            py: 2,
            px: 3,
            borderRadius: '4px',
            border: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="h6" fontWeight="600">
            {tableContent.results.filter((item) => item.status === 'resolved').length || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Resolved Tickets
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'white',
            py: 2,
            px: 4,
            borderRadius: '4px',
            border: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="h6" fontWeight="600">
            {tableContent.results.filter((item) => item.priority === 'high').length || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Priority High
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ width: '100%' }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'row', gap: 2, p: 2 }}>
          <FormControl sx={{ width: '11.5%'}} size="small">
            <InputLabel id="ward-label">Select Ward</InputLabel>
            <Select
              labelId="ward-label"
              id="ward"
              name="ward"
              value={searchParams.get('ward') || ''}
              onChange={handleFilterChange}
              label="Select Ward"
              sx={{ borderRadius: '4px', bgcolor: 'white'}}
            >
              <MenuItem value="">Filter Ward</MenuItem>
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Operation">Operation</MenuItem>
              <MenuItem value="ICU">ICU</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: '11.5%'}} size="small">
            <InputLabel id="status-label">Select Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={searchParams.get('status') || ''}
              onChange={handleFilterChange}
              label="Select Status"
              sx={{ borderRadius: '4px', bgcolor: 'white'}}
            >
              <MenuItem value="">Filter Status</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="on_hold">On Hold</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: '11.5%'}} size="small">
            <InputLabel id="issue-label">Select Issue</InputLabel>
            <Select
              labelId="issue-label"
              id="issue"
              name="issue_type"
              value={searchParams.get('issue_type') || ''}
              onChange={handleFilterChange}
              label="Select Issue"
              sx={{ borderRadius: '4px', bgcolor: 'white'}}
            >
              <MenuItem value="">Filter Issue</MenuItem>
              <MenuItem value="cleanliness">Cleanliness</MenuItem>
              <MenuItem value="electrical">Electrical</MenuItem>
              <MenuItem value="plumbing">Plumbing</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: '11.5%'}} size="small">
            <InputLabel id="department-label">Select Department</InputLabel>
            <Select
              labelId="department-label"
              id="department"
              name="department"
              value={searchParams.get('department') || ''}
              onChange={handleFilterChange}
              label="Select Department"
              sx={{ borderRadius: '4px', bgcolor: 'white'}}
            >
              <MenuItem value="">Filter Department</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
              <MenuItem value="Cleaning">Cleaning</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: '11.5%'}} size="small">
            <InputLabel id="priority-label">Select Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              name="priority"
              value={searchParams.get('priority') || ''}
              onChange={handleFilterChange}
              label="Select Priority"
              sx={{ borderRadius: '4px', bgcolor: 'white'}}
            >
              <MenuItem value="">Filter Priority</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box component="section" sx={{ width: '98%', margin: 'auto', display: 'flex', flexDirection: 'column', borderRadius: '4px', bgcolor: 'white', flex: 1, minHeight: 0 }}>
        <Box sx={{ height: 56, width: '100%', pl: 9, pr: 3.5, py: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
          <TextField
            variant="standard"
            size="small"    
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: '20%',
              '& .MuiInput-root': {
                borderBottom: '1px solid #E5E7EB',
                '&:before': { borderBottom: '1px solid #E5E7EB' },
                '&:after': { borderBottom: '2px solid primary.main' },
                '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #E5E7EB' },
              },
            }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 , width: '100%' }}>
          <TableContainer component={Paper} sx={{ flex: 1, minHeight: 0, fontFamily: 'Inter, sans-serif', width: '100%' }}>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#FAF9F9', height: 50, width: '100%' }}>
                  <TableCell sx={{ width: '3%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    <Checkbox sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />
                  </TableCell>
                  <TableCell sx={{ width: '5%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Ticket ID
                  </TableCell>
                  <TableCell sx={{ width: '5%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Room Details
                  </TableCell>
                  <TableCell sx={{ width: '5%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Submitted By
                  </TableCell>
                  <TableCell sx={{ width: '4%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Issue Type
                  </TableCell>
                  <TableCell sx={{ width: '14%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Issue Description
                  </TableCell>
                  <TableCell sx={{ width: '5%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Ticket Status
                  </TableCell>
                  <TableCell sx={{ width: '6.5%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Assigned Department
                  </TableCell>
                  <TableCell sx={{ width: '6%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161', textAlign: 'center' }}>
                    Priority
                  </TableCell>
                  <TableCell sx={{ width: '6%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Resolved Details
                  </TableCell>
                  <TableCell sx={{ width: '5%', p: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ color: '#6B7280' }}>
                {Array.isArray(tableContent.results) && tableContent.results.length > 0 ? (
                  tableContent.results.map((record, index) => (
                    <TableRow
                      key={record.ticket_id}
                      sx={{
                        '&:hover': { bgcolor: '#FAF9F9' },
                        borderBottom: '1px solid #E5E7EB',
                        height: 40,
                      }}
                    >
                      <TableCell sx={{ width: '3%', p: '0.5rem 0.75rem' }}>
                        <Checkbox sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />
                      </TableCell>
                      <TableCell sx={{ width: '5%', p: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        {record.ticket_id}
                      </TableCell>
                      <TableCell sx={{ width: '5%', p: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2">{record.room_number}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {record.ward}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: '5%', p: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        {record.submitted_by}
                      </TableCell>
                      <TableCell sx={{ width: '4%', p: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        {record.issue_type}
                      </TableCell>
                      <TableCell sx={{ width: '14%', p: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        {record.description}
                      </TableCell>
                      <TableCell sx={{ width: '5%', p: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        {record.status}
                      </TableCell>
                      <TableCell sx={{ width: '5.5%', p: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        {record.assigned_department}
                      </TableCell>
                      <TableCell sx={{ width: '6%', p: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161', textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: '68%',
                            mx: 'auto',
                            py: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor:
                              record.priority === 'high'
                                ? 'error.main'
                                : record.priority === 'medium'
                                ? '#29B6F6'
                                : 'success.main',
                            color:
                              record.priority === 'high'
                                ? 'error.main'
                                : record.priority === 'medium'
                                ? '#29B6F6'
                                : 'success.main',
                          }}
                        >
                          {record.priority}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: '6%', p: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {record.resolved_by || 'Person'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {record.resolved_on || '01/01/2024'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: '5%', p: '0.5rem 0.1rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            onClick={() => {
                              setViewTicket(!viewTicket);
                              setComplaintData(record);
                            }}
                            aria-label="View ticket"
                            sx={{padding: 0.5}}
                          >
                            <img src="eyeViewIcon.svg" alt="View" className="size-8 flex-shrink-0" />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteRows(record.ticket_id)}
                            aria-label="Delete ticket"
                            sx={{padding: 0.5}}
                          >
                            <img src="complaintDeleteIcon.svg" alt="Delete" className="size-8 flex-shrink-0" />
                          </IconButton>
                          <Box sx={{ position: 'relative' }} className="group">
                            <IconButton aria-label="More options">
                              <MoreVert fontSize="small" />
                            </IconButton>
                            {/* <Box
                              sx={{
                                position: 'absolute',
                                bgcolor: 'white',
                                right: '100%',
                                bottom: -12,
                                mr: -2,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                                borderRadius: '4px',
                                p: 3,
                                zIndex: 10,
                                display: 'none',
                                '.group:hover &': { display: 'block' },
                              }}
                            >
                              <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 128, fontSize: '0.875rem' }}>
                                <Typography
                                  component="li"
                                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', cursor: 'pointer' } }}
                                >
                                  History
                                </Typography>
                                <Typography
                                  component="li"
                                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', cursor: 'pointer' } }}
                                >
                                  Print Qr Code
                                </Typography>
                              </Box>
                            </Box> */}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ textAlign: 'center', p: 2, color: '#6B7280' }}>
                      <Typography variant="body2">No data available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', px: 4, py: 2, bgcolor: '#FAF9F9' }}>
          <Typography sx={{ mx: 4, fontSize: '0.875rem', color: '#6B7280' }}>
            Page {pageNumber} of {Math.max(1, Math.ceil((tableContent.count || 0) / 10))}
          </Typography>
          <IconButton
            onClick={() => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev))}
            disabled={pageNumber === 1}
            aria-label="Previous page"
          >
            <img src="prevIcon.svg" alt="Previous" />
          </IconButton>
          <IconButton
            onClick={() => setPageNumber((prev) => (prev < Math.ceil((tableContent.count || 0) / 10) ? prev + 1 : prev))}
            disabled={pageNumber === Math.ceil((tableContent.count || 0) / 10) || (tableContent.count || 0) === 0}
            aria-label="Next page"
          >
            <img src="nextIcon.svg" alt="Next" />
          </IconButton>
        </Box>
      </Box>

      {viewTicket && (
        <>
          <MUITicketDetailForm
            complaintData={complaintData}
            viewTicket={viewTicket}
            setViewTicket={setViewTicket}
            fetchRows={fetchRows}
            pageNumber={pageNumber}
          />
          <Box
            sx={{
              position: 'absolute',
              width: '100vw',
              height: '100vh',
              top: 0,
              left: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 10,
            }}
            onClick={() => setViewTicket(false)}
          />
        </>
      )}
    </main>
  );
}

export default MUITicketSystem;