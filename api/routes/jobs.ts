import express from 'express';
import { Job } from '../models/job';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/create-job', authMiddleware, roleMiddleware('recruiter'), async (req, res) => {
  const {title, description, status} = req.body
 try {
  const job = new Job({
    title,
    description,
    status,
    recruiterId: req.user!.id
  });
  await job.save();
  console.log("iss", job)
  res.status(201).json(job);
 } catch (error) {
 console.log(error)
 }
});

router.get('/', async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

router.get("/listedJob", authMiddleware, roleMiddleware('recruiter'), async(req, res)=>{

  try {
    const job = await Job.find({
      recruiterId: req.user?.id
    })
    res.status(200).json(job)
  } catch (error) {
    console.log(error)
  }
})

router.get('/:id', authMiddleware, roleMiddleware('recruiter'), async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job)  res.status(404).json({ message: 'Job not found' });
  res.json(job);
});
router.put('/:id', authMiddleware, roleMiddleware('recruiter'), async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!job)  res.status(404).json({ message: 'Job not found' });
  res.json(job);
});

router.delete('/:id', authMiddleware, roleMiddleware('recruiter'), async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job)  res.status(404).json({ message: 'Job not found' });
  res.json({ message: 'Job deleted' });
});

export default router;