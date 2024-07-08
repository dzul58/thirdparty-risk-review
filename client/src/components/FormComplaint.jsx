// components/FormComplaint.jsx

import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const FormComplaint = ({ item, onClose, onSubmitSuccess }) => {
  const [complaintForm, setComplaintForm] = useState({
    MTTR: '',
    reason: '',
    photos: [],
  });

  const handleComplaintInputChange = (e) => {
    setComplaintForm({ ...complaintForm, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      return axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
    });

    try {
      const responses = await Promise.all(uploadPromises);
      const newPhotos = responses.map(response => response.data.imageUrl);
      setComplaintForm(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    } catch (error) {
      console.error('Error uploading files:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Error',
        text: 'There was an error uploading one or more files.',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    setComplaintForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
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
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Complaint has been successfully created.',
        confirmButtonColor: '#3085d6',
      });

      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while submitting the complaint.',
        confirmButtonColor: '#3085d6',
      });
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
            <label htmlFor="photos" className="block text-sm font-medium text-gray-700">Upload Photos</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handleFileUpload}
              className="mt-1 block w-full"
              accept="image/*"
              multiple
            />
          </div>
          {complaintForm.photos.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              {complaintForm.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img src={photo} alt={`Uploaded ${index + 1}`} className="w-full h-auto" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
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
