import React, { useState } from 'react';
import api from '../api/axios';
import Button from './Button';

const ComplaintModal = ({ isOpen, onClose, transactionId }) => {
  const [reason, setReason] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || !videoFile) {
      setError('Please provide a reason and a video proof.');
      return;
    }

    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('complaintVideo', videoFile); 

    setLoading(true);
    setError('');
    try {
      const { token } = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      await api.post(`/transactions/${transactionId}/complain`, formData, config);
      alert('Complaint submitted successfully. An admin will review your case.');
      onClose(); 
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-orange-400">File a Complaint</h2>
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium mb-1">Reason for Complaint</label>
            <textarea
              id="reason"
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg"
              placeholder="Explain the issue with the item..."
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="complaintVideo" className="block text-sm font-medium mb-2">Upload Unboxing Video Proof</label>
            <input
              id="complaintVideo"
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-orange-600 hover:file:bg-orange-100"
            />
            <p className="text-xs text-gray-500 mt-1">Max size: 50MB. Allowed formats: MP4, WEBM, MOV.</p>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700">
              Cancel
            </Button>
            
            <Button type="submit" disabled={loading} variant="danger">
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;