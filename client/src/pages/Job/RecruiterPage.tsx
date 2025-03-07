import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Plus, Eye, Briefcase, FileText, ArrowLeft, Trash2 , Pencil  } from 'lucide-react';
import { toast } from "react-toastify";
import ApplicationsList from "./ApplicationsList";

interface Job {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'closed';
  applicantsCount: number;
}

interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  resumeUrl: string;
  parsedFields: {
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: string[];
    education?: string[];
  };
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}

const RecruiterPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'open' | 'closed'>('open');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [viewingApplications, setViewingApplications] = useState(false);
   const [updateJob, setUpdateJob] = useState<boolean>(false)
   const [updateJobId, setUpdateJobId] = useState<string>("")
  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch applications when a job is selected
  useEffect(() => {
    if (selectedJobId) {
      fetchApplicationsForJob(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/jobs/listedJob", {
        withCredentials: true
      });
      console.log("jobs", response.data)
      if (!response) {
        return;
      }
      setJobs(response.data);
    } catch (err) {
      setError(`Failed to load jobs: ${err}`);
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicationsForJob = async (jobId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
        withCredentials: true
      });
      if (!response) {
        return;
      }
      setApplications(response.data);
      setViewingApplications(true);
    } catch (err) {
      setError(`Failed to load applications: ${err}`);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post("http://localhost:5000/api/jobs/create-job", {
        title,
        description,
        status
      }, {
        withCredentials: true
      });
      
      if (!response) {
        return;
      }
      
      toast.success("Job created successfully");
      setTitle('');
      setDescription('');
      setStatus('open');
      fetchJobs(); 

    } catch (err) {
      setError(`Job creation failed: ${err}`);
      toast.error("Failed to create job");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.put(`http://localhost:5000/api/jobs/${updateJobId}`, {
        title,
        description,
        status
      }, {
        withCredentials: true
      });
      
      if (!response) {
        return;
      }
      
      toast.success("Job updated successfully");
      setTitle('');
      setDescription('');
      setStatus('open');
      fetchJobs(); 

    } catch (err) {
      setError(`Job creation failed: ${err}`);
      toast.error("Failed to create job");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewApplications = (jobId: string) => {
    setSelectedJobId(jobId);
  };


  const handleGetSingleJob = async(jobId: string)=> {
   
    const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
      withCredentials: true
    });
    console.log(response.data)
    setTitle(response.data.title)
    setDescription(response.data.description)
    setStatus(response.data.status)
    setUpdateJob(true)
    setUpdateJobId(jobId)
  }

   const handleDeleteJob = async(jobId: string)=>{
      const res = await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        withCredentials: true
      })
      console.log(res.data.message)
   }
  const handleBackToJobs = () => {
    setViewingApplications(false);
    setSelectedJobId(null);
  };

  // Helper to find selected job details
  const getSelectedJob = () => {
    return jobs.find(job => job._id === selectedJobId);
  };
  
  // Display applications for the selected job
  if (viewingApplications && selectedJobId) {
    const selectedJob = getSelectedJob();
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={handleBackToJobs}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2" />
            Back to Jobs
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Applications for: {selectedJob?.title || 'Selected Job'}
          </h1>
          
          {applications.length === 0 ? (
            <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
              <p className="text-gray-500 text-lg">No applications received for this job yet.</p>
            </div>
          ) : (
            <ApplicationsList  jobId={selectedJobId} />
          )}
        </div>
      </div>
    );
  }
  
 
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center">
          <Briefcase className="mr-4 text-purple-600" />
          Recruiter Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
       
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Plus className="mr-2 text-green-600" />
              Create New Job
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={updateJob ?  handleSubmitUpdate :handleSubmit} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Job Title"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Job Description"
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'open' | 'closed')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                updateJob ? "Update Job" : "Create Job"
                )}
              </button>
            </form>
          </div>

          {/* Job Listing */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FileText className="mr-2 text-blue-600" />
              Your Job Listings
            </h2>

            {isLoading && jobs.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No jobs created yet
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div 
                    key={job._id} 
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col gap-x-1">
                      <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                      <p className="text-sm text-gray-500">
                        Status: <span className={job.status === 'open' ? 'text-green-500' : 'text-red-500'}>
                          {job.status}
                        </span>
                        {job.applicantsCount !== undefined && (
                          <span className="ml-2"> | {job.applicantsCount} Applicants</span>
                        )}
                      </p>
                    </div>
                   <div className="">
                   <button
                      onClick={() => handleViewApplications(job._id)}
                      className="bg-blue-50 text-blue-600 px-3 rounded-lg hover:bg-blue-100 flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleGetSingleJob(job._id) }
                      className="bg-blue-50 text-blue-600 px-3 rounded-lg hover:bg-blue-100 flex items-center"
                    >
                      <Pencil  className="mr-2 h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="bg-blue-50 text-red-600 px-3 rounded-lg hover:bg-blue-100 flex items-center"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                      Delete
                    </button>
                   </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterPage;