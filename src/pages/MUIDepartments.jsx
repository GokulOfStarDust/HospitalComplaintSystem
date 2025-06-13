import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { BASE_URL, DEPARTMENT_URL } from './Url';
import { TextField, Button, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

function MUIDepartments() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [deptCodeToEdit, setDeptCodeToEdit] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [tableContent, setTableContent] = useState([]);
    const [activeCheckbox, setActiveCheckbox] = useState(false);

    const {
        control,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            department_code: '',
            department_name: '',
            status: false,
        },
    });

    const formDataHandler = async (data) => {
        const METHOD = isEditMode ? 'put' : 'post';
        const url = isEditMode ? `${BASE_URL}${DEPARTMENT_URL}${deptCodeToEdit}/` : `${BASE_URL}${DEPARTMENT_URL}`;
        data.status = data.status ? 'active' : 'inactive';

        try {
            const response = await axios({
                method: METHOD,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            reset({
                department_code: '',
                department_name: '',
                status: false,
            });
            fetchRows();
            setActiveCheckbox(false);
            setDeptCodeToEdit(null);
            setIsEditMode(false);
        } catch (error) {
            console.error('Error:', error.response?.statusText || error.message);
        }
    };

    useEffect(() => {
        reset({
            department_code: '',
            department_name: '',
            status: false,
        });
    }, []);

    const fetchRows = async () => {
        try {
            const response = await axios.get(`${BASE_URL}${DEPARTMENT_URL}?page=${pageNumber}`);
            setTableContent(response.data);
            console.log("Table Content:", response.data);
        } catch (error) {
            console.error('Error fetching data:', error.response?.statusText || error.message);
        }
    };

    useEffect(() => {
        fetchRows();
    }, [pageNumber]);

    const deleteRows = async (department_code) => {
        try {
            await axios.delete(`${BASE_URL}${DEPARTMENT_URL}${department_code}/`);
            console.log("Row deleted successfully");
            setTableContent((prev) => ({
                ...prev,
                results: prev.results.filter((item) => item.department_code !== department_code),
            }));
            fetchRows();
        } catch (error) {
            console.error('Error deleting data:', error.response?.statusText || error.message);
        }
    };

    return (
        <main className='w-screen h-screen flex flex-col gap-y-4 p-4 font-sans'>
            <section className='w-[100%] flex flex-col rounded-md bg-white p-4'>
                <form className='flex flex-col gap-y-4 pt-3' onSubmit={handleSubmit(formDataHandler)}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: '15%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Controller
                                name="department_code"
                                control={control}
                                rules={{ required: 'Department Code is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        disabled={isEditMode}
                                        id='deptCode'
                                        label='Department Code'
                                        variant='outlined'
                                        size='small'
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.department_code}
                                        helperText={errors.department_code?.message}
                                    />
                                )}
                            />
                        </Box>
                        <Box sx={{ width: '15%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Controller
                                name="department_name"
                                control={control}
                                rules={{ required: 'Department Name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id='deptName'
                                        label='Department Name'
                                        variant='outlined'
                                        size='small'
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        error={!!errors.department_name}
                                        helperText={errors.department_name?.message}
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 2 }}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...field}
                                            id='deptStatus'
                                            checked={activeCheckbox}
                                            onChange={(e) => {
                                                setActiveCheckbox(e.target.checked);
                                                setValue("status", e.target.checked);
                                            }}
                                            color='primary'
                                        />
                                    }
                                    label='Active'
                                />
                            )}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 2, width: '30%' }}>
                            {isEditMode ? (
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    sx={{width: '100px', height: '40px', fontSize: '0.875rem', fontWeight: '500'}}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsEditMode(false);
                                        reset({
                                            department_code: '',
                                            department_name: '',
                                            status: false,
                                        });
                                    }}
                                >
                                    Cancel
                                </Button>
                            ) : (
                                <Button
                                    variant='outlined'
                                    sx={{width: '100px', height: '40px', fontSize: '0.875rem', fontWeight: '500'}}
                                    color='secondary'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        reset({
                                            department_code: '',
                                            department_name: '',
                                            status: false,
                                        });
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                            <Button
                                variant='contained'
                                color='primary'
                                type='submit'
                                sx={{color: '#fff', width: '100px', height: '40px', fontSize: '0.875rem', fontWeight: '500'}}
                            >
                                {isEditMode ? 'Update' : 'Save'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </section>

            <section className='w-[98%] ml-4 flex flex-col rounded-md bg-white flex-1 min-h-0'>
                <Box sx={{ height: 56, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2, my: 1, pr: 3 }}>
                    <TextField
                        variant='standard'
                        size='small'
                        placeholder='Search'
                        sx={{ 
                            width: '20%',
                            '& .MuiInput-root': {
                                borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                '&:hover': {
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
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

                <TableContainer component={Paper} className='flex flex-col flex-1 min-h-0'>
                    <Table sx={{  width: '100%' }} className='font-sans table-fixed border-collapse w-full'>
                        <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <TableRow sx={{ backgroundColor: '#FAF9F9', height: '50px', width: '100%' }}>
                                <TableCell style={{ width: '3%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                                    <Checkbox color='primary' />
                                </TableCell>
                                <TableCell style={{ width: '20%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Department Code</TableCell>
                                <TableCell style={{ width: '30%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Department Name</TableCell>
                                <TableCell style={{ width: '3%' }} sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{width:'100%', flexShrink: '' }} >
                            {Array.isArray(tableContent.results) &&
                                tableContent.results.map((record, index) => (
                                    <TableRow key={record.department_code + index} hover sx={{width: '100%'}}>
                                        <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                                            <Checkbox color='primary' />
                                        </TableCell>
                                        <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>{record.department_code}</TableCell>
                                        <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161'}}>{record.department_name}</TableCell>
                                        <TableCell sx={{ paddingX: '0.5rem', paddingRight :'0.85rem', fontSize: '0.875rem', color: '#616161' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <IconButton
                                                    onClick={() => {
                                                        setIsEditMode(true);
                                                        reset({
                                                            department_code: record.department_code,
                                                            department_name: record.department_name,
                                                            status: record.status === 'active' ? true : false,
                                                        });
                                                        setActiveCheckbox(record.status === 'active');
                                                        setDeptCodeToEdit(record.department_code);
                                                    }}
                                                    sx={{ padding: 0 }}
                                                >
                                                    <img src="editIcon.jpg" alt="Edit" className="size-8 flex-shrink-0 hover:cursor-pointer" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => deleteRows(record.department_code)}
                                                    sx={{ padding: 0 }}
                                                >
                                                    <img src="deleteIcon.jpg" alt="Edit" className="size-8 flex-shrink-0 hover:cursor-pointer" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </section>
        </main>
    );
}

export default MUIDepartments;