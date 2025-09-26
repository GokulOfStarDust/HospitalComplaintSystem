import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance';
import { BASE_URL, DEPARTMENT_URL } from '../Url';
import { TextField, Button, Checkbox, FormControlLabel, Box, InputAdornment, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import editIcon from '../../assets/images/editIcon.jpg';
import deleteIcon from '../../assets/images/deleteIcon.jpg';

function MUIDepartments() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [deptCodeToEdit, setDeptCodeToEdit] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [tableContent, setTableContent] = useState({ results: [], count: 0 });
    const [activeCheckbox, setActiveCheckbox] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
            await axiosInstance({
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

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allRowIds = tableContent.results.map((row) => row.department_code);
            setSelectedRows(allRowIds);
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (department_code) => {
        setSelectedRows((prev) =>
            prev.includes(department_code)
                ? prev.filter((id) => id !== department_code)
                : [...prev, department_code]
        );
    };



    const fetchRows = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`${BASE_URL}${DEPARTMENT_URL}?page=${pageNumber}&page_size=${pageSize}`);
            setTableContent({
                results: response.data.results,
                count: response.data.count,
            });
            setIsLoading(false);

            console.log("Table Content:", response.data);
        } catch (error) {
            console.error('Error fetching data:', error.response?.statusText || error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRows();
    }, [pageNumber, pageSize]);

    const deleteRows = async (department_code) => {
        try {
            await axiosInstance.delete(`${BASE_URL}${DEPARTMENT_URL}${department_code}/`);
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

    const columns = [
        {
            field: 'select',
            headerName: '',
            width: 60,
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
                            selectedRows.includes(row.department_code)
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
                    checked={selectedRows.includes(params.row.department_code)}
                    onChange={() => handleRowSelect(params.row.department_code)}
                    sx={{
                        color: '#04B7B1',
                        '&.Mui-checked': { color: '#04B7B1' },
                        transform: 'scale(1)',
                    }}
                />
            ),
        },
        {
            field: 'department_code',
            headerName: 'Department Code',
            flex: 1,
            minWidth: 130,
            renderCell: (params) => <div style={{ fontSize: '0.875rem', color: '#616161' }}>{params.value}</div>,
        },
        {
            field: 'department_name',
            headerName: 'Department Name',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <div style={{ fontSize: '0.875rem', color: '#616161' }}>{params.value}</div>,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            align: 'center',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={() => {
                            setIsEditMode(true);
                            reset({
                                department_code: params.row.department_code,
                                department_name: params.row.department_name,
                                status: params.row.status === 'active',
                            });
                            setActiveCheckbox(params.row.status === 'active');
                            setDeptCodeToEdit(params.row.department_code);
                        }}
                        sx={{ padding: 1 }}
                    >
                        <img src={editIcon} alt="Edit" className="size-8 flex-shrink-0 hover:cursor-pointer" />
                    </IconButton>
                    <IconButton
                        onClick={() => deleteRows(params.row.department_code)}
                        sx={{ padding: 0 }}
                    >
                        <img src={deleteIcon} alt="Delete" className="size-8 flex-shrink-0 hover:cursor-pointer" />
                    </IconButton>
                </Box>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    return (
        <main className="w-screen h-[98%] flex flex-col gap-y-4 p-4 font-sans">
            <section className="w-[100%] flex flex-col rounded-md bg-white p-4">
                <form data-testid="department-form" className="flex flex-col gap-y-4 pt-3" onSubmit={handleSubmit(formDataHandler)}>
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
                                        id="deptCode"
                                        label="Department Code"
                                        variant="outlined"
                                        size="small"
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
                                        id="deptName"
                                        label="Department Name"
                                        variant="outlined"
                                        size="small"
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
                                            id="deptStatus"
                                            checked={activeCheckbox}
                                            onChange={(e) => {
                                                setActiveCheckbox(e.target.checked);
                                                setValue('status', e.target.checked);
                                            }}
                                            color="primary"
                                        />
                                    }
                                    label="Active"
                                />
                            )}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 2, width: '30%' }}>
                            {isEditMode ? (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ width: '100px', height: '40px', fontSize: '0.875rem', fontWeight: '500' }}
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
                                    variant="outlined"
                                    sx={{ width: '100px', height: '40px', fontSize: '0.875rem', fontWeight: '500' }}
                                    color="secondary"
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
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ color: '#fff', width: '100px', height: '40px', fontSize: '0.875rem', fontWeight: '500' }}
                            >
                                {isEditMode ? 'Update' : 'Save'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </section>

            <section className="w-[100%]  flex flex-col rounded-md bg-white flex-1 min-h-0">
                <Box sx={{ height: 56, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2, pt:1, pr: 3 }}>
                    <TextField
                        variant="standard"
                        size="small"
                        placeholder="Search"
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

                <Box sx={{ flex: 1, minHeight: 0, width: '100%', overflow: 'hidden' }}>
                    <DataGrid
                        rows={Array.isArray(tableContent.results) ? tableContent.results.map((row) => ({
                            id: row.department_code,
                            ...row,
                        })) : []}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        paginationMode="server"
                        loading={isLoading}
                        rowCount={tableContent.count || 0}
                        paginationModel={{ page: pageNumber - 1, pageSize }}
                        onPaginationModelChange={(model) => {
                            setPageNumber(model.page + 1);
                            setPageSize(model.pageSize);
                        }}
                        disableRowSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-root': {
                                fontSize: '0.875rem',
                                fontFamily: 'sans-serif',
                                width: '100%',
                                height: '100%',
                            },
                            '& .MuiDataGrid-main': {
                                width: '100%',
                                overflow: 'hidden',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f5f5',
                                color: '#616161',
                                fontWeight: 'medium',
                                minWidth: 0,
                                overflow: 'hidden',
                            },
                            '& .MuiDataGrid-cell': {
                                padding: '0.5rem 0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                overflowX: 'hidden',
                                overflowY: 'auto',
                            },
                            '& .MuiDataGrid-container--top': {
                                overflow: 'hidden',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                minWidth: 0,
                                overflow: 'hidden',
                            },
                            border: 'none',
                            width: '100%',
                        }}
                    />
                </Box>
            </section>
        </main>
    );
}

export default MUIDepartments;