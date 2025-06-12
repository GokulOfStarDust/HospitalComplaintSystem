import React,{useState, useEffect} from 'react'
import { set, useForm } from 'react-hook-form'
import axios from 'axios'
import { BASE_URL, DEPARTMENT_URL } from './Url'

function Departments() {
const [isEditMode, setIsEditMode] = useState(false);
    const [deptCodeToEdit, setDeptCodeToEdit] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [tableContent, setTableContent] = useState([]);
    const [activeCheckbox, setActiveCheckbox] = useState(false);

    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm();

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
        reset();
    };

    useEffect(() => {
        reset();
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
            <form className='flex flex-col gap-y-4' onSubmit={handleSubmit(formDataHandler)}>
                <div className='flex flex-row justify-start items-center gap-x-4'>
                    <div className='w-[15%] flex flex-col gap-y-2'>
                        <label htmlFor="deptCode" className='text-sm text-secondary'>Department Code</label>
                        <input
                        disabled={isEditMode}
                        className='w-[100%] p-2 outline outline-[1px] outline-gray-400 rounded'
                        id='deptCode' type="text" {...register("department_code", { required: true })} />
                        {errors.departmentCode && <span>This field is required</span>}
                    </div>
                    <div className='w-[15%] flex flex-col gap-y-2'>
                        <label htmlFor="deptName" className='text-sm text-secondary'>Department Name</label>
                        <input 
                        className='w-[100] p-2 outline outline-[1px] outline-gray-400 rounded'
                        id='deptName' type="text" {...register("department_name", { required: true })} />
                        {errors.departmentName && <span>This field is required</span>}
                    </div>
                </div>
                <div className='flex flex-row justify-between items-center gap-x-4 mt-4'>
                    <div className='flex flex-row justify-start items-center gap-x-2'> 
                        <input 
                        className='p-2 border border-gray-300 rounded accent-primary size-5'
                        type="checkbox" name="status" id="deptStatus"
                        checked={activeCheckbox}
                        onChange={(e) => {
                            setActiveCheckbox(e.target.checked);
                            setValue("status", e.target.checked);
                            }
                        }
                        />
                        <label htmlFor="deptStatus" className='text-gray-800 text-sm'>Active</label>
                    </div>
                    <div className='flex flex-row justify-end items-center gap-x-4 w-[30%]'>

                        {isEditMode ?
                            (
                                <button 
                                className='w-[20%] p-2 bg-white text-gray-700 outline outline-[1px] outline-gray-600 rounded '
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditMode(false);
                                    reset({   
                                        department_code: '',
                                        department_name: '',
                                        status: false
                                    });
                                }}
                                type="reset">
                                    Cancel
                                </button>
                            ) : 
                            (
                            <button 
                            className='w-[20%] p-2 bg-white text-gray-700 outline outline-[1px] outline-gray-600 rounded '
                            onClick={(e) => {
                                e.preventDefault();
                                reset({
                                    department_code: '',
                                    department_name: '',
                                    status: false
                                });
                            }}
                            type="reset">
                                Clear
                            </button>
                            )
                        }

                        {
                        isEditMode ?
                            (
                            <button
                            className='w-[20%] p-2 bg-primary text-white rounded'
                            type="submit"
                            >
                                Update
                            </button>
                            ) :
                            (
                            <button
                            className='w-[20%] p-2 bg-primary text-white rounded shadow-2xl'
                            type="submit"
                            >
                                Save
                            </button>
                            )
                        }
                    
                        
                    </div>
                </div>
            </form>
        </section>

        <section className='w-[98%] ml-4 flex flex-col rounded-md bg-white flex-1 min-h-0'>

            <div className='h-14 w-full self-end my-2 pr-9 flex flex-row items-center justify-end gap-x-4'>
                <input className='h-10 w-[20%] focus:outline-none border-b-[1px]' type="text" />
            </div>

            <div className='flex flex-col flex-1 min-h-0'>
                    <table className='font-sans table-fixed border-collapse w-full'>
                        <thead className='!font-extralight'>
                            <tr className='bg-[#FAF9F9] !font-light text-secondary px-4 py-3'>
                                <th className='w-[3%] font-medium text-left px-4 py-3 accent-primary'>
                                    <input type="checkbox"
                                    className='size-5  ml-3' />
                                </th>
                                <th className='text-sm w-[20%] font-medium text-left'>Department Code</th>
                                <th className='text-sm w-[30%] font-medium text-left'>Department Name</th>
                                <th className='text-sm w-[3%] font-medium text-left pl-3'>Actions</th>
                            </tr>
                        </thead>
                    </table>
                    
                    <div className='flex-1 overflow-y-auto'>
                        <table className='font-sans table-fixed border-collapse w-full'>
                            <tbody className='text-secondary'> 
                                {Array.isArray(tableContent.results) && 
                                    tableContent.results.map((record,index)=>{
                                        return(
                                            <tr key={record.department_code + index} className='text-md bg-white border-b border-gray-200 hover:bg-[#FAF9F9] h-2'>
                                                <td className='w-[3%]'>
                                                    <input type="checkbox" 
                                                    name="" id="" className=' accent-primary size-5 ml-7'/>
                                                </td>
                                                
                                                <td className='w-[20%] text-sm text-left'>{record.department_code}</td>
                                                <td className='w-[30%] text-sm text-left'>{record.department_name}</td>
                                                
                                                <td className="w-[3%] align-right py-3">
                                                    <div className="flex items-center justify-start gap-x-2">
                                                        <img src="editIcon.jpg" alt=""
                                                        onClick={() => {
                                                            setIsEditMode(true);
                                                            reset({
                                                                department_code: record.department_code,
                                                                department_name: record.department_name,
                                                                status: record.status === 'active' ? true : false
                                                            });
                                                            setActiveCheckbox(record.status === 'active');
                                                            setDeptCodeToEdit(record.department_code);
                                                        }}  
                                                        className="size-8 flex-shrink-0 hover:cursor-pointer" />
                                                        <img src="deleteIcon.jpg" alt="" 
                                                        className="size-8 flex-shrink-0 hover:cursor-pointer"
                                                        onClick={() => {
                                                            deleteRows(record.department_code)
                                                        }}/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
        </section>
    </main>
  )
}


export default Departments