import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { BASE_URL, COMPLAINT_URL } from '../Url';
import { TextField, Button, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography, InputAdornment } from '@mui/material';
import { table } from '@uiw/react-md-editor';

function TicketTATReport() {
    const [pageNumber, setPageNumber] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [tableContent, setTableContent] = useState([]);
    const [tableRows, setTableRows] = useState([]);


    // const fetchRows = async () => {
    //     try {
    //         const response = await axios.get(`${BASE_URL}${COMPLAINT_URL}?limit=${rowsPerPage}&offset${pageNumber * rowsPerPage}`);
    //         setTableContent(response);
    //         console.log("Table Content:", response.data);
    //     } catch (error) {
    //         console.error('Error fetching data:', error.response?.statusText || error.message);
    //     }
    // };

    useEffect(() => {
        fetchRows();
    }, [pageNumber]);

    handleChangePage = (event, newPage) => {
        setPageNumber(newPage);
        console.log("Page Number:", newPage);
    };

    handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageNumber(0);
        console.log("Rows Per Page:", event.target.value);
    };

useEffect(() => {
  console.log("Table Rows:", tableRows);
}, [tableRows]);


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
                <TableContainer component={Paper} className='flex flex-col flex-1 min-h-0'>
                    <Table sx={{  width: '100%' }} className='font-sans table-fixed border-collapse w-full'>
                        <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <TableRow sx={{ backgroundColor: '#FAF9F9', height: '50px', width: '100%' }}>

                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Ticket ID</TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Submitted At</TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Resolved At</TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>TAT</TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Priority</TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Status</TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody sx={{width:'100%', flexShrink: '' }} >
                            
                                    <TableRow key={record.department_code + index} hover sx={{width: '100%'}}>
                                  
                                        <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}></TableCell>
                                        <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161'}}></TableCell>
                                        <TableCell sx={{ paddingX: '0.5rem', paddingRight :'0.85rem', fontSize: '0.875rem', color: '#616161' }}> </TableCell>
                                        <TableCell sx={{ paddingX: '0.5rem', paddingRight :'0.85rem', fontSize: '0.875rem', color: '#616161' }}> </TableCell>
                                        <TableCell sx={{ paddingX: '0.5rem', paddingRight :'0.85rem', fontSize: '0.875rem', color: '#616161' }}> </TableCell>
                                        <TableCell sx={{ paddingX: '0.5rem', paddingRight :'0.85rem', fontSize: '0.875rem', color: '#616161' }}> </TableCell>


                                    </TableRow>
                            
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
                />
            </section>
        </main>
    );
}

export default TicketTATReport