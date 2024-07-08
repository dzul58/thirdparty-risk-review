import React, { useState } from 'react';
import axios from 'axios';

const FormComplaint = ({ item, onClose, onSubmitSuccess }) => {
  const [complaintForm, setComplaintForm] = useState({
    MTTR: '',
    reason: '',
    photo: '',
  });

  const handleComplaintInputChange = (e) => {
    setComplaintForm({ ...complaintForm, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      setComplaintForm({ ...complaintForm, photo: response.data.imageUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/api/complaint/${item.tpty_third_no}/${item.mlink_cid_main}/${item.Link}`,
        complaintForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.access_token}`,
          },
        }
      );
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Submit Complaint</h2>
        <form onSubmit={handleComplaintSubmit}>
          <div className="mb-4">
            <label htmlFor="MTTR" className="block text-sm font-medium text-gray-700">MTTR (seconds)</label>
            <input
              type="number"
              id="MTTR"
              name="MTTR"
              value={complaintForm.MTTR}
              onChange={handleComplaintInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              id="reason"
              name="reason"
              value={complaintForm.reason}
              onChange={handleComplaintInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Upload Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleFileUpload}
              className="mt-1 block w-full"
              accept="image/*"
              required
            />
          </div>
          {complaintForm.photo && (
            <div className="mb-4">
              <img src={complaintForm.photo} alt="Uploaded" className="w-full h-auto" />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormComplaint;