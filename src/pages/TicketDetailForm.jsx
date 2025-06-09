import React, {useState} from 'react'
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const complaintData = {
    "ticket_id": "SVN10172",
    "submitted_at": "2025-06-05T10:59:42.977435Z",
    "bed_number": "696",
    "block": "Main",
    "room_number": "6969",
    "floor": "3",
    "ward": "Operation",
    "speciality": "Cardiology",
    "room_type": "Medium",
    "room_status": "active",
    "issue_type": "Electrical",
    "description": "ADASDADSSA",
    "priority": "medium",
    "submitted_by": "Anonymous",
    "status": "open",
    "assigned_department": null,
    "resolved_by": null,
    "resolved_at": null,
    "remarks": null
};


function TicketDetailForm() {

    const [description, setDescription] = useState(complaintData.description || '');
  return (
    <main>
        <section className='flex flex-row'>
            <div className='flex flex-col items-start justify-center w-full p-3'>
                <div className='flex flex-row'>
                    <p className='text-xl italic text-black'>#{complaintData.ticket_id}</p>
                    <div className='outline outline-[1px] outline-green-300 rounded-2xl px-2 py-1 ml-2 text-sm text-green-600 font-semibold'>
                        Open
                    </div>
                </div>
                <p className='text-xs text-secondary'>{complaintData.room_number} / {complaintData.block} / {complaintData.floor}</p>
            </div>
            <div>
                <img src="editIcon.svg" alt="edit Icon" />
            </div>
        </section>

        <section>
            <p>TICKET DETAILS</p>
            <div className='flex flex-row gap-x-4 p-3'>
                <div>
                    <p className='text-secondary text-sm'>
                        Room info
                    </p>
                    <p className='text-[#202020] text-md'>
                        {complaintData.room_number} / {complaintData.block} / {complaintData.floor}
                    </p>
                </div>
                <div>
                    <p className='text-secondary text-sm'>
                        Ward / Speciality
                    </p>
                    <p className='text-[#202020] text-md'>
                        {complaintData.ward} / {complaintData.speciality}
                    </p>
                </div>
                <div>
                    <p className='text-secondary text-sm'>
                        Issue Type
                    </p>
                    <p className='text-[#202020] text-md'>
                        {complaintData.issue_type}
                    </p>
                </div>
            </div>
            <div>
                <p className='text-secondary text-sm'>
                    Description
                </p>
                <MDEditor
                    value={description}
                    onChange={(val) => setDescription(val || '')}
                    preview="edit"
                    height={200}
                    data-color-mode="light"
                    className='w-[100%] md:w-[55%] rounded-md outline outline-[1px] outline-gray-300 p-2 bg-white'
                    
                />
            </div>
        </section>

        <section>
            
        </section>
    </main>
  )
}

export default TicketDetailForm