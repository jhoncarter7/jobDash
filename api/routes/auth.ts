import express from 'express';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role });
        await user.save();
         res.status(201).send('User registered');
    } catch (error) {
        next(error);
    }
 
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compareSync(password, user.password))) {
     res.status(401).json({ message: 'Invalid credentials' });
     return
  }
  const token = await jwt.sign({ id: user?._id, role: user?.role }, process.env.JWT_SECRET!);
  const { password: pass, ...rest } = user.toObject();
    res.cookie("access_token", token, { httpOnly: true,  secure: false, sameSite: "lax" }).status(200).json(rest);
  //  res.status(200).json({token, user: user?.role});
   
  } catch (error) {
    next(error);
  }
});

export default router;