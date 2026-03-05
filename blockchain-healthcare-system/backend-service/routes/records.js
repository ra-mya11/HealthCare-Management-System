const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');

const router = express.Router();

// Upload medical record
router.post('/upload', auth, async (req, res) => {
  try {
    const { recordType, ipfsHash, blockchainTxHash, vitals, notes } = req.body;
    
    const record = new HealthRecord({
      patient: req.user.role === 'patient' ? req.userId : req.body.patientId,
      recordType,
      ipfsHash,
      blockchainTxHash,
      vitals,
      notes,
      uploadedBy: req.userId
    });
    
    await record.save();
    
    res.status(201).json({
      message: 'Record uploaded successfully',
      record
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient records
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'patient' 
      ? { patient: req.userId }
      : req.query.patientId 
        ? { patient: req.query.patientId }
        : {};
    
    const records = await HealthRecord.find(query)
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single record
router.get('/:id', auth, async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('uploadedBy', 'name role');
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    // Check access
    if (req.user.role === 'patient' && record.patient._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Grant access (placeholder - actual implementation in smart contract)
router.post('/grant-access', auth, authorize('patient'), async (req, res) => {
  try {
    const { recordId, doctorAddress } = req.body;
    
    // This would interact with the blockchain smart contract
    // For now, just return success
    
    res.json({
      message: 'Access granted successfully',
      recordId,
      doctorAddress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Revoke access (placeholder - actual implementation in smart contract)
router.post('/revoke-access', auth, authorize('patient'), async (req, res) => {
  try {
    const { recordId, doctorAddress } = req.body;
    
    // This would interact with the blockchain smart contract
    
    res.json({
      message: 'Access revoked successfully',
      recordId,
      doctorAddress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
