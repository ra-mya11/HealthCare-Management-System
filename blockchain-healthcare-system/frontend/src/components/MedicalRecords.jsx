import React, { useState, useEffect } from 'react';
import { getMedicalRecords } from '../services/api';

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await getMedicalRecords();
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const getRecordIcon = (type) => {
    switch(type) {
      case 'lab_report': return '🧪';
      case 'prescription': return '💊';
      case 'diagnosis': return '🩺';
      case 'ai_prediction': return '🤖';
      case 'vitals': return '❤️';
      default: return '📄';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading records...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📋 Medical Records</h2>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
          ℹ️ Records uploaded by your doctor
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600">No medical records found</p>
          <p className="text-sm text-gray-500 mt-2">Your doctor will upload records after consultation</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <div key={record._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-4xl">{getRecordIcon(record.recordType)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg capitalize">
                      {record.recordType.replace('_', ' ')}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {new Date(record.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    
                    {record.vitals && (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {record.vitals.glucose && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-600">Glucose</p>
                            <p className="font-semibold">{record.vitals.glucose} mg/dL</p>
                          </div>
                        )}
                        {record.vitals.bmi && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-600">BMI</p>
                            <p className="font-semibold">{record.vitals.bmi}</p>
                          </div>
                        )}
                        {record.vitals.bloodPressure && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-600">BP</p>
                            <p className="font-semibold">{record.vitals.bloodPressure} mmHg</p>
                          </div>
                        )}
                        {record.vitals.cholesterol && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-600">Cholesterol</p>
                            <p className="font-semibold">{record.vitals.cholesterol} mg/dL</p>
                          </div>
                        )}
                      </div>
                    )}

                    {record.ipfsHash && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <span className="text-gray-600">🔗 IPFS:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {record.ipfsHash.substring(0, 20)}...
                        </code>
                      </div>
                    )}

                    {record.blockchainTxHash && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="text-gray-600">⛓️ Blockchain:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {record.blockchainTxHash.substring(0, 20)}...
                        </code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded transition">
                    View
                  </button>
                  <button className="text-gray-600 hover:bg-gray-50 px-3 py-1 rounded transition">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blockchain Info */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-2">🔐 Blockchain Security</h3>
        <p className="text-sm opacity-90">
          All your medical records are secured on the Ethereum blockchain. 
          Records are uploaded by your doctor and cannot be modified.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{records.length}</p>
            <p className="text-xs opacity-90">Total Records</p>
          </div>
          <div>
            <p className="text-2xl font-bold">100%</p>
            <p className="text-xs opacity-90">Encrypted</p>
          </div>
          <div>
            <p className="text-2xl font-bold">∞</p>
            <p className="text-xs opacity-90">Immutable</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalRecords;
