import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { BASE_URL, COMPLAINT_URL } from '../Url';
import { TextField, Button, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography, InputAdornment, TablePagination } from '@mui/material';
import { table } from '@uiw/react-md-editor';
import Drawer from '@mui/material/Drawer';
import { DataGrid } from '@mui/x-data-grid';

function DepartmentBasedReport() {

  const [tableContent, setTableContent] = useState([]);
  const [page, setPage] = useState(0); // DataGrid uses 0-based page index
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0); // Total rows for pagination
  const [isLoading, setIsLoading] = useState(false);
  const [filterModel, setFilterModel] = useState({ items: [] });


const columns = [    { field: 'assigned_department', headerName: 'Department', width: 200 },    { field: 'priority', headerName: 'Priority', width: 150 },    { field: 'total_tickets', headerName: 'Total Tickets', width: 150 },    { field: 'resolved', headerName: 'Resolved', width: 150 },    { field: 'pending', headerName: 'Pending', width: 150 },  ];

  // Fetch data from API
  const fetchRows = async () => {
    setIsLoading(true);
    try {
      // Construct query parameters
      const params = {
        limit: pageSize,
        offset: page * pageSize,
      };

      // Add filters if present
      filterModel.items.forEach((filter) => {
        if (filter.value) {
          params[filter.field] = filter.value;
        }
      });

      const response = await axios.get(`${BASE_URL}${COMPLAINT_URL}`, { params });
      const data = response.data;

      // Transform data to match DataGrid row structure
      const formattedRows = data.results.map((item, index) => ({
        id: item.department_code || `${item.assigned_department}-${index}`, // DataGrid requires unique 'id'
        assigned_department: item.assigned_department,
        priority: item.priority,
        total_tickets: item.total_tickets || 0,
        resolved: item.resolved || 0,
        pending: item.pending || 0,
      }));

      setRows(formattedRows);
      setRowCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching data:', error.response?.statusText || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when page, pageSize, or filterModel changes
  useEffect(() => {
    fetchRows();
  }, [page, pageSize, filterModel]);

  // Handle filter changes
  const handleFilterModelChange = (newFilterModel) => {
    setFilterModel(newFilterModel);
    setPage(0); // Reset to first page on filter change
  };

// useEffect(() => {
//   console.log("Table Rows:", tableRows);
// }, [tableRows]);


    return (
        <main className='w-screen h-screen flex flex-col gap-y-4 p-4 font-sans'>
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
                      Wait
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
                      Wait
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
                      Wait
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Priority High
                    </Typography>
                  </Box>
              </Box>

            <section className='w-[98%] ml-4 flex flex-col rounded-md bg-white flex-1 min-h-0'>
                {/* <TableContainer component={Paper} className='flex flex-col flex-1 min-h-0'>
                    <Table sx={{  width: '100%' }} className='font-sans table-fixed border-collapse w-full'>
                        <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <TableRow sx={{ backgroundColor: '#FAF9F9', height: '50px', width: '100%' }}>

                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Department</TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Priority</TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Total Tickets</TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Resolved</TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Pending</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody sx={{width:'100%', flexShrink: '' }} >
                            {Array.isArray(tableContent.results) &&
                                tableRows.map((record, index) => (
                                    <TableRow key={record.department_code + index} hover sx={{width: '100%'}}>
                                  
                                        <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>{record.assigned_department}</TableCell>
                                        <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161'}}>{record.priority}</TableCell>
                                        <TableCell sx={{ paddingX: '0.5rem', paddingRight :'0.85rem', fontSize: '0.875rem', color: '#616161' }}> </TableCell>
                                        <TableCell sx={{ paddingX: '0.5rem', paddingRight :'0.85rem', fontSize: '0.875rem', color: '#616161' }}> </TableCell>
                                        <TableCell sx={{ paddingX: '0.5rem', paddingRight :'0.85rem', fontSize: '0.875rem', color: '#616161' }}> </TableCell>

                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={tableContent.count || 0}
                  page={pageNumber}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 25, 50, { label: 'All', value: Math.min(tableContent.count || 100, 100) }]} // Respect max_limit
                /> */}
              <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  rowCount={rowCount}
                  paginationMode="server"
                  filterMode="server"
                  onFilterModelChange={handleFilterModelChange}
                  paginationModel={{ page, pageSize }}
                  onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
                    setPage(newPage);
                    setPageSize(newPageSize);
                  }}
                  loading={isLoading}
                  pageSizeOptions={[10, 25, 50, 100]}
                  sx={{ border: 0 }}
                />
              </div>
            </section>
        </main>
    );
}

export default DepartmentBasedReport;