import { AddEmployee } from '@/components/AddEmployee';
import { AuthContext } from '@/providers/Auth';
import React, { useContext, useState } from 'react';

function Employee() {
  const [employee, setEmployee] = useState();
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext)

  return (
    <>
      <AddEmployee
        onCreate={
          () => {
            window.location.reload()
          }
        }
        open={open}
        setOpen={setOpen}
        employee={user}
      />
      <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden md:max-w-2xl mt-10">
        <div className="md:flex">
          <div className="w-full p-4">
            <div className="uppercase tracking-wide text-sm text-[20px] text-indigo-500 font-semibold">My Details</div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <p className="text-lg leading-tight font-semibold text-gray-900">{user?.name}</p>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <p className="text-lg leading-tight font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Title:</label>
              <p className="text-lg leading-tight font-semibold text-gray-900">{user?.title}</p>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Salary:</label>
              <p className="text-lg leading-tight font-semibold text-gray-900">{user?.salary}</p>
            </div>
            <button className='mt-4 bg-blue-500 rounded text-white p-1' onClick={() => setOpen(true)}>Edit Profile</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Employee;
