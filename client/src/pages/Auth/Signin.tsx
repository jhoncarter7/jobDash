import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SignInProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}


const SignIn: React.FC<SignInProps> = ({setIsAuthenticated}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
     
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password
      }, {
        withCredentials: true 
      })
       if(!res){
        return
       }
       console.log("res", res)
      if(res.data.role == "recruiter" ){
        navigate('/RecruiterPage')
      }else{
        navigate("/jobs")
      }
      setIsAuthenticated(true)
      setIsLoading(false);
    } catch (err) {
      setError(`Login failed. Please check your credentials. ${err}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Sign in to continue to your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-400 h-5 w-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400 h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400 h-5 w-5" />
                ) : (
                  <Eye className="text-gray-400 h-5 w-5" />
                )}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="flex gap-2.5 mt-6 items-center justify-between">
            <a 
              href="#" 
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot password?
            </a>
            <div className='flex justify-between items-center gap-2.5'>
              <p>New user ? </p>
              <a 
              
              className="text-sm text-purple-600 hover:underline cursor-pointer"
              onClick={()=> navigate('/signup')}
            >
             Signup
            </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;