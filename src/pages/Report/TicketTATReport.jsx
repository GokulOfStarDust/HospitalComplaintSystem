  import { useState, useEffect } from 'react';
  import axios from 'axios';
  import { BASE_URL, TICKET_TAT_URL  } from '../Url';
  import { TextField, Button , IconButton, Box, Typography, InputAdornment, Divider, MenuItem } from '@mui/material';
  import Drawer from '@mui/material/Drawer';
  import PrintIcon from '@mui/icons-material/Print';
  import FilterListIcon from '@mui/icons-material/FilterList';
  import { useSearchParams } from 'react-router-dom';
  import { DataGrid } from '@mui/x-data-grid';
  import CloseIcon from '@mui/icons-material/Close';
  import CustomOverlay from './CustomOverlay';

  function TicketTATReport() {

    const [page, setPage] = useState(0); // DataGrid uses 0-based page index
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0); // Total rows for pagination
    const [isLoading, setIsLoading] = useState(false);
    const [filterModel, setFilterModel] = useState({ items: [] });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filters, setFilters] = useState({
      submitted_at: new Date(Date.now()).toISOString().split('T')[0],
      priority: '',
      start_time: '',
      end_time: '',
    });
    const [totals, setTotals] = useState({
      totalTickets: 0,
      averageTAT: 0,
    });

  const columns = [
    { field: 'ticket_id', headerName: 'Ticket ID', flex: 1.5, minWidth: 150 , cellClassName: 'department-column', headerClassName: 'department-header'},
    { field: 'submitted_at', headerName: 'Submitted At', flex: 1, minWidth: 200 },
    { field: 'resolved_at', headerName: 'Resolved At', flex: 1, minWidth: 200,  },
    { field: 'tat', headerName: 'TAT', flex: 1, minWidth: 200},
    { field: 'priority', headerName: 'Priority', flex: 1, minWidth: 200 },
    { field: 'status', headerName: 'Status',  flex: 1, minWidth: 200 }, // Hidden field for unique ID
  ];


  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({
      priority: filters.priority,
      submitted_at: filters.submitted_at,
      end_time: filters.end_time,
      start_time: filters.start_time,
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
        params.start_time = filters.start_time || '';
        params.end_time = filters.end_time || '';
        console.log("API Request Parameters:", params);

        const response = await axios.get(`${BASE_URL}${TICKET_TAT_URL}`, { params });
        const data = response.data;
        console.log("API Response Data:", data);


        // if (data.message) {
        //   console.error('Custom messaeg:', data.message);
        //   return;
        // }

        const totalTickets =  data.total_tickets || 0;
        const averageTAT = data.average_tat
        
        setTotals({
          totalTickets,
          averageTAT
        });


        const formattedRows = Array.isArray(data.results) ? data.results.map((item, index) => ({
          id: index + 1, // Unique ID for DataGrid
          ticket_id: item.ticket_id || 'N/A',
          submitted_at: new Date(item.submitted_at).toLocaleString('en-GB', {hour12: true}) || 'N/A',
          resolved_at: item.resolved_at || 'N/A',
          tat: item.tat || 'N/A',
          priority: item.priority || 'N/A',
          status: item.status || 'N/A',
          total_tickets: item.total_tickets || 0,
          resolved: item.resolved || 0,
          department: item.department || 'N/A', // Assuming department is part of the response
        })) : [];


      

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
          <main className='w-screen h-screen flex flex-col gap-y-0 p-4 font-sans'>
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
                        {totals.averageTAT}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Average TAT
                      </Typography>
                    </Box>
                </Box>




              <section className='w-[98%] ml-4 flex flex-col rounded-md bg-white flex-1 min-h-0 shadow-xl'>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2 , position: 'absolute', right: 25, top: 80, zIndex: 1, columnGap: 0.8 }}>
                  <IconButton 
                  onClick={() => setDrawerOpen(true)}
                  sx={{border: '1px solid #616161', borderRadius: '4px', marginRight: '8px', padding: 0.6}}>
                    <FilterListIcon sx={{color: '#616161'}} />
                  </IconButton>
                  
                  <IconButton sx={{border: '1px solid #616161', borderRadius: '4px', marginRight: '8px', padding: 0.6}}>
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
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ mb: 2, mt:4 }}
                    value={filters.submitted_at}
                    onChange={(e) => setFilters({...filters, submitted_at : e.target.value})}
                  />

                   <TextField
                    label="Start Time"
                    type="time"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ mb: 2 }}
                    value={filters.start_time}
                    onChange={(e) => setFilters({ ...filters, start_time: e.target.value })}
                  />
                  <TextField
                    label="End Time"
                    type="time"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ mb: 2 }}
                    value={filters.end_time}
                    onChange={(e) => setFilters({ ...filters, end_time: e.target.value })}
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
                          end_time: '',
                          start_time: '',
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

  export default TicketTATReport;