import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SignInProps {
    isAuthenticated: boolean;
  }
const Navbar = ({isAuthenticated}: SignInProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const isRecruiter = false
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
console.log("isAuthenticated", isAuthenticated)
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-shrink-0"
          >
            <a href="/" className="text-xl font-bold text-blue-600">JobFinder</a>
          </motion.div>

          {/* Desktop Nav Items */}
          <div className="hidden md:block">
            <motion.div 
              className="ml-10 flex items-center space-x-4"
              initial="hidden"
              animate="visible"
              variants={navVariants}
            >
              <motion.a 
                
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                variants={itemVariants}
                onClick={()=> navigate("/")}
              >
                Home
              </motion.a>
              <motion.a 
              
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                variants={itemVariants}
                onClick={()=> navigate("/jobs")}
              >
                Jobs
              </motion.a>
         
              {isAuthenticated && isRecruiter && (
                <motion.a 
                  
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  variants={itemVariants}
                  onClick={()=> navigate("/create-job")}
                >
                  Create Job
                </motion.a>
              )}
   
              {!isAuthenticated ? (
                <motion.a
                 
                  className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  variants={itemVariants}
                  onClick={()=> navigate("/signin")}
                >
                  Sign In
                </motion.a>
              ) : (
                <motion.a
                  href="/signout"
                  className="ml-2 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  variants={itemVariants}
                >
                  Sign Out
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Home
            </a>
            <a
              href="/jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Jobs
            </a>

            {isAuthenticated && isRecruiter && (
              <a
                href="/create-job"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                Create Job
              </a>
            )}
            
            {!isAuthenticated ? (
              <a
                href="/signin"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50"
              >
                Sign In
              </a>
            ) : (
              <a
                href="/signout"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </a>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;