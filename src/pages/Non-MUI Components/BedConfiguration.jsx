import React,{useEffect, useState} from 'react'
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import handleQRCodePrint, {QRCodePrinter} from '../PrintQRCode';
import {
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
  Menu,
  MenuItem as MenuItemComponent,
} from "@mui/material"
import { Edit, Delete, MoreVert } from "@mui/icons-material"

import { BASE_URL, ROOMS_URL } from '../Url';

function BedConfiguration() {

        // const [formData, setFormData] = useState({
        //     room_no: '',
        //     bed_no: '',
        //     Floor_no: '',
        //     Block: '',
        //     room_type: '',
        //     speciality: '',
        //     ward: '',
        //     status: true,
        // });

    const [roomQR, setRoomQRCode] = useState([]);
    const [tableContent, setTableContent] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [isEditable, setIsEditable] = useState(false);
    const [idToEdit, setIdToEdit] = useState(null);
    const [masterChecked, setMasterChecked] = useState(false);

    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const formDataHandler = async (data) => {
        const METHOD = isEditable ? 'put' : 'post';
        const url = isEditable ? `${BASE_URL}${ROOMS_URL}${idToEdit}/` : `${BASE_URL}${ROOMS_URL}`;
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
                bed_no: '',
                room_no: '',
                Floor_no: '',
                Block: '',
                room_type: '',
                speciality: '',
                ward: '',
                status: false,
            });

            if (isEditable) {
                setRoomQRCode((prev) =>
                    prev.map((item) =>
                        item.id === idToEdit
                            ? { ...item, qrCodeUrl: response.data.qr_code, toPrint: false, status: response.data.status }
                            : item
                    )
                );
            }
            fetchRows();
            setIdToEdit(null);
            setIsEditable(false);
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
            const response = await axios.get(`${BASE_URL}${ROOMS_URL}?page=${pageNumber}`);
            setTableContent(response.data);
            const dataForQr = response.data.results.map((prop) => ({
                id: prop.id,
                qrCodeUrl: prop.qr_code,
                toPrint: false,
                status: prop.status,
            }));
            setRoomQRCode((prev) => {
                const filteredData = dataForQr.filter((item, index) => item.id !== prev[index]?.id);
                return [...prev, ...filteredData];
            });
            console.log('Fetched rows:', tableContent);
        } catch (error) {
            console.error('Error fetching rows:', error.response?.statusText || error.message);
        }
    };

    useEffect(() => {
        fetchRows();
    }, [pageNumber]);

    const deleteRows = async (id) => {
        try {
            await axios.delete(`${BASE_URL}${ROOMS_URL}${id}/`);
            console.log('Row deleted successfully');
            setRoomQRCode((prev) => prev.filter((item) => item?.id !== id));
            setTableContent((prev) => ({
                ...prev,
                results: prev.results.filter((item) => item.id !== id),
            }));
        } catch (error) {
            console.error('Error deleting row:', error.response?.statusText || error.message);
        }
    };

    useEffect(() => {
        console.log("room QR :", roomQR);
    }, [roomQR]);

    useEffect(() => {
        console.log(tableContent);
    }, [tableContent]);

    return (
        <main className='h-svh flex flex-row gap-x-4 justify-between items-center'>
            <section className='w-[70%] h-[85vh] flex flex-col justify-start rounded-xl bg-white'>
                <QRCodePrinter roomQR={roomQR}/>
                {/* <button className='w-[10vw] bg-[#04B7B1] text-white rounded-md hover:bg-[#03A6A0] transition duration-300 ease-in-out p-2 m-4'>
                    Print QR Code
                </button> */}
                <table className='font-sans table-fixed border-collapse w-full h-full'>
                    <thead className='!font-extralight'>
                        <tr className='bg-[#FAF9F9] !font-light text-secondary px-4 py-3'>
                            <th className='font-medium text-left px-4 py-3 accent-primary'>
                                <input type="checkbox" 
                                checked={masterChecked}
                                name="masterCheckbox" id="masterCheckbox"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setMasterChecked(isChecked);
                                    const updatedRoomQR = roomQR.map((item)=>{
                                        console.log(e.target.checked);
                                        if(e.target.checked && item.status === 'active'){
                                            return {
                                                ...item,
                                                toPrint: true
                                            }
                                        }
                                        else{
                                            return {
                                                ...item,
                                                toPrint: false
                                            }
                                        }
                                    })
                                    setRoomQRCode(updatedRoomQR);
                                }}
                                className='size-5  ml-3' />
                            </th>
                            <th className='text-sm font-medium text-left'>Bed No</th>
                            <th className='text-sm font-medium text-left'>Room No</th>
                            <th className='text-sm font-medium text-left w-24'>Block</th>
                            <th className='text-sm font-medium text-left w-20'>Floor</th>
                            <th className='text-sm font-medium text-left'>Ward</th>
                            <th className='text-sm font-medium text-left'>Speciality</th>
                            <th className='text-sm font-medium text-left'>Room Type</th>
                            <th className='text-sm font-medium text-left'>Status</th>
                            <th className='text-sm font-medium text-left'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-secondary'> 
                        {Array.isArray(tableContent.results) && 
                            tableContent.results.map((record,index)=>{
                                return(
                                    <tr key={record.id} className='bg-white border-b border-gray-200 hover:bg-[#FAF9F9]'>
                                        <td className=''>
                                            <input type="checkbox" 
                                            onChange={() => {
                                                if (record.status === 'active') {
                                                    const updated = roomQR.map(item => {
                                                        if (item?.id === record.id) {
                                                            return { ...item, toPrint: !item.toPrint };
                                                        }
                                                        return item;
                                                    });
                                                    setRoomQRCode(updated);

                                                const isNowChecked = !(updated?.find(item => item?.id === record.id)?.toPrint)
                                                if(isNowChecked) {
                                                    setMasterChecked(false);
                                                }
                                                    console.log('Checkbox clicked for record:', record.id);
                                            }
                                            }}
                                            checked={(!!roomQR?.find(item => item?.id === record.id)?.toPrint)}
                                            name="" id="" className=' accent-primary size-5 ml-7'/>
                                        </td>
                                        <td className='text-sm py-1 pr-3 text-left'>{record.bed_no}</td>
                                        <td className='text-sm py-1 pr-3 text-left'>{record.room_no}</td>
                                        <td className='text-sm py-1 pr-3 text-left'>{record.Block}</td>
                                        <td className='text-sm py-1 pr-3 text-left'>{record.Floor_no}</td>
                                        <td className='text-sm py-1 pr-3 text-left'>{record.ward}</td>
                                        <td className='text-sm py-1 pr-3 text-left'>{record.speciality}</td>
                                        <td className='text-sm py-1 pr-3 text-left'>{record.room_type}</td>
                                        <td className='text-sm py-1 pr-3 text-left'>{record.status}</td>
                                        <td className="align-middle py-1 pr-3">
                                        <div className="flex items-center justify-start gap-x-2">
                                            <img src="editIcon.jpg" alt=""
                                            onClick={() => {
                                                setIsEditable(true);
                                                reset({
                                                    bed_no: record.bed_no,
                                                    room_no: record.room_no,
                                                    Floor_no: record.Floor_no,
                                                    Block: record.Block,
                                                    room_type: record.room_type,
                                                    speciality: record.speciality,
                                                    ward: record.ward,
                                                    status: record.status === 'active' ? true : false
                                                });
                                                setIdToEdit(record.id);
                                            }}  
                                            className="size-8 flex-shrink-0 hover:cursor-pointer" />
                                            <img src="deleteIcon.jpg" alt="" 
                                            onClick={() => {
                                                deleteRows(record.id)
                                            }}
                                            className="size-8 flex-shrink-0 hover:cursor-pointer" />
                                            <div className='relative group'>
                                                <img src="dotsIcon.png" alt="" className="p-3 flex-shrink-0 hover:cursor-pointer" />
                                                <div className="absolute bg-white right-full -bottom-3 -mr-2 shadow-[0_2px_6px_rgba(0,0,0,0.4)] rounded-md p-3 gap-7 z-10 hidden group-hover:block">
                                                    <ul className="space-y-2 w-32 text-sm gap-y-7">
                                                        <li className="text-secondary hover:text-primary cursor-pointer">History</li>
                                                        <li 
                                                        onClick={() => {handleQRCodePrint([{id:record.id,qrCodeUrl:record.qr_code, toPrint: true}])}}
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
                                <td key={idx} className='px-4 py-2'>&nbsp;</td>
                            ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='flex flex-row justify-end items-center px-4 py-2 bg-[#FAF9F9]'>
                    <div className='mx-4 text-sm text-secondary'>
                        Page {pageNumber} of {Math.max(1, Math.ceil(tableContent.count / 10))}
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
                    onClick={() => setPageNumber(prev => prev < Math.ceil(tableContent.count / 10) ? prev + 1 : prev)}
                    disabled={pageNumber === Math.ceil(tableContent.count / 10) || tableContent.count === 0}
                    >
                        <img src="nextIcon.svg" alt="" />
                    </button>
                </div>
                
                
            </section>
            <section className='flex flex-col justify-between w-[30%] h-[95vh] bg-white rounded-xl'>
                <div className='flex flex-col bg-[#FAF9F9] py-3 px-4 rounded-t-xl'>
                    <p className='font-sans text-secondary'>Bed Configuration</p>
                </div>
                <div className='-mt-48'>
                    <form id='bedForm' onSubmit={handleSubmit(formDataHandler)} className='grid grid-cols-2 gap-4 p-4'>
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="bedNo" className='text-secondary text-sm'>Bed No</label>
                            <input id='bedNo' type="text" className='h-[5vh] rounded-md outline outline-1 outline-secondary p-3'
                            {...register('bed_no', { required: "Bed no is required" })} 
                            />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="roomNo" className='text-secondary text-sm'>Room No</label>
                            <input id='roomNo' type="text" name='room_no' className='h-[5vh] rounded-md outline outline-1 outline-secondary p-3'
                            {...register('room_no', { required: "Room no is required" })}
                            />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="floor" className='text-secondary text-sm'>Floor</label>
                            <select id='floor' className='h-[5vh] rounded-md outline outline-1 outline-secondary p-3  bg-white'
                            {...register('Floor_no', { required: "Floor is required" })}
                        >
                                <option value="" disabled></option>
                                <option className='!hover:bg-black' value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="block" className='text-secondary text-sm'>Block</label>
                            <select id='block' className='h-[5vh] rounded-md outline outline-1 outline-secondary p-3  bg-white'
                            {...register('Block', { required: "Block is required" })}
                            >
                                <option value="" disabled></option>
                                <option value="Main">Main</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="speciality" className='text-secondary text-sm'>Speciality</label>
                            <select name="speciality" id='speciality' className='h-[5vh] rounded-md outline outline-1 outline-secondary p-3  bg-white' 
                            {...register('speciality', { required: "Speciality is required" })}
                        >
                                <option value="" disabled></option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Pediatrics">Pediatrics</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="ward" className='text-secondary text-sm'>Ward</label>
                            <select name="ward" id='ward' className='h-[5vh] rounded-md outline outline-1 outline-secondary p-3  bg-white' 
                            {...register('ward', { required: "Ward is required" })}
                            >
                                <option value="" disabled></option>
                                <option value="General">General</option>
                                <option value="Operation">Operation</option>
                                <option value="ICU">ICU</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="roomType" className='text-secondary text-sm'>Room Type</label>
                            <select name="room_type" id='roomType' className='h-[5vh] rounded-md outline outline-1 outline-secondary p-3  bg-white'
                            {...register('room_type', { required: "Room type is required" })}
                            >
                                <option className='!hover:bg-primary' value="" disabled></option>
                                <option className='!hover:bg-primary' value="Low">Low</option>
                                <option className='!hover:bg-primary'  value="Medium">Medium</option>
                                <option className='!hover:bg-primary' value="Costly">Costly</option>
                          </select>
                        </div>
                        <div className='flex flex-row items-center mt-6 ml-4 gap-x-2'>
                            <input type="checkbox" name="is_active" id="isActive" className=' accent-primary size-5'
                            {...register('status')}
                            />
                            <label htmlFor="isActive">Active</label>
                        </div>
                        {errors.bed_no && <span className='text-red-500 text-sm'>{errors.bed_no.message}</span>}
                    </form>
                </div>

                <div>
                </div>
                
                <div className='flex flex-row items-center justify-center gap-x-2 bg-[#FAF9F9] p-2 rounded-b-xl'>
                    {isEditable ?
                        <button type='button' 
                        onClick={()=>{
                        reset({
                            bed_no: '',
                            room_no: '',
                            Floor_no: '',
                            Block: '',
                            room_type: '',
                            speciality: '',
                            ward: '',
                            status: false
                        });
                        setIsEditable(false)}} 
                        form='bedForm' 
                        className='w-[20%] h-[4vh] bg-[#FAF9F9] text-gray-700 rounded-md outline outline-1 outline-gray-600 hover:bg-[#E0E0E0] transition duration-300 ease-in-out'>
                            Cancel   
                        </button>
                        :
                        <button type='button' 
                        onClick={()=>{
                        reset({
                            bed_no: '',
                            room_no: '',
                            Floor_no: '',
                            Block: '',
                            room_type: '',
                            speciality: '',
                            ward: '',
                            status: false
                        });
                        }} 
                        form='bedForm' 
                        className='w-[20%] h-[4vh] bg-[#FAF9F9] text-gray-700 rounded-md outline outline-1 outline-gray-600 hover:bg-[#E0E0E0] transition duration-300 ease-in-out'>
                            Reset   
                        </button>
                        
                    }
    
                    {isEditable ?
                        <button 
                        type='submit' form='bedForm' className='w-[20%] h-[4vh] bg-[#04B7B1] text-white rounded-md hover:bg-[#03A6A0] transition duration-300 ease-in-out'>
                            Update
                        </button> :
                        <button type='submit' form='bedForm' className='w-[20%] h-[4vh] bg-[#04B7B1] text-white rounded-md hover:bg-[#03A6A0] transition duration-300 ease-in-out'>
                            Submit
                        </button>
                    }
                </div>
            </section>
         </main>
    )
    }

    export default BedConfiguration