  import React, { useState, useEffect, use } from 'react';
  import axiosInstance from '../api/axiosInstance';
  import { BASE_URL, COMPLAINT_URL } from '../Url';
  import { TextField, Button , IconButton, Box, Typography, InputAdornment, Divider, MenuItem } from '@mui/material';
  import Drawer from '@mui/material/Drawer';
  import PrintIcon from '@mui/icons-material/Print';
  import FilterListIcon from '@mui/icons-material/FilterList';
  import { useSearchParams } from 'react-router-dom';
  import { DataGrid } from '@mui/x-data-grid';
  import { REPORT_URL } from '../Url';
  import CloseIcon from '@mui/icons-material/Close';
  import CustomOverlay from './CustomOverlay';
  import * as XLSX from 'xlsx';


  function DepartmentBasedReport() {

    const [page, setPage] = useState(0); // DataGrid uses 0-based page index
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [rowCount, setRowCount] = useState(0); // Total rows for pagination
    const [isLoading, setIsLoading] = useState(false);
    const [filterModel, setFilterModel] = useState({ items: [] });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filters, setFilters] = useState({
      submitted_at: '', // Default to today's date - new Date(Date.now()).toISOString().split('T')[0] || 
      priority: '',
      department: '',
    });
    const [totals, setTotals] = useState({
      totalTickets: 0,
      resolvedTickets: 0,
      priorityHigh: 0,
    });

  const columns = [
    { field: 'department_name', headerName: 'Department', flex: 1.5, minWidth: 150 , cellClassName: 'department-column', headerClassName: 'department-header'},
    { field: 'priority', headerName: 'Priority', flex: 1, minWidth: 200 },
    { field: 'total_tickets', headerName: 'Total Tickets', flex: 1, minWidth: 200,  },
    { field: 'resolved', headerName: 'Resolved', flex: 1, minWidth: 200},
    { field: 'pending', headerName: 'Pending', flex: 1, minWidth: 200 },
  ];


  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({
      priority: filters.priority,
      department: filters.department,
      submitted_at: filters.submitted_at,
    });
  }, [filters]);
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
        // filterModel.items.forEach((filter) => {
        //   if (filter.value) {
        //     params[filter.field] = filter.value;
        //   }
        // });

        params.submitted_at = filters.submitted_at || '';
        params.priority = filters.priority || '';
        params.department = filters.department || '';
        console.log("API Request Parameters:", params);

        const response = await axiosInstance.get(`${BASE_URL}${REPORT_URL}`, { params });
        const data = response.data;
        console.log("API Response Data:", data);


        // if (data.message) {
        //   console.error('Custom messaeg:', data.message);
        //   return;
        // }

        const formattedRows = Array.isArray(data.results) ? data.results.map((item, index) => ({
          id: item.department_code || `${item.assigned_department}-${index}`, // DataGrid requires unique 'id'
          assigned_department: item.assigned_department,
          department_name: item.department_name || 'N/A',
          priority: item.priority,
          total_tickets: item.total_tickets || 0,
          resolved: item.resolved_tickets || 0,
          pending: item.pending_tickets || 0,
        })) : [];


      

        setRows(formattedRows);
        
        setRowCount(data.count || 0);
      } catch (error) {
        console.error('Error fetching data:', error.response?.statusText || error.message);
      } finally {
        setIsLoading(false);
      }
    };



    useEffect(() => {

      const totalTickets =  rows.reduce((sum, row) => sum + (row.total_tickets || 0), 0);
      const resolvedTickets = rows.reduce((sum, row) => sum + (row.resolved || 0), 0);
      const priorityHigh = rows.reduce((sum, row) => sum + (row.priority === 'high' ? (row.total_tickets || 0) : 0), 0);
      setTotals({
        totalTickets,
        resolvedTickets,
        priorityHigh,
      });

    }, [rows]);

    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get(`${BASE_URL}api/departments/`);
        const data = response.data;
        setDepartments(data.results || []);
        console.log("Departments Data:", data.results);
        // You can set this data to state if you want to use it in a dropdown
      } catch (error) {
        console.error('Error fetching departments:', error.response?.statusText || error.message);
      }
    }

    useEffect(() => {
      fetchDepartments();
    }, []);


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
          <main className='w-screen h-[98%] flex flex-col gap-y-0 p-4 font-sans'>
                <Box component="section" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 2, rowGap: 5 , columnGap: 1}}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'white',
                        py: 2.3,
                        px: 4,
                        borderRadius: '5px',
                        border: '1px solid',
                        borderColor: 'grey.300',
                      }}
                    >
                      <Typography variant="h6" fontWeight="600">
                        {totals.totalTickets}
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
                        py: 2.3,
                        px: 3,
                        borderRadius: '5px',
                        border: '1px solid',
                        borderColor: 'grey.300',
                      }}
                    >
                      <Typography variant="h6" fontWeight="600">
                        {totals.resolvedTickets}
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
                        py: 2.3,
                        px: 4,
                        borderRadius: '5px',
                        border: '1px solid',
                        borderColor: 'grey.300',
                      }}
                    >
                      <Typography variant="h6" fontWeight="600">
                        {totals.priorityHigh}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Priority High
                      </Typography>
                    </Box>
                </Box>




              <section className='w-[98%]  ml-4 flex flex-col rounded-md bg-white flex-1 min-h-0 shadow-xl'>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2 , position: 'absolute', right: 25, top: 200, zIndex: 1 }}>
                  <IconButton 
                  onClick={() => setDrawerOpen(true)}
                  sx={{border: '1px solid #616161', borderRadius: '4px', marginRight: '8px', padding: 0.6}}>
                    <FilterListIcon sx={{color: '#616161'}} />
                  </IconButton>
                  
                  <IconButton sx={{border: '1px solid #616161', borderRadius: '4px', marginRight: '8px', padding: 0.6}}
                  onClick={() => {
                    const worksheet = XLSX.utils.json_to_sheet(rows);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Department Report');
                    XLSX.writeFile(workbook, 'department_report.xlsx');
                  }}
                  >
                    <PrintIcon sx={{color: '#616161'}}/>
                  </IconButton>
                </Box>
                <div style={{ height: '100%', width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    rowCount={rowCount}
                    paginationMode="server"
                    // filterMode="server"
                    // onFilterModelChange={handleFilterModelChange}
                    paginationModel={{ page, pageSize }}
                    onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
                      setPage(newPage);
                      setPageSize(newPageSize);
                    }}
                
                    slots={{
                      noRowsOverlay: CustomOverlay, // Custom overlay when no rows are available
                    }}
                    loading={isLoading}
                    pageSizeOptions={[10, 25, 50, 100]}
                    sx={{
                      color: '#616161',
                      '--DataGrid-rowHeight': '20px',
                      border: 0,
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#FAF9F9',
                        borderBottom: '0px',
                      },
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#FAF9F9',
                      },
                      '& .MuiDataGrid-columnSeparator': {
                        display: 'none', // Remove vertical dividers between headers
                      },
                      '& .department-column': {
                        paddingLeft: '20px',
                      },
                      '& .department-header .MuiDataGrid-columnHeaderTitle': {
                        paddingLeft: '20px', // Correct padding for Department header title
                      },
                      '& .resolved .MuiDataGrid-cell': {
                        paddingLeft: '10px',
                      },
                    }}
                  />
                </div>
              </section>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box sx={{ width: 400, p: 3 }} role="presentation">

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h7" gutterBottom sx={{color: "#183433"}}>
                      Filter
                    </Typography>
                    <IconButton
                      sx={{paddingBottom: 1.5, color: '#616161'}}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  
                  <Divider/>
                  
                  {/* Date Picker */}
                  <TextField
                    label="Select Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2, mt:4 }}
                    value={filters.submitted_at}
                    onChange={(e) => setFilters({...filters, submitted_at : e.target.value})}
                  />
              
                  {/* Priority Dropdown */}
                  <TextField
                    select
                    label="Priority"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={filters.priority}
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </TextField>
                              
                  {/* Department Dropdown */}
                  <TextField
                    select
                    label="Department"
                    fullWidth
                    value={filters.department}
                    onChange={(e) => setFilters({...filters, department: e.target.value})}
                  >
                    <MenuItem value=''>All</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.department_code} value={dept.department_code}>
                        {dept.department_name}
                      </MenuItem>
                    ))}
                    
                  </TextField>
                              
                  {/* Apply Filters Button */}
                  <Box sx={{display: 'flex', flexDirection: 'row' , gap: 2, mt: 3}}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 3, color: '#04B7B1', bgcolor: 'White', outline: '1px solid #04B7B1' }}
                      onClick={() => {
                        setFilters({
                          submitted_at: '',
                          priority: '',
                          assigned_department: '',
                        });
                        fetchRows();
                        setPage(0); // Reset to first page on filter application
                        console.log("Filters cleared:", filters);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 3, color: 'white' }}
                      onClick={() => {
                          console.log(filters);
                          fetchRows();
                          setPage(0); // Reset to first page on filter application
                        setDrawerOpen(false);
                      }}
                    >
                      Search
                    </Button>
                  </Box>
                  
                </Box>
              </Drawer>
                  
          </main>
      );
  }

  export default DepartmentBasedReport;