import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Job } from "../../types";
import pdfToText from "react-pdftotext";
import { toast } from "react-toastify";

interface signinProps{
  isAuthenticated: boolean
}

const JobListings: React.FC<signinProps> = ({isAuthenticated}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<{
    jobId: string | null;
    status: "idle" | "submitting" | "success" | "error";
    message: string;
  }>({
    jobId: null,
    status: "idle",
    message: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/jobs");
        
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApply = (jobId: string) => {
    if(!isAuthenticated){
      toast.error("please login")
      return
    }
    setApplying(jobId);
    setApplicationStatus({
      jobId: null,
      status: "idle",
      message: "",
    });
  };

  const handleFileSelection = async (
    e: React.ChangeEvent<HTMLInputElement>,
    jobId: string
  ) => {
    console.log("jobId", jobId)
    const file = e.target.files?.[0];
    if (!file) return;
    const resumeData = await pdfToText(file);
    if (!resumeData) {
      console.error("error while uploading resume");
      return;
    }
    console.log(resumeData);



    setApplicationStatus({
      jobId,
      status: "submitting",
      message: "Submitting your application...",
    });

 
      try {
        const res = await axios.post(
          "http://localhost:5000/api/applications",
          {
            resumeData,
            jobId,
            file
          },
          {
            withCredentials: true,
          }
        );
        console.log(res.data);

        if (!res) {
          console.error("failed to upload");
          setApplicationStatus({
            jobId,
            status: "error",
            message: "filed while uploading!",
          });
          return;
        }
        setApplicationStatus({
          jobId,
          status: "success",
          message: "Your application has been submitted successfully!",
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        toast.error("if you are recruiter switch to candidate to apply");
        console.error(error);
      }
      setTimeout(() => {
        setApplying(null);
      }, 3000);

  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        <h3 className="mt-4 text-xl font-medium text-gray-700">
          Loading job listings...
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Available Positions
      </h1>

      {jobs.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg shadow">
          <h3 className="text-xl text-gray-600">
            No job listings available at the moment
          </h3>
          <p className="mt-2 text-gray-500">
            Please check back later for new opportunities
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <div
              key={job._id || index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
               <p>Job ID: {job._id}</p>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">
                    {job.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() =>
                      setSelectedJob(job._id)
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {selectedJob == job._id ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {selectedJob === job._id  && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-gray-700">
                    <h3 className="font-medium mb-2">Job Details</h3>
                    <p className="mb-2">{job.description}</p>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {applying === job._id ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3">
                            Apply for this position
                          </h4>
                          {applicationStatus.jobId === job._id ? (
                            <div
                              className={`p-3 rounded mb-3 ${
                                applicationStatus.status === "submitting"
                                  ? "bg-blue-50 text-blue-700"
                                  : applicationStatus.status === "success"
                                  ? "bg-green-50 text-green-700"
                                  : applicationStatus.status === "error"
                                  ? "bg-red-50 text-red-700"
                                  : ""
                              }`}
                            >
                              {applicationStatus.message}
                            </div>
                          ) : (
                            <div className="mb-3">
                              <label className="block text-gray-700 text-sm font-medium mb-2">
                                Upload your resume (PDF, DOCX)
                              </label>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFileSelection(e, job._id)}
                                accept=".pdf,.docx"
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Max file size: 5MB. Accepted formats: PDF, DOCX.
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end mt-3">
                            <button
                              onClick={() => setApplying(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium mr-2 hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                            {applicationStatus.status !== "success" &&
                              applicationStatus.status !== "submitting" && (
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600"
                                >
                                  Upload Resume
                                </button>
                              )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApply(job._id)}
                          className="w-full py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
