import express from 'express';
import { handleCameraEntry, handleCameraExit } from '../controllers/cameraController.js';

const router = express.Router();

// These endpoints are usually called by the Raspberry Pi / OpenCV system
router.post('/entry', handleCameraEntry);
router.post('/exit', handleCameraExit);

export default router;
