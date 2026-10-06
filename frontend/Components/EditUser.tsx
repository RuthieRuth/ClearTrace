'use client'
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

type User = {
  id: string;
  full_name: string;
  role: string;
  agency_type: string;
};

type Props = {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
};

const EditUser = ({ user, onClose, onSave }: Props) => {
  const [role, setRole] = useState(user.role);
  const [agencyType, setAgencyType] = useState(user.agency_type);
  const [confirmationBox, setConfirmationBox] = useState(false);
  const { getToken } = useAuth();

  const submitEdit = async () => {
    const token = await getToken();
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        { role, agency_type: agencyType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSave(response.data);
      setConfirmationBox(false);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  return (
    <div className='m-10 border rounded-lg p-6 bg-white'>
      <p onClick={onClose} className="flex items-end justify-end mb-4 hover:underline">close</p>

      <h1 className="font-semibold">EDIT USER</h1>
      <p className="mb-4">{user.full_name}</p>

      <div className="flex gap-5 mb-2">
        <p className="mt-1">Agency Role:</p>
        <label className="flex items-center gap-2">
          <input type="radio" name="editAgencyRole" value="agency_head" checked={role === 'agency_head'} onChange={(e) => setRole(e.target.value)} />
          Agency Head
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="editAgencyRole" value="agency_staff" checked={role === 'agency_staff'} onChange={(e) => setRole(e.target.value)} />
          Agency Staff
        </label>
      </div>

      <div className="flex gap-5 mb-5">
        <p className="mt-1">Agency Type:</p>
        <select
          className="border border-gray-300 rounded-md p-2"
          value={agencyType}
          onChange={(e) => setAgencyType(e.target.value)}>
          <option value="police">police</option>
          <option value="immigration">immigration</option>
          <option value="courts">courts</option>
          <option value="prisons">prisons</option>
          <option value="education">education</option>
          <option value="health">health</option>
        </select>
      </div>

      <button className='border p-2' onClick={submitEdit}>SAVE</button>
    </div>
  );
};

export default EditUser;
