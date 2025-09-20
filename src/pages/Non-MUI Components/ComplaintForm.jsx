import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { BASE_URL } from '../Url';
import { COMPLAINT_URL, ISSUE_CATEGORY_URL } from '../Url';
import '../../index.css'; 

const DecodeBase64Component = () => {
    const [decodedData, setDecodedData] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [signature, setSignature] = useState(null);
    const [encodedData, setEncodedData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(100);
    const [sessionId, setSessionId] = useState(null);
    const [issueCategories, setIssueCategories] = useState([]);
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const existingSession = sessionStorage.getItem('sessionId');
        console.log('Checking for existing session:', existingSession);
        if (existingSession) {
            console.log('Existing session found:', existingSession);
            navigate('/sessionExpired');
            return;
        }

        const newSessionId = `session_${Date.now()}`;
        setSessionId(newSessionId);
        sessionStorage.setItem('sessionId', newSessionId);
        setTimeLeft(600);
        console.log('Session started:', newSessionId);
    }, [navigate]);

    useEffect(() => {
        if (timeLeft <= 0) {
            sessionStorage.removeItem('sessionId');
            navigate('/sessionExpired');
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, navigate]);

    const uploadOnChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        setValue("upload_file", updatedFiles);

        e.target.value = null;
    };

    const handleDeleteFile = (indexToDelete) => {
        const updatedFiles = files.filter((_, index) => index !== indexToDelete);
        setFiles(updatedFiles);
        setValue("upload_file", updatedFiles);
    };

    const formSubmitHandler = async (data) => {
        const formData = new FormData();

        formData.append("room_number", decodedData.room_no);
        formData.append("block", decodedData.Block);
        formData.append("bed_number", decodedData.bed_no);
        formData.append("issue_type", data.issue_type);
        formData.append("priority", data.priority);
        formData.append("description", data.description);
        formData.append("floor", decodedData.Floor_no);
        formData.append("ward", decodedData.ward);
        formData.append("room_status", decodedData.status);
        formData.append("speciality", decodedData.speciality);
        formData.append("room_type", decodedData.room_type);
        formData.append("qr_data_from_qr", encodedData);
        formData.append("qr_signature_from_qr", signature);

        files.forEach((file) => {
            formData.append("images", file);
        });

            console.log("FormData contents:");
            for (const [key, value] of formData.entries()) {
            console.log(key, value);
}


        console.log("Form Data to Uploaded:", data);

        try {
            const response = await axios.post(`${BASE_URL}${COMPLAINT_URL}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Complaint submitted successfully:", response.data);
            alert("Complaint submitted successfully!");
            reset();
            setFiles([]);
            
        } catch (error) {
            console.error("Error submitting complaint:", error.response?.statusText || error.message);
            alert("Failed to submit complaint. Please try again.");
        }
    };

    const fetchIssueCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}${ISSUE_CATEGORY_URL}`);
            const categories = response.data.results;
            setIssueCategories(categories);
            console.log("Issue Categories:", categories);
        } catch (error) {
            console.error("Error fetching issue categories:", error);   
            alert("Failed to fetch issue categories. Please try again.");
            return [];
        }
    };

    useEffect(() => {
        fetchIssueCategories()}, 
    [])

    useEffect(() => {
        const base64String = searchParams.get('data');
        setEncodedData(base64String);
        if (!base64String) {
            navigate('/');
            return;
        }

        try {
            const decodedString = atob(base64String);
            const jsonData = JSON.parse(decodedString);
            setSignature(searchParams.get('signature'));
            console.log("Signature:", searchParams.get('signature'));
            console.log("Base64 String:", base64String);
            console.log("Decoded Data:", jsonData);
            setDecodedData(jsonData);
        } catch (error) {
            console.error("Error decoding base64 string:", error);
            navigate('/');
            return;
        }
    }, [searchParams, navigate]);

    useEffect(() => {
        reset();
    }, [decodedData]);

    if (!decodedData) {
        return <p className="text-center">Loading...</p>;
    }

        return (
            // 
            <main className='min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50'>
                <section className='w-[95%] md:w-[80%] lg:w-[50%] bg-white p-4 border border-gray-300 rounded-lg shadow-sm divide-y-[1px] divide-[#D7D7D7]'>
                    <section className='flex flex-col items-start justify-center w-full p-3'>
                        <p className='text-[#202020] text-base font-sans italic'>Raise Ticket</p>
                        <p className='text-secondary text-sm'>Use this form to raise ticket or issue</p>
                    </section>
                    <section className='flex flex-col items-start justify-center p-3 gap-y-2'>
                        <div>
                            <p className='text-secondary text-sm'>Room Details</p>
                            <p className='text-[#202020] text-base'>{decodedData.Block} Block / Floor {decodedData.Floor_no} / {decodedData.ward} / {decodedData.room_no}</p>
                        </div>
                        <div>
                            <p className='text-secondary text-sm'>Room Status</p>
                            <p className='text-[#202020] text-md'>{decodedData.status === "active" ? "Booked" : "Vacant"}</p>
                        </div>
                    </section>
                    <section className='w-[100%]'>
                        <form onSubmit={handleSubmit(formSubmitHandler)} className='flex flex-col p-3 gap-y-4'>
                            <div className='flex flex-col gap-y-2'>
                                <label htmlFor="issueType">Issue Type</label>
                                <select
                                className='w-[90%] md:w-[55%] rounded-md outline outline-[1px] outline-gray-300 p-2'
                                {...register("issue_type", { required: true })}
                                id="issueType">
                                    <option value="" disabled></option>
                                    {issueCategories.map((category) => (
                                        <option key={category.issue_category_code} value={category.issue_category_name}>
                                            {category.issue_category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex flex-col gap-y-2'>
                                <label htmlFor="priorty">Priority</label>
                                <select 
                                className='w-[90%] md:w-[55%] rounded-md outline outline-[1px] outline-gray-300 p-2'
                                {...register("priority", { required: true })}
                                name="priority" id="priority">
                                    <option value="" disabled></option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className='flex flex-col gap-y-2'>
                                <label htmlFor="description">Description</label>
                                <textarea
                                className='w-[90%] md:w-[55%] rounded-md outline outline-[1px] outline-gray-300 p-2'
                                {...register("description", { required: true })}
                                id="description"
                                rows="4"
                                placeholder='Describe the issue...'
                                ></textarea>
                            </div>

                            <div className='flex flex-col gap-y-2'>
                                <label htmlFor="uploadFile">Upload File</label>

                                <div className='flex flex-row gap-x-4'> 
                    
                                    <div className={`${files.length == 0 ? "hidden" : "flex"} flex-col w-[60%] min-w-[205px]`}>
                                        {files.map((file, index) => (
                                            <div className='flex flex-row items-center w-[100%] border'>

                                                <img className='p-3' src="photoIcon.svg" alt="" />

                                                <p key={index} className="w-[60%] py-2 text-secondary">
                                                    {file.name}
                                                </p>

                                                <button
                                                type="button"
                                                onClick={() => handleDeleteFile(index)}
                                                className="text-red-600 hover:text-red-800 ml-auto px-3"
                                                >
                                                    <img src="deleteFileIcon.svg" alt="" />
                                                </button>
                        
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label htmlFor="uploadFile">
                                            <img src="uploadButtonIcon.svg" alt="" />
                                        </label>
                                        <input
                                            className='hidden w-[90%] md:w-[35%] rounded-md outline outline-[1px] outline-gray-300 p-2'
                                            type="file"
                                            {...register("upload_file")}
                                            id="uploadFile"
                                            multiple
                                            accept="image/*"
                                            onChange={uploadOnChange}
                                        />
                                    </div>
                                    

                                </div>
                                
                            </div>
                            <div className='flex flex-row justify-center items-center'>
                                <button
                                type="submit"
                                className='w-[90%] md:w-[55%] mt-28 mb-3 bg-[#04B7B1] text-white rounded-md hover:bg-[#03A6A0] transition duration-300 ease-in-out p-2 py-3'
                                >
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </section>
                </section>
            
            </main>
        );
    };

    export default DecodeBase64Component;
