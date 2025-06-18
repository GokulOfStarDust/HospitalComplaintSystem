import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MUITicketDetailForm from './MUITicketDetailForm';
import axios from 'axios';
import { BASE_URL, COMPLAINT_URL, ISSUE_CATEGORY_URL, DEPARTMENT_URL } from './Url';
import { MoreVert } from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Checkbox,
  Typography,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';

function MUITicketSystem() {
  const [tableContent, setTableContent] = useState({ results: [], count: 0 });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewTicket, setViewTicket] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  useEffect(() => {
    const filterParams = Object.fromEntries(searchParams.entries());
    fetchFilteredRows(filterParams);
  }, [searchParams, paginationModel]);


  // Handle header checkbox toggle
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all rows on the current page
      const allRowIds = tableContent.results.map((row) => row.ticket_id);
      setSelectedRows(allRowIds);
    } else {
      // Deselect all rows
      setSelectedRows([]);
    }
  };

  // Handle individual row checkbox toggle
  const handleRowSelect = (ticketId) => {
    setSelectedRows((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const fetchFilteredRows = async (filterParams) => {
    try {
      const params = {
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        ...filterParams,
      };

      const response = await axios.get(
        `${BASE_URL}${COMPLAINT_URL}`,
        {
          params,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setTableContent(response.data);
      fetchIssues();
      fetchDepartments();
      console.log('Rows fetched:', response.data);
    } catch (error) {
      console.error('Error fetching rows:', error.response?.statusText || error.message);
    }
  };

  const fetchRows = async () => {
    try {
      const params = {
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        queryString: searchQuery || '',
      };
      const response = await axios.get(
        `${BASE_URL}${COMPLAINT_URL}`,
        { params }
      );
      setTableContent(response.data);
      fetchIssues();
      fetchDepartments();
      console.log('Rows fetched:', response.data);
    } catch (error) {
      console.error('Error fetching rows:', error.response?.statusText || error.message);
    }
  };

  const fetchIssues = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${ISSUE_CATEGORY_URL}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setIssues(response.data.results);
    } catch (error) {
      console.error('Error fetching issues:', error.response?.statusText || error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${DEPARTMENT_URL}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setDepartments(response.data.results);
    } catch (error) {
      console.error('Error fetching departments:', error.response?.statusText || error.message);
    }
  };

  const deleteRows = async (ticketId) => {
    try {
      await axios.delete(
        `${BASE_URL}${COMPLAINT_URL}${ticketId}/`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Row deleted:', ticketId);
      setTableContent((prev) => ({
        ...prev,
        results: prev.results.filter((row) => row.ticket_id !== ticketId),
      }));
      fetchRows();
    } catch (error) {
      console.error('Error deleting row:', error.response?.statusText || error.message);
    }
  };

  const columns = [
    {
      field: 'select',
      headerName: '',
      minWidth: 50,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Checkbox
          checked={
            tableContent.results.length > 0 &&
            tableContent.results.every((row) =>
              selectedRows.includes(row.ticket_id)
            )
          }
          onChange={handleSelectAll}
          sx={{
            color: '#04B7B1',
            '&.Mui-checked': { color: '#04B7B1' },
            transform: 'scale(1)',
          }}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.ticket_id)}
          onChange={() => handleRowSelect(params.row.ticket_id)}
          sx={{
            color: '#04B7B1',
            '&.Mui-checked': { color: '#04B7B1' },
            transform: 'scale(1)',
          }}
        />
      ),
    },
    { field: 'ticket_id', headerName: 'Ticket ID', width: 120, align: 'left' },
    {
      field: 'room_details',
      headerName: 'Room Details',
      minWidth: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2">{params.row.room_number}</Typography>
          <Typography variant="caption" color="text.secondary">{params.row.ward}</Typography>
        </Box>
      ),
    },
    {
      field: 'submitted_by',
      headerName: 'Submitted By',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2">{params.row.submitted_by}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(params.row.submitted_at).toLocaleDateString()} | {new Date(params.row.submitted_at).toLocaleTimeString()}
          </Typography>
        </Box>
      ),
    },
    { field: 'issue_type', headerName: 'Issue Type', minWidth: 156 },
    { field: 'description', headerName: 'Issue Description', width: 350 },
    { field: 'status', headerName: 'Ticket Status', width: 150 },
    { field: 'assigned_department', headerName: 'Assigned Department', width: 200 },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            width: '68%',
            mx: 'auto',
            py: 1,
            display: 'flex',
            height: '115%',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid',
            borderRadius: '12px',
            borderColor:
              params.row.priority === 'high'
                ? 'error.main'
                : params.row.priority === 'medium'
                ? '#29B6F6'
                : 'success.main',
            color:
              params.row.priority === 'high'
                ? 'error.main'
                : params.row.priority === 'medium'
                ? '#29B6F6'
                : 'success.main',
          }}
        >
          {params.row.priority}
        </Box>
      ),
    },
    {
      field: 'resolved_details',
      headerName: 'Resolved Details',
      width: 170,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <Typography variant="body2" color="text.secondary">
            {params.row.resolved_by || 'Person'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.resolved_on || '01/01/2024'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      headerAlign: 'center',
      width: 120,
      getActions: (params) => [
        <IconButton
          key={`view-${params.row.ticket_id}`}
          onClick={() => {
            setViewTicket(!viewTicket);
            setComplaintData(params.row);
          }}
          sx={{ padding: '0px' }}
        >
          <img src="eyeViewIcon.svg" alt="View" style={{ width: 32, height: 32 }} />
        </IconButton>,
        <IconButton
          key={`delete-${params.row.ticket_id}`}
          onClick={() => deleteRows(params.row.ticket_id)}
          sx={{ padding: '0px' }}
        >
          <img src="complaintDeleteIcon.svg" alt="Delete" style={{ width: 32, height: 32 }} />
        </IconButton>,
        <IconButton
          key={`more-${params.row.ticket_id}`}
          sx={{ padding: '0px' }}
        >
          <MoreVert fontSize="small" />
        </IconButton>,
      ],
    },
  ];

  return (
    <main className="flex flex-col overflow-x-hidden h-screen">
      <Box component="section" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 2, rowGap: 5, columnGap: 1 }}>
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
            {tableContent.results?.filter((row) => row.status === 'resolved').length || 0}
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
            {tableContent.results?.filter((row) => row.priority === 'high').length || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Priority High
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ width: '100%' }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'row', gap: 2, p: 2 }}>
          <FormControl sx={{ width: '11.5%' }} size="small">
            <InputLabel id="ward-label">Select Ward</InputLabel>
            <Select
              labelId="ward-label"
              id="ward"
              name="ward"
              value={searchParams.get('ward') || ''}
              onChange={handleFilterChange}
              label="Select Ward"
              sx={{ borderRadius: '4px', bgcolor: 'white' }}
            >
              <MenuItem value="">All Ward</MenuItem>
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Operation">Operation</MenuItem>
              <MenuItem value="ICU">ICU</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: '11.5%' }} size="small">
            <InputLabel id="status-label">Select Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={searchParams.get('status') || ''}
              onChange={handleFilterChange}
              label="Select Status"
              sx={{ borderRadius: '4px', bgcolor: 'white' }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="on_hold">On Hold</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: '11.5%' }} size="small">
            <InputLabel id="issue-label">Select Issue</InputLabel>
            <Select
              labelId="issue-label"
              id="issue"
              name="issue_type"
              value={searchParams.get('issue_type') || ''}
              onChange={handleFilterChange}
              label="Select Issue"
              sx={{ borderRadius: '4px', bgcolor: 'white' }}
            >
              <MenuItem value="">All Issue</MenuItem>
              {issues.map((row) => (
                <MenuItem key={row.issue_category_code} value={row.issue_category_name}>
                  {row.issue_category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '11.5%' }} size="small">
            <InputLabel id="department-label">Select Department</InputLabel>
            <Select
              labelId="department-label"
              id="assigned_department"
              name="assigned_department"
              value={searchParams.get('assigned_department') || ''}
              onChange={handleFilterChange}
              label="Select Department"
              sx={{ borderRadius: '4px', bgcolor: 'white' }}
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((row) => (
                <MenuItem key={row.department_code} value={row.department_name}>
                  {row.department_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '11.5%' }} size="small">
            <InputLabel id="priority-label">Select Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              name="priority"
              value={searchParams.get('priority') || ''}
              onChange={handleFilterChange}
              label="Select Priority"
              sx={{ borderRadius: '4px', bgcolor: 'white' }}
            >
              <MenuItem value="">All Priority</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box component="section" sx={{ width: '98%', margin: 'auto', display: 'flex', flexDirection: 'column', borderRadius: '4px', bgcolor: 'white', flex: 1, minHeight: 0 }}>
        <Box sx={{ height: 56, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2, my: 1, pr: 3 }}>
          <TextField
            variant="standard"
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
            sx={{
              width: '20%',
              '& .MuiInput-root': {
                borderBottom: '1px solid rgba(0,0,0,0.42)',
                '&:hover': {
                  borderBottom: '1px solid rgba(0,0,0,0.87)',
                },
                '&.Mui-focused': {
                  borderBottom: '2px solid #1976d2',
                },
              },
              '& .MuiInput-root:before': { borderBottom: 'none' },
              '& .MuiInput-root:after': { borderBottom: 'none' },
              '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
          <DataGrid
            rows={tableContent.results || []}
            columns={columns}
            getRowId={(row) => row.ticket_id}
            rowCount={tableContent.count || 0}
            paginationModel={paginationModel}
            rowHeight={60}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            paginationMode="server"
            sx={{
              height: '100%',
              maxHeight: 'calc(100vh - 300px)', // Adjust based on header and filter heights
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#FAF9F9',
                color: '#616161',
                fontSize: '0.875rem',
                fontWeight: 'medium',
              },
              '& .MuiDataGrid-row': {
                '&:hover': { bgcolor: '#FAF9F9' },
                borderBottom: '1px solid #E5E7EB',
                color: '#616161',
                fontSize: '0.875rem',
              },
              '& .MuiDataGrid-cell': {
              padding: '1rem 0.75rem',
              fontSize: '0.875rem',
              color: '#616161',
              display: 'flex',
              alignItems: 'center',
            },
              '& .MuiDataGrid-main': {
                overflowY: 'auto',
              },
            }}
            disableRowSelectionOnClick
            slots={{
              noRowsOverlay: () => (
                <Box sx={{ textAlign: 'center', p: 2, color: '#6B7280' }}>
                  <Typography variant="body2">No data available</Typography>
                </Box>
              ),
            }}
          />
        </Box>
      </Box>

      {viewTicket && (
        <>
          <MUITicketDetailForm
            complaintData={complaintData}
            viewTicket={viewTicket}
            setViewTicket={setViewTicket}
            fetchRows={fetchRows}
            pageNumber={paginationModel.page + 1}
            departments={departments}
          />
          <Box
            sx={{
              position: 'fixed',
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