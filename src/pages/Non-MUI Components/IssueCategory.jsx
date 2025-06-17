import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { BASE_URL, DEPARTMENT_URL, ISSUE_CATEGORY_URL } from '../Url';

function IssueCategory() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [issueCodeToEdit, setIssueCodeToEdit] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [tableContent, setTableContent] = useState([]);
  const [activeCheckbox, setActiveCheckbox] = useState(false);
  const [departments, setDepartments] = useState([]);

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

    // Transform department_name to department_code
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
      setActiveCheckbox(false);
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
      fetchRows(); // Refresh table after deletion
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
    <main className='w-screen h-screen flex flex-col gap-y-4 p-4 font-sans'>
      <section className='w-[100%] flex flex-col rounded-md bg-white p-4'>
        <form className='flex flex-col gap-y-4' onSubmit={handleSubmit(formDataHandler)}>
          <div className='flex flex-row justify-start items-center gap-x-4'>
            <div className='w-[15%] flex flex-col gap-y-2'>
              <label htmlFor="issueCode" className='text-sm text-secondary'>Issue Category Code</label>
              <input
                disabled={isEditMode}
                className='w-[100%] p-2 border border-gray-300 rounded-md'
                id='issueCode'
                type='text'
                {...register('issue_category_code', { required: 'Issue category code is required' })}
              />
              {errors.issue_category_code && (
                <span className='text-red-500 text-sm'>{errors.issue_category_code.message}</span>
              )}
            </div>
            <div className='w-[15%] flex flex-col gap-y-2'>
              <label htmlFor="department" className='text-sm text-secondary'>Department</label>
              <select
                className='w-[100%] p-2 border border-gray-300 rounded-md'
                id='department'
                {...register('department_name', { required: 'Department is required' })}
              >
                <option value=''>Select Department</option>
                {departments.map((item) => (
                  <option key={item.department_code} value={item.department_name}>
                    {item.department_name}
                  </option>
                ))}
              </select>
              {errors.department_name && (
                <span className='text-red-500 text-sm'>{errors.department_name.message}</span>
              )}
            </div>
            <div className='w-[15%] flex flex-col gap-y-2'>
              <label htmlFor="issueName" className='text-sm text-secondary'>Issue Category Name</label>
              <input
                className='w-[100%] p-2 border border-gray-300 rounded-md'
                id='issueName'
                type='text'
                {...register('issue_category_name', { required: 'Issue category name is required' })}
              />
              {errors.issue_category_name && (
                <span className='text-red-500 text-sm'>{errors.issue_category_name.message}</span>
              )}
            </div>
          </div>
          <div className='flex flex-row justify-between items-center gap-x-4 mt-4'>
            <div className='flex flex-row justify-start items-center gap-x-2'>
              <input
                className='p-2 border border-gray-300 rounded accent-primary size-5'
                type='checkbox'
                name='status'
                id='deptStatus'
                checked={activeCheckbox}
                onChange={(e) => {
                  setActiveCheckbox(e.target.checked);
                  setValue('status', e.target.checked);
                }}
              />
              <label htmlFor='deptStatus' className='text-gray-800 text-sm'>Active</label>
            </div>
            <div className='flex flex-row justify-end items-center gap-x-4 w-[30%]'>
              {isEditMode ? (
                <button
                  className='w-[20%] p-2 bg-white text-gray-700 border border-gray-600 rounded'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditMode(false);
                    reset({
                      issue_category_code: '',
                      issue_category_name: '',
                      department_name: '',
                      status: false,
                    });
                  }}
                  type='reset'
                >
                  Cancel
                </button>
              ) : (
                <button
                  className='w-[20%] p-2 bg-white text-gray-700 border border-gray-600 rounded'
                  onClick={(e) => {
                    e.preventDefault();
                    reset({
                      issue_category_code: '',
                      issue_category_name: '',
                      department_name: '',
                      status: false,
                    });
                  }}
                  type='reset'
                >
                  Clear
                </button>
              )}
              <button
                className='w-[20%] p-2 bg-primary text-white rounded'
                type='submit'
              >
                {isEditMode ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </section>
      <section className='w-[98%] ml-4 flex flex-col rounded-md bg-white flex-1 min-h-0'>
        <div className='h-14 w-full self-end my-2 pr-9 flex flex-row items-center justify-end gap-x-4'>
          <input className='h-10 w-[20%] focus:outline-none border-b-[1px]' type='text' />
        </div>
        <div className='flex flex-col flex-1 min-h-0'>
          <table className='font-sans table-fixed border-collapse w-full'>
            <thead className='!font-extralight'>
              <tr className='bg-[#FAF9F9] !font-light text-secondary px-4 py-3'>
                <th className='w-[3%] font-medium text-left px-4 py-3 accent-primary'>
                  <input type='checkbox' className='size-5 ml-3' />
                </th>
                <th className='text-sm w-[20%] font-medium text-left'>Issue Category Code</th>
                <th className='text-sm w-[25%] font-medium text-left'>Department Name</th>
                <th className='text-sm w-[20%] font-medium text-left'>Issue Category Name</th>
                <th className='text-sm w-[3.5%] font-medium text-left pl-3'>Actions</th>
              </tr>
            </thead>
          </table>
          <div className='flex-1 overflow-y-auto'>
            <table className='font-sans table-fixed border-collapse w-full'>
              <tbody className='text-secondary'>
                {Array.isArray(tableContent.results) &&
                  tableContent.results.map((record, index) => (
                    <tr
                      key={record.issue_category_code + index}
                      className='text-md bg-white border-b border-gray-200 hover:bg-[#FAF9F9] h-2'
                    >
                      <td className='w-[3%]'>
                        <input type='checkbox' name='' id='' className='accent-primary size-5 ml-7' />
                      </td>
                      <td className='w-[20%] text-sm text-left'>{record.issue_category_code}</td>
                      <td className='w-[25%] text-sm text-left'>{record.department_name}</td>
                      <td className='w-[20%] text-sm text-left'>{record.issue_category_name}</td>
                      <td className='w-[3.5%] align-right py-3'>
                        <div className='flex items-center justify-start gap-x-2'>
                          <img
                            src='editIcon.jpg'
                            alt=''
                            onClick={() => {
                              setIsEditMode(true);
                              reset({
                                issue_category_code: record.issue_category_code,
                                issue_category_name: record.issue_category_name,
                                department_name: record.department_name,
                                status: record.status === 'active',
                              });
                              setActiveCheckbox(record.status === 'active');
                              setIssueCodeToEdit(record.issue_category_code);
                            }}
                            className='size-8 flex-shrink-0 hover:cursor-pointer'
                          />
                          <img
                            src='deleteIcon.jpg'
                            alt=''
                            className='size-8 flex-shrink-0 hover:cursor-pointer'
                            onClick={() => deleteRows(record.issue_category_code)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

export default IssueCategory;