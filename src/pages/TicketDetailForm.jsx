    import React, {useState} from 'react'
    import MDEditor from '@uiw/react-md-editor';
    import '@uiw/react-md-editor/markdown-editor.css';
    import '@uiw/react-markdown-preview/markdown.css';
    import axios from 'axios';
    import { BASE_URL, COMPLAINT_URL } from './Url';

    const updateFormHandler = async (data, ticket_id, fetchRows, pageNumber) => {
        
        try {

            console.log("Data to be updated:", data);
            const formData = new FormData();

            formData.append("description", data.description);
            data.images.forEach((file, index) => {
               formData.append(`images`, file);   
            });

//             console.log("FormData contents:");
//             for (const [key, value] of formData.entries()) {
//             console.log(key, value);
// }

        const res = await fetch(`${BASE_URL}${COMPLAINT_URL}${ticket_id}/`, {
                method: "PATCH",
                body: formData,
            });

            const json = await res.json();

            if (res.ok) {
                alert('Ticket updated successfully!');
                fetchRows(pageNumber);
            } else {
                alert(`Failed to update ticket: ${json.detail || "Unknown error"}`);
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
            alert('An error occurred while updating the ticket.');
        }

        console.log("Update Data:", data);
    }


    function TicketDetailForm({complaintData, setViewTicket, viewTicket, fetchRows, pageNumber}) {

        console.log("Complaint Data:", complaintData);
        const [isEditable, setIsEditable] = useState(false);
        const [description, setDescription] = useState(complaintData.description || '');
        const [files, setFiles] = useState(complaintData.images.map((img, index) => ({
                                        ...img,
                                        name: `complaintimage${index + 1}`
                                    }))
                                );


        const uploadOnChange = (e) => {
            const newFiles = Array.from(e.target.files);
            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);

            e.target.value = null
        }

        //The funtionality to delete files is commented out for now, but can be implemented later 

        // const handleDeleteFile = (indexToDelete) => {
        //     const updatedFiles = files.filter((_, index)=> index !== indexToDelete)
        //     setFiles(updatedFiles)
        // }


    return (
        <main className='flex flex-col divide-y-[2px] divide-gray-200 justify-start w-[60vw] absolute top-[2%] right-[20%] z-30  bg-white rounded-lg shadow-lg pb-2' key="ticket-detail-form">
                <section className='flex flex-row items-center justify-around py-4 px-5' key="header-section">
                        <div className='flex flex-col items-start justify-center w-full gap-y-1' key="ticket-info">
                                <div className='flex flex-row items-center' key="ticket-header">
                                        <p className='text-xl italic text-black' key="ticket-id">#{complaintData.ticket_id}</p>
                                        <div className='flex flex-row justify-center items-center outline outline-[1px] outline-green-300 rounded-2xl px-2 h-5 ml-2 text-sm text-green-600 font-semibold' key="status-badge">
                                                Open
                                        </div>
                                </div>
                                <p className='text-sm text-secondary' key="room-info-summary">{complaintData.room_number} / {complaintData.block} / {complaintData.floor}</p>
                        </div>
                        <div key="edit-button " className='flex flex-row items-center justify-center gap-x-2'>
                                <img 
                                onClick={() => setIsEditable(!isEditable)}
                                src="ticketDetailFormEditIcon.png" alt="edit Icon" className='size-9' />
                                <img
                                onClick={() => setViewTicket(!viewTicket)}
                                src="closeIcon.png" alt="" className='p-3 bg-slate-950 hover:cursor-pointer' />
                        </div>
                </section>

                <section key="ticket-details-section" className='flex flex-col gap-y-6 p-5'>
                        <p key="section-title">TICKET DETAILS</p>
                        <div className='flex flex-row gap-x-20' key="details-grid">
                                <div key="room-info-detail">
                                        <p className='text-secondary text-sm'>
                                                Room info
                                        </p>
                                        <p className='text-[#202020] text-md'>
                                                {complaintData.room_number} / {complaintData.block} / {complaintData.floor}
                                        </p>
                                </div>
                                <div key="ward-speciality">
                                        <p className='text-secondary text-sm'>
                                                Ward / Speciality
                                        </p>
                                        <p className='text-[#202020] text-md'>
                                                {complaintData.ward} / {complaintData.speciality}
                                        </p>
                                </div>
                                <div key="issue-type">
                                        <p className='text-secondary text-sm'>
                                                Issue Type
                                        </p>
                                        <p className='text-[#202020] text-md'>
                                                {complaintData.issue_type}
                                        </p>
                                </div>
                        </div>
                        <div key="description-section" className='flex flex-col gap-y-3'>
                                <p className='text-secondary text-sm' key="description-label">
                                        Description
                                </p>
                                <MDEditor
                                        key="description-editor"
                                        value={description}
                                        onChange={(val) => setDescription(val || '')}
                                        preview="edit"
                                        height={200}
                                        data-color-mode="light"
                                        className='w-[100%] md:w-[55%] rounded-md outline outline-[1px] outline-gray-300 p-2 bg-white'
                                        
                                />
                        </div>
                        <div className='flex flex-col gap-y-2' key="file-upload-section">
                                <label className='text-secondary text-sm' htmlFor="uploadFile" key="upload-label">Attachment</label>
                                <div className='flex flex-row gap-x-4 ' key="upload-container"> 

                                        <div className={`${files.length == 0 ? "hidden" : "flex"} flex-col w-[30%] min-w-[205px] bg-white`} key="files-list">
                                                {files.map((file, index) => (
                                                        <div key={`file-${index}`} className='flex flex-row items-center w-[100%] border'>
                                                                <img className='p-3' src="photoIcon.svg" alt="" key={`photo-icon-${index}`} href={`${file.image}`} />
                                                                 <a
                                                                    href={file.image || URL.createObjectURL(file)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-secondary w-[60%] py-2 hover:underline underline-offset-1"
                                                                    key={`file-link-${index}`}
                                                                    >
                                                                    {file.name}
                                                                </a>
                                                                {/* <button
                                                                key={`delete-btn-${index}`}
                                                                type="button"
                                                                onClick={() => handleDeleteFile(index)}
                                                                className="text-red-600 hover:text-red-800 ml-auto px-3"
                                                                >
                                                                        <img src="deleteFileIcon.svg" alt="" />
                                                                </button> */}

                                                        </div>
                                                ))}
                                        </div>
                                        <div key="upload-button-container">
                                                <label htmlFor="uploadFile" key="upload-button-label">
                                                        <img className={`${isEditable ? "" : "grayscale"}`} src="uploadButtonIcon.svg" alt="" />
                                                </label>
                                                <input
                                                        key="file-input"
                                                        disabled={!isEditable}
                                                        className='hidden w-[90%] md:w-[35%] rounded-md outline outline-[1px] outline-gray-300 p-2'
                                                        type="file"
                                                        name= "upload_file"
                                                        id="uploadFile"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={uploadOnChange}
                                                />
                                        </div>
                                        
                                </div>
                                                        
                        </div>
                </section>

                <section key="additional-section" className='flex flex-col gap-y-6 p-5 mb-14'>
                        <p key="additional-title">ADDITIONAL DETAILS</p>
                        <div className='flex flex-row gap-x-20' key="details-grid">
                                <div key="room-info-detail">
                                        <p className='text-secondary text-sm'>
                                                Submitted by
                                        </p>
                                        <p className='text-[#202020] text-md'>
                                                Patient
                                        </p>
                                </div>
                                <div key="ward-speciality">
                                        <p className='text-secondary text-sm'>
                                                Assigned Department
                                        </p>
                                        <p className='text-[#202020] text-md'>
                                                
                                        </p>
                                </div>
                                <div key="issue-type">
                                        <p className='text-secondary text-sm'>
                                                Assigned Staff
                                        </p>
                                        <p className='text-[#202020] text-md'>
                                                
                                        </p>
                                </div>
                        </div>
                </section>
                <section className='flex flex-row justify-end gap-x-4 p-5 !border-none min-h-[60px]' key="action-buttons">
                    {isEditable ? (
                        <>
                        <button 
                            className='w-28 bg-white text-black rounded-[4px] outline outline-[1px] outline-secondary hover:bg-gray-200 transition duration-300 ease-in-out p-2'
                            onClick={() => setIsEditable(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className='w-28 bg-[#04B7B1] text-white rounded-[4px] hover:bg-[#03A6A0] transition duration-300 ease-in-out p-2 shadow-md'
                            onClick={() => {
                            updateFormHandler({
                                ticket_id: complaintData.ticket_id,
                                description: description,
                                images: files
                            }, complaintData.ticket_id, fetchRows, pageNumber)    
                            alert('Ticket updated successfully!')
                            setIsEditable(false)
                            }}
                        >
                            Update
                        </button>
                        </>
                    ) : (
                        <div className='invisible p-2'>placeholder</div>
                    )
                    }
                </section>
        </main>
    )
    }

    export default TicketDetailForm