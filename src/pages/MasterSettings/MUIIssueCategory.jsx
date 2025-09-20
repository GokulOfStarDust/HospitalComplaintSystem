import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance';
import { BASE_URL, DEPARTMENT_URL, ISSUE_CATEGORY_URL } from '../Url';
import editIcon from '../../assets/images/editIcon.jpg';
import deleteIcon from '../../assets/images/deleteIcon.jpg';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';


function MUIIssueCategory() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [issueCodeToEdit, setIssueCodeToEdit] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [tableContent, setTableContent] = useState({ results: [], count: 0 });
  const [departments, setDepartments] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const {
    register,
    reset,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      issue_category_code: '',
      issue_category_name: '',
      department_name: '',
      status: false,
    },
  });

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}${DEPARTMENT_URL}`);
      setDepartments(response.data.results || response.data);
      console.log('Departments:', response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching departments:', error.response?.statusText || error.message);
    }
  };

  const fetchRows = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}${ISSUE_CATEGORY_URL}?limit=${pageSize}&offset=${(pageNumber - 1) * pageSize}`);
      setTableContent({
        results: response.data.results || [],
        count: response.data.count || 0,
      });
      console.log('Table Content:', response.data);
    } catch (error) {
      console.error('Error fetching rows:', error.response?.statusText || error.message);
      setTableContent({ results: [], count: 0 });
    }
  };

  const formDataHandler = async (data) => {
    console.log('Form Data:', data);
    const method = isEditMode ? 'patch' : 'post';
    const url = isEditMode
      ? `${BASE_URL}${ISSUE_CATEGORY_URL}${issueCodeToEdit}/`
      : `${BASE_URL}${ISSUE_CATEGORY_URL}`;

    const department = departments.find((dept) => dept.department_name === data.department_name);
    if (!department && data.department_name) {
      alert('Selected department not found. Please select a valid department.');
      return;
    }

    const payload = {
      issue_category_code: data.issue_category_code,
      issue_category_name: data.issue_category_name,
      department: department ? department.department_code : null,
      status: data.status ? 'active' : 'inactive',
    };

    try {
      const response = await axiosInstance({
        method,
        url,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Form submitted successfully:', response.data);
      reset({
        issue_category_code: '',
        issue_category_name: '',
        department_name: '',
        status: false,
      });
      fetchRows();
      fetchDepartments();
      setIssueCodeToEdit(null);
      setIsEditMode(false);
      alert('Issue category saved successfully!');
    } catch (error) {
      if (error.response) {
        console.error('Error submitting form:', error.response.data);
        alert(`Failed to submit form: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('Error: No response from server:', error.message);
        alert('No response from server. Please check your connection.');
      } else {
        console.error('Error submitting form:', error.message);
        alert('An error occurred while submitting the form.');
      }
    }
  };

  const deleteRows = async (issue_category_code) => {
    try {
      await axiosInstance.delete(`${BASE_URL}${ISSUE_CATEGORY_URL}${issue_category_code}/`);
      console.log('Row deleted successfully');
      fetchRows();
    } catch (error) {
      console.error('Error deleting data:', error.response?.statusText || error.message);
      alert('Failed to delete issue category.');
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allRowIds = tableContent.results.map((row) => row.issue_category_code);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (issue_category_code) => {
    setSelectedRows((prev) =>
      prev.includes(issue_category_code)
        ? prev.filter((id) => id !== issue_category_code)
        : [...prev, issue_category_code]
    );
  };

  useEffect(() => {
    fetchDepartments();
    fetchRows();
  }, [pageNumber, pageSize]);

  const columns = [
    {
      field: 'select',
      headerName: '',
      width: 70,
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
              selectedRows.includes(row.issue_category_code)
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
          checked={selectedRows.includes(params.row.issue_category_code)}
          onChange={() => handleRowSelect(params.row.issue_category_code)}
          sx={{
            color: '#04B7B1',
            '&.Mui-checked': { color: '#04B7B1' },
            transform: 'scale(1)',
          }}
        />
      ),
    },
    {
      field: 'issue_category_code',
      headerName: 'Issue Category Code',
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
      field: 'issue_category_name',
      headerName: 'Issue Category Name',
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
                issue_category_code: params.row.issue_category_code,
                issue_category_name: params.row.issue_category_name,
                department_name: params.row.department_name,
                status: params.row.status === 'active',
              });
              setIssueCodeToEdit(params.row.issue_category_code);
            }}
            sx={{ padding: 1 }}
          >
            <img src={editIcon} alt="Edit" className="size-8 flex-shrink-0 hover:cursor-pointer" />
          </IconButton>
          <IconButton
            onClick={() => deleteRows(params.row.issue_category_code)}
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
      <Box component="section" className="w-[100%] flex flex-col rounded-md bg-white p-4">
        <form className="flex flex-col gap-y-4 pt-3" onSubmit={handleSubmit(formDataHandler)}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: '15%', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                disabled={isEditMode}
                id="issueCode"
                label="Issue Category Code"
                variant="outlined"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                {...register('issue_category_code', { required: 'Issue category code is required' })}
                error={!!errors.issue_category_code}
                helperText={errors.issue_category_code?.message}
                className="w-[100%]"
              />
            </Box>
            <Box className="w-[15%] flex flex-col gap-y-2">
              <FormControl fullWidth size="small" error={!!errors.department_name}>
                <InputLabel id="department-label" shrink>
                  Department
                </InputLabel>
                <Controller
                  name="department_name"
                  control={control}
                  rules={{ required: 'Department is required' }}
                  render={({ field }) => (
                    <Select
                      labelId="department-label"
                      id="department"
                      label="Department"
                      notched
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue('department_name', e.target.value);
                      }}
                      value={field.value || ''}
                    >
                      <MenuItem value="">Select Department</MenuItem>
                      {departments.map((item) => (
                        <MenuItem key={item.department_code} value={item.department_name}>
                          {item.department_name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.department_name && (
                  <span className="text-red-500 text-sm">{errors.department_name.message}</span>
                )}
              </FormControl>
            </Box>
            <Box className="w-[15%] flex flex-col gap-y-2">
              <TextField
                id="issueName"
                label="Issue Category Name"
                variant="outlined"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                {...register('issue_category_name', { required: 'Issue category name is required' })}
                error={!!errors.issue_category_name}
                helperText={errors.issue_category_name?.message}
                className="w-[100%]"
              />
            </Box>
          </Box>
          <Box className="flex flex-row justify-between items-center gap-x-4 mt-4">
            <Box className="flex flex-row justify-start items-center gap-x-2">
              <FormControlLabel
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="deptStatus"
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                        sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    )}
                  />
                }
                label="Active"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: '#374151' } }}
              />
            </Box>
            <Box className="flex flex-row justify-end items-center gap-x-4 w-[30%]">
              {isEditMode ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  className="w-[20%]"
                  onClick={() => {
                    setIsEditMode(false);
                    reset({
                      issue_category_code: '',
                      issue_category_name: '',
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
                  color="secondary"
                  className="w-[20%]"
                  onClick={() => {
                    reset({
                      issue_category_code: '',
                      issue_category_name: '',
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
                className="w-[20%]"
                sx={{ backgroundColor: 'primary.main', color: 'white' }}
              >
                {isEditMode ? 'Update' : 'Save'}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
      <Box component="section" className="w-[100%] flex flex-col rounded-md bg-white flex-1 min-h-0">
        <Box sx={{ height: 56, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2, pt: 1, pr: 3 }}>
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
              id: row.issue_category_code,
              ...row,
            })) : []}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            paginationMode="server"
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
      </Box>
    </main>
  );
}

export default MUIIssueCategory;