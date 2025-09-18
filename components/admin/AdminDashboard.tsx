import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import Modal from '../common/Modal';
import { TextInput } from '../FormContainer';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const AdminDashboard: React.FC = () => {
  const { users, createUser, updateUser, deleteUser, currentUser } = useContext(AppContext);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newUserData, setNewUserData] = useState<{
    name: string; 
    username: string; 
    password: string; 
    role: UserRole; 
    department: string;
    registrationDate: string;
    signatureImage: string;
  }>({ name: '', username: '', password: '', role: 'assessor', department: '', registrationDate: '', signatureImage: '' });
  
  const handleOpenCreate = () => {
    setNewUserData({ name: '', username: '', password: '', role: 'assessor', department: '', registrationDate: new Date().toISOString().split('T')[0], signatureImage: '' });
    setIsCreateModalOpen(true);
  };
  
  const handleNewUserFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setNewUserData({...newUserData, signatureImage: base64});
    }
  };

  const handleEditUserFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingUser) {
        const base64 = await fileToBase64(e.target.files[0]);
        setEditingUser({...editingUser, signatureImage: base64});
    }
  };

  const handleCreateUser = () => {
      if (!newUserData.name.trim() || !newUserData.username.trim() || !newUserData.password.trim() || !newUserData.department.trim() || !newUserData.registrationDate) {
          alert('Please fill all required fields.');
          return;
      }
      createUser(newUserData.name, newUserData.username, newUserData.password, newUserData.role, newUserData.department, newUserData.registrationDate, newUserData.signatureImage);
      setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (user: User) => {
      setEditingUser({ ...user, registrationDate: user.registrationDate || new Date().toISOString().split('T')[0] });
      setIsEditModalOpen(true);
  };
  
  const handleUpdateUser = () => {
      if (!editingUser) return;
      if (!editingUser.name.trim() || !editingUser.username.trim() || !editingUser.department.trim()) {
        alert('Name, username and department cannot be empty.');
        return;
      }
      updateUser(editingUser);
      setIsEditModalOpen(false);
      setEditingUser(null);
  };

  const handleDeleteUser = (userId: number) => {
      if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          deleteUser(userId);
      }
  };

  return (
    <div className="space-y-8">
      {/* User Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all"
          >
              + Add User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signature</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.registrationDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'reviewer' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.signatureImage ? <img src={user.signatureImage} alt="Signature" className="h-6 w-auto bg-gray-100 p-1 rounded"/> : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium space-x-2">
                    <button onClick={() => handleOpenEdit(user)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    {currentUser?.id !== user.id && <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create User Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New User" onConfirm={handleCreateUser} confirmText="Create User">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <TextInput value={newUserData.name} onChange={e => setNewUserData({...newUserData, name: e.target.value})} placeholder="e.g., John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <TextInput value={newUserData.username} onChange={e => setNewUserData({...newUserData, username: e.target.value})} placeholder="e.g., jdoe" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <TextInput value={newUserData.department} onChange={e => setNewUserData({...newUserData, department: e.target.value})} placeholder="e.g., IT Security" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <TextInput type="password" value={newUserData.password} onChange={e => setNewUserData({...newUserData, password: e.target.value})} placeholder="Enter a secure password" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Registration Date</label>
              <TextInput type="date" value={newUserData.registrationDate} onChange={e => setNewUserData({...newUserData, registrationDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select value={newUserData.role} onChange={e => setNewUserData({...newUserData, role: e.target.value as UserRole})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black">
                <option value="assessor">Assessor</option>
                <option value="reviewer">Reviewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Upload Signature</label>
                <input type="file" accept="image/*" onChange={handleNewUserFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                {newUserData.signatureImage && <img src={newUserData.signatureImage} alt="Signature Preview" className="mt-2 h-12 w-auto bg-gray-100 p-1 rounded"/>}
            </div>
          </div>
      </Modal>
      
      {/* Edit User Modal */}
      {editingUser && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit ${editingUser.name}`} onConfirm={handleUpdateUser} confirmText="Save Changes">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <TextInput value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <TextInput value={editingUser.username} onChange={e => setEditingUser({...editingUser, username: e.target.value})} />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <TextInput value={editingUser.department} onChange={e => setEditingUser({...editingUser, department: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <TextInput type="password" onChange={e => setEditingUser({...editingUser, password: e.target.value})} placeholder="Leave blank to keep current password" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                <TextInput type="date" value={editingUser.registrationDate} onChange={e => setEditingUser({...editingUser, registrationDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" disabled={currentUser?.id === editingUser.id}>
                <option value="assessor">Assessor</option>
                <option value="reviewer">Reviewer</option>
                <option value="admin">Admin</option>
              </select>
              {currentUser?.id === editingUser.id && <p className="text-xs text-gray-500 mt-1">You cannot change your own role.</p>}
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Upload New Signature</label>
                <input type="file" accept="image/*" onChange={handleEditUserFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                {editingUser.signatureImage && <div className="mt-2"><p className="text-xs text-gray-500 mb-1">Current Signature:</p><img src={editingUser.signatureImage} alt="Current Signature" className="h-12 w-auto bg-gray-100 p-1 rounded"/></div>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;