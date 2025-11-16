// src/components/InviteModal.jsx
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function InviteModal({ isOpen, onClose, joinUrl }) {
  const [activeTab, setActiveTab] = useState('link');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl).then(() => {
      alert('Link copied!');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-[#2c2c34] text-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Invite friends to watch with you!</h2>
        <div className="flex border-b border-gray-600 mb-4">
          <button 
            className={`py-2 px-4 ${activeTab === 'link' ? 'border-b-2 border-yellow-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('link')}
          >
            Invitation link
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'qr' ? 'border-b-2 border-yellow-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('qr')}
          >
            QR-Code
          </button>
        </div>
        <div>
          {activeTab === 'link' && (
            <div>
              <p className="mb-2 text-gray-300">Copy and share this link:</p>
              <div className="flex">
                <input type="text" readOnly value={joinUrl} className="bg-[#1e1e24] border border-gray-600 rounded-l-md p-2 w-full"/>
                <button onClick={handleCopyLink} className="bg-blue-600 text-white font-semibold px-4 rounded-r-md hover:bg-blue-700">
                  Copy
                </button>
              </div>
            </div>
          )}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
              <QRCodeCanvas value={joinUrl} size={200} level="H" />
            </div>
          )}
        </div>
        <div className="mt-6 text-right">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteModal;