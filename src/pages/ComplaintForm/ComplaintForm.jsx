import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useNavigate } from 'react-router';
import { set, useForm } from 'react-hook-form';
import '../../index.css'; 

const DecodeBase64Component = () => {
    const [decodedData, setDecodedData] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    // uploads the news files with the existing files
    const uploadOnChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        setValue("upload_file", updatedFiles);

         e.target.value = null
    }

    const handleDeleteFile = (indexToDelete) => {
        const updatedFiles = files.filter((_, index)=> index !== indexToDelete)
        setFiles(updatedFiles)
        setValue("upload_file", updatedFiles);
    }

    const {
                register,
                reset,
                setValue,
                handleSubmit,
                formState: { errors },
            } = useForm();

    const formSubmitHandler = (data) => {
        const formData = new FormData();

        formData.append("room_number", decodedData.room_no);
        formData.append("block", decodedData.Block);
        formData.append("bed_number", decodedData.bed_no);
        formData.append("issue_type", data.issue_type);
        formData.append("priority", data.priority);
        formData.append("description", data.description);

        files.forEach((file, index) => {
            formData.append("image", file); 
        });

        fetch("http://127.0.0.1:8000/api/complaints/", {
            method: "POST",
            body: formData,
        })
        .then(res => res.json())
        .then(response => {
            console.log("Server response:", response);
        })
        .catch(err => {
            console.error("Upload failed:", err);
        });
    }

    useEffect(() => {
        const base64String = searchParams.get('data');
        if(!base64String) {
            navigate('/'); // Redirect to home if no data is found
            return;
        }

        try {
            const decodedString = atob(base64String);
            const jsonData = JSON.parse(decodedString);
            console.log("Decoded Data:", jsonData);
            setDecodedData(jsonData);
        } catch (error) {
            console.error("Error decoding base64 string:", error);
            navigate('/'); // Redirect to home if no data is found
            return;
        }
        
        

        
    }, [searchParams, navigate]);

    if (!decodedData) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        // 
        <main className='min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50'>
            <section className='w-[95%] md:w-[80%] lg:w-[50%] bg-white p-4 border border-gray-300 rounded-lg shadow-sm divide-y-[1px] divide-[#D7D7D7]'>
                 <section className='flex flex-col items-start justify-center w-full p-3'>
                    <p className='text-[#202020] text-md font-sans italic'>Raise Ticket</p>
                    <p className='text-secondary text-sm'>Use this form to raise ticket or issue</p>
                </section>
                <section className='flex flex-col items-start justify-center p-3 gap-y-2'>
                    <div>
                        <p className='text-secondary text-sm'>Room Details</p>
                        <p className='text-[#202020] text-md'>{decodedData.Block} / {decodedData.Floor_no} / {decodedData.ward} / {decodedData.room_no}</p>
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
                                <option value="cleanliness">Cleanliness</option>
                                <option value="electrical">Electrical</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="priorty">Priority</label>
                            <select 
                            className='w-[90%] md:w-[55%] rounded-md outline outline-[1px] outline-gray-300 p-2'
                            {...register("priority", { required: true })}
                            name="priority" id="priority">
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
