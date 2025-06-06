    import React, { useState, useEffect} from 'react'
    import { useSearchParams } from 'react-router';

    function TicketSystem() {

        const [tableContent, setTableContent] = React.useState([]);
        const [pageNumber, setPageNumber] = useState(1);
        const [searchParams, setSearchParams] = useSearchParams();

        const handleFilterChange = (e) => {
            const { name, value } = e.target;
            if (value) {
                searchParams.set(name, value);
            }
            else {
                searchParams.delete(name);
            }
            setSearchParams(searchParams);
        };

        useEffect(() =>{
            
            const params = Object.fromEntries(searchParams.entries());
            console.log("Search Params:", params);
            const queryString = new URLSearchParams(params).toString();
            fetchFilteredRows(queryString);
        },[searchParams])

        const fetchFilteredRows = async (queryString) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/complaints/?page=${pageNumber}${queryString ? `&${queryString}` : ''}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTableContent(data);
                console.log("Filtered Table Content:", data);
            } catch (error) {
                console.error('Error fetching filtered data:', error);
            }
        };

        const fetchRows = async (pageNumber) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/complaints/?page=${pageNumber}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTableContent(data);
                console.log("Table Content:", data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        useEffect(() => {
            fetchRows(pageNumber);
            
        }, [pageNumber]);

        const deleteRows = async (ticket_id) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/complaints/${ticket_id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = response;
                console.log("Delete Response:", data);
                fetchRows(pageNumber);
                setTableContent(prev => ({
                            ...prev, results: prev.results.filter(item => item.ticket_id !== ticket_id)
                        }));

            } catch (error) {
                console.error('Error deleting data:', error);
            }
        };
        
        
    return (
        <main className='flex flex-col overflow-x-hidden'>
            <section className='w-screen flex flex-row items-center p-4 gap-x-3'>
                <div className='flex flex-col items-center justify-center bg-white py-5 px-8 gap-y-1 rounded-sm outline outline-[1px] outline-gray-300'>
                    <p className='text-xl font-semibold'>10</p>
                    <p className='text-xs text-secondary'>Total Tickets</p>
                </div>
                <div className='flex flex-col items-center justify-center bg-white py-5 px-6 gap-y-1 rounded-sm outline outline-[1px] outline-gray-300'>
                    <p className='text-xl font-semibold'>06</p>
                    <p className='text-xs text-secondary'>Resolved Tickets</p>
                </div>
                <div className='flex flex-col items-center justify-center bg-white py-5 px-8 gap-y-1 rounded-sm outline outline-[1px] outline-gray-300'>
                    <p className='text-xl font-semibold'>01</p>
                    <p className='text-xs text-secondary'>Priority High</p>
                </div>
            </section>
                
            <section className='w-screen'>
                <form className='w-screen flex flex-row gap-x-4 p-4'>
                    <div className='w-[10%]'>
                        <label className='!sr-only' htmlFor="ward">Select ward</label>
                        <select 
                        onChange={handleFilterChange}
                        value={searchParams.get('ward') || ''}
                        className='w-full p-2 rounded-sm outline outline-[1px] outline-gray-300' name="ward" id="ward">
                            <option value="" >Filter Ward</option>
                            <option value="General">General</option>
                            <option value="Operation">Operation</option>
                            <option value="ICU">ICU</option>
                        </select>
                    </div>

                    <div className='w-[10%]'>
                        <label className='!sr-only' htmlFor="status">Select status</label>
                        <select 
                        onChange={handleFilterChange}
                        value={searchParams.get('status') || ''}
                        className='w-full p-2 rounded-sm outline outline-[1px] outline-gray-300' name="status" id="status">
                            <option value="">Filter Status</option>
                            <option value="open">Open</option>
                            <option value="on_hold">On Hold</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    <div className='w-[10%]'>
                        <label className='!sr-only' htmlFor="issue">Select issue</label>
                        <select 
                        onChange={handleFilterChange}
                        value={searchParams.get('issue_type') || ''}
                        className='w-full p-2 rounded-sm outline outline-[1px] outline-gray-300' name="issue_type" id="issue">
                            <option value="">Filter Issue</option>
                            <option value="cleanliness">Cleanliness</option>
                            <option value="electrical">Electrical</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className='w-[10%]'>
                        <label className='!sr-only' htmlFor="department">Select Department</label>
                        <select
                        onChange={handleFilterChange}
                        value={searchParams.get('department') || ''}
                        className='w-full p-2 rounded-sm outline outline-[1px] outline-gray-300' name="department" id="department">
                            <option value="">Filter Department</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Security">Security</option>
                        </select>
                    </div>
                    <div className='w-[10%]'>
                        <label className='!sr-only' htmlFor="department">Select Priority</label>
                        <select 
                        onChange={handleFilterChange}
                        value={searchParams.get('priority') || ''}
                        className='w-full p-2 rounded-sm outline outline-[1px] outline-gray-300' name="priority" id="priority">
                            <option value="">Filter Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            
                        </select>
                    </div>

                </form>

            </section>

            <section className='w-[98%] ml-4 flex flex-col rounded-md bg-white'>
                    <div className='h-14 w-full self-end my-2 pr-9 flex flex-row items-center justify-end gap-x-4'>
                        <input className='h-10 w-[20%] focus:outline-none border-b-[1px]  ' type="text" />
                    </div>
                    <table className='font-sans table-fixed border-collapse w-full'>
                        <thead className='!font-extralight'>
                            <tr className='bg-[#FAF9F9] !font-light text-secondary px-4 py-3'>
                                <th className='w-[3%] font-medium text-left px-4 py-3 accent-primary'>
                                    <input type="checkbox"
                                    className='size-5  ml-3' />
                                </th>
                                <th className='text-sm w-[5%] font-medium text-left'>Ticket ID</th>
                                <th className='text-sm w-[5%] font-medium text-left'>Room Details</th>
                                <th className='text-sm w-[5%] font-medium text-left'>Submitted By</th>
                                <th className='text-sm w-[5%] font-medium text-left'>Issue Type</th>
                                <th className='text-sm w-[14%] font-medium text-left'>Issue Description</th>
                                <th className='text-sm w-[5%] font-medium text-left'>Ticket Status</th>
                                <th className='text-sm w-[5.5%] font-medium text-left'>Assigned Department</th>
                                <th className='text-sm w-[6%] font-medium text-center'>Priority</th>
                                <th className='text-sm w-[6%] font-medium text-left'>Resolved Details</th>
                                <th className='text-sm w-[5%] font-medium text-left'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-secondary overflow-y-auto h-98'> 
                            {Array.isArray(tableContent.results) && 
                                tableContent.results.map((record,index)=>{
                                    return(
                                        <tr key={record.ticket_id} className='text-md bg-white border-b border-gray-200 hover:bg-[#FAF9F9] h-5'>
                                            <td className=''>
                                                <input type="checkbox" 
                                                name="" id="" className=' accent-primary size-5 ml-7'/>
                                            </td>
                                            <td className='py-3 text-left'>{record.ticket_id}</td>
                                            <td className='py-3 text-left'>
                                                <div className='flex flex-col gap-y-1'>
                                                    <span>{record.room_number}</span>
                                                    <span className='text-xs text-secondary'>{record.ward}</span>
                                                </div>
                                            </td>
                                            <td className='py-3 text-left'>{record.submitted_by}</td>
                                            <td className='py-3 text-left'>{record.issue_type}</td>
                                            <td className='py-3 text-left'>{record.description}</td>
                                            <td className='py-3 text-left'>{record.status}</td>
                                            <td className='py-3 text-left'>{record.assigned_department}</td>
                                            <td className='py-3 text-center'>
                                                <div className={`w-[68%] mx-auto py-1 flex flex-row justify-center items-center rounded-xl ${record.priority === 'high' ? "outline outline-[1px] outline-red-500 text-red-500" : record.priority === 'medium' ? 'outline outline-[1px] outline-[#29B6F6] text-[#29B6F6]' : 'outline outline-[1px] outline-green-500 text-green-500'} `}>
                                                    {record.priority}
                                                </div>
                                                
                                            </td>
                                            <td className='align-middle py-3 pb-4 text-left'>
                                                <div>
                                                    <p className='text-md text-secondary'>{record.resolved_by || 'Person'}</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-secondary'>{record.resolved_on || '01/01/2024'}</p>
                                                </div>
                                            </td>
                                            <td className="align-middle py-3">
                                                <div className="flex items-center justify-start gap-x-2">
                                                    <img src="eyeViewIcon.svg" alt="" className="size-8 flex-shrink-0 hover:cursor-pointer" />
                                                    <img src="complaintDeleteIcon.svg" alt="" 
                                                    onClick={() => {
                                                        deleteRows(record.ticket_id)
                                                    }}
                                                    className="size-8 flex-shrink-0 hover:cursor-pointer" />
                                                    <div className='relative group'>
                                                        <img src="dotsIcon.png" alt="" className="p-3 flex-shrink-0 hover:cursor-pointer" />
                                                        <div className="absolute bg-white right-full -bottom-3 -mr-2 shadow-[0_2px_6px_rgba(0,0,0,0.4)] rounded-md p-3 gap-7 z-10 hidden group-hover:block">
                                                            <ul className="space-y-2 w-32 text-sm gap-y-7">
                                                                <li className="text-secondary hover:text-primary cursor-pointer">History</li>
                                                                <li 
                                                                className="text-secondary hover:text-primary cursor-pointer">Print Qr Code</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {Array(10 - (tableContent.results?.length || 0)).fill(null).map((_, i) => (
                                <tr key={`empty-${i}`} className='bg-white border-b border-gray-200'>
                                {Array(10).fill(null).map((_, idx) => (
                                    <td key={idx} className='px-4 py-3'>&nbsp;</td>
                                ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex flex-row justify-end items-center place-items-end px-4 py-2 bg-[#FAF9F9]'>
                        <div className='mx-4 text-sm text-secondary'>
                            Page {pageNumber} of {Math.max(1, Math.ceil((tableContent.count || 0) / 10))}
                        </div>
                        <button
                        className='p-3 hover:cursor-pointer'
                        onClick={() => setPageNumber(prev => prev > 1 ? prev - 1 : prev)}
                        disabled={pageNumber === 1}
                        >
                            <img src="prevIcon.svg" alt="" />
                        </button>
                        <button 
                        className='p-3 hover:cursor-pointer'
                        onClick={() => setPageNumber(prev => prev < Math.ceil((tableContent.count || 0) / 10) ? prev + 1 : prev)}
                        disabled={pageNumber === Math.ceil((tableContent.count || 0) / 10) || (tableContent.count || 0) === 0}
                        >
                            <img src="nextIcon.svg" alt="" />
                        </button>
                    </div>
                    
                    
                </section>
        </main>
    )
    }

    export default TicketSystem