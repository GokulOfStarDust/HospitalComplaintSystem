import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { BASE_URL, DEPARTMENT_URL, ISSUE_CATEGORY_URL } from './Url';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


function MUIIssueCategory() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [issueCodeToEdit, setIssueCodeToEdit] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [tableContent, setTableContent] = useState({ results: [] });
  const [departments, setDepartments] = useState([]);

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
      const response = await axios.get(`${BASE_URL}${DEPARTMENT_URL}`);
      setDepartments(response.data.results || response.data);
      console.log('Departments:', response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching departments:', error.response?.statusText || error.message);
    }
  };

  const fetchRows = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${ISSUE_CATEGORY_URL}?page=${pageNumber}`);
      setTableContent(response.data);
      console.log('Table Content:', response.data);
    } catch (error) {
      console.error('Error fetching rows:', error.response?.statusText || error.message);
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
      const response = await axios({
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
      await axios.delete(`${BASE_URL}${ISSUE_CATEGORY_URL}${issue_category_code}/`);
      console.log('Row deleted successfully');
      fetchRows();
    } catch (error) {
      console.error('Error deleting data:', error.response?.statusText || error.message);
      alert('Failed to delete issue category.');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchRows();
  }, [pageNumber]);

  return (
    <main className="w-screen h-screen flex flex-col gap-y-4 p-4 font-sans">
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
      <Box component="section" className="w-[98%] ml-4 flex flex-col rounded-md bg-white flex-1 min-h-0">
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
        <Box className="flex flex-col flex-1 min-h top-10">
          <TableContainer component={Paper} className="flex flex-col flex-1 min-h-0 font-sans">
            <Table className="table-fixed w-full">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#FAF9F9', height: '50px' }}>
                  <TableCell className="w-[3%] px-4 py-3" sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    <Checkbox sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />
                  </TableCell>
                  <TableCell className="text-sm w-[17%]" sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Issue Category Code
                  </TableCell>
                  <TableCell className="text-sm w-[19%]" sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Department Name
                  </TableCell>
                  <TableCell className="text-sm w-[20%]" sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Issue Category Name
                  </TableCell>
                  <TableCell className="text-sm w-[3.5%] pl-3" sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ color: '#6B7280' }}>
                {Array.isArray(tableContent.results) && tableContent.results.length > 0 ? (
                  tableContent.results.map((record, index) => (
                    <TableRow
                      key={record.issue_category_code + index}
                      sx={{
                        '&:hover': { backgroundColor: '#FAF9F9' },
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        <Checkbox sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />
                      </TableCell>
                      <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        {record.issue_category_code}
                      </TableCell>
                      <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        {record.department_name}
                      </TableCell>
                      <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        {record.issue_category_name}
                      </TableCell>
                      <TableCell sx={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            onClick={() => {
                              setIsEditMode(true);
                              reset({
                                issue_category_code: record.issue_category_code,
                                issue_category_name: record.issue_category_name,
                                department_name: record.department_name,
                                status: record.status === 'active',
                              });
                              setIssueCodeToEdit(record.issue_category_code);
                            }}
                            sx={{ padding: 0 }}
                          >
                            <img src="editIcon.jpg" alt="Edit" className="size-8 flex-shrink-0 hover:cursor-pointer" />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteRows(record.issue_category_code)}
                            sx={{ padding: 0 }}
                          >
                            <img src="deleteIcon.jpg" alt="Delete" className="size-8 flex-shrink-0 hover:cursor-pointer" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', padding: '1rem', color: '#6B7280' }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </main>
  );
}

export default MUIIssueCategory;