import React from 'react'

function TicketSystem() {
    
  return (
    <main className='flex flex-col '>
        <section className='flex flex-row items-center p-4 gap-x-3'>
            <div className='flex flex-col items-center justify-center bg-white py-5 px-8 gap-y-1 rounded-sm outline outline-[1px] outline-gray-300'>
                <p className='text-md font-semibold'>10</p>
                <p className='text-xs text-secondary'>Total Tickets</p>
            </div>
            <div className='flex flex-col items-center justify-center bg-white py-5 px-6 gap-y-1 rounded-sm outline outline-[1px] outline-gray-300'>
                <p className='text-md font-semibold'>06</p>
                <p className='text-xs text-secondary'>Resolved Tickets</p>
            </div>
            <div className='flex flex-col items-center justify-center bg-white py-5 px-8 gap-y-1 rounded-sm outline outline-[1px] outline-gray-300'>
                <p className='text-md font-semibold'>01</p>
                <p className='text-xs text-secondary'>Priority High</p>
            </div>
        </section>
            <form className='flex flex-row gap-y-4 p-4'>
                <div>
                    <label className='!sr-only' htmlFor="ward">Select ward</label>
                    <select className='w-full p-2 rounded-md outline outline-[1px] outline-gray-300' name="ward" id="ward">
                        <option value="" disabled>Select Ward</option>
                        <option value="ward1">Ward 1</option>
                        <option value="ward2">Ward 2</option>
                        <option value="ward3">Ward 3</option>
                        <option value="ward4">Ward 4</option>
                    </select>
                </div>

                <div>
                    <label className='!sr-only' htmlFor="status">Select status</label>
                    <select className='w-full p-2 rounded-md outline outline-[1px] outline-gray-300' name="status" id="status">
                        <option value="" disabled>Select Status</option>
                        <option value="active">Active</option>
                        <option value="resolved">Resolved</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                    <label className='!sr-only' htmlFor="issye">Select issue</label>
                    <select className='w-full p-2 rounded-md outline outline-[1px] outline-gray-300' name="issue_type" id="issue">
                        <option value="" disabled>Select Issue</option>
                        <option value="cleanliness">Cleanliness</option>
                        <option value="electrical">Electrical</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="other">Other</option>
                    </select>
                <div>

                </div>
                    <label className='!sr-only' htmlFor="department">Select Department</label>
                    <select className='w-full p-2 rounded-md outline outline-[1px] outline-gray-300' name="department" id="department">
                        <option value="" disabled>Select department</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="security">Security</option>
                    </select>

                <div>
                    <label className='!sr-only' htmlFor="department">Select Priority</label>
                    <select className='w-full p-2 rounded-md outline outline-[1px] outline-gray-300' name="priority" id="priority">
                        <option value="" disabled>Select Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        
                    </select>
                </div>

            </form>
        <section>

        </section>

        <section>

        </section>
    </main>
  )
}

export default TicketSystem