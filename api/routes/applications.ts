import express, { Router } from 'express';
import multer from 'multer';
import { Application } from '../models/application';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post(
  '/',
  authMiddleware,
  roleMiddleware('candidate'),
  upload.single('resume'),
  async (req, res) => {
    const { jobId, resumeData, file } = req.body;
    const resumeUrl = `/uploads/${file!.filename}`;
   console.log("jobid", jobId, file)
    const parsed_fields = resumeData;
    const application = new Application({
      candidateId: req.user!.id,
      jobId,
      resumeUrl,
      parsed_fields,
    });
    await application.save();
    res.status(201).json(application);
  }
);

router.post('/applicant',  authMiddleware,
  roleMiddleware('recruiter'), async(req, res)=>{
   const {jobId} = req.body
   try {
    const applications  = await Application.find({
      jobId
    })
    res.status(200).json(applications)
   } catch (error) {
    console.log(error)
   }
  })

export default router;