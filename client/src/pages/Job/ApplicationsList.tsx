import axios from "axios";
import React, { useEffect, useState } from "react";

interface JobIdProps {
  jobId: string;
}

interface Candidate {
  resumeUrl: string;
  parsed_fields: string;
}

const ApplicationsList: React.FC<JobIdProps> = ({ jobId }) => {
  const [candidateData, setCandidateData] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/applications/applicant",
          { jobId },
          { withCredentials: true }
        );
        setCandidateData(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchCandidates();
    }
  }, [jobId]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Applicants</h2>

      {loading ? (
        <p className="text-gray-500">Loading applications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : candidateData.length === 0 ? (
        <p className="text-gray-500">No applicants for this job yet.</p>
      ) : (
        <div className="space-y-4">
          {candidateData.map((candidate, index) => (
            <div key={index} className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-medium text-gray-700">Applicant {index + 1}</h3>
              <p className="text-sm text-gray-600">{candidate.parsed_fields}</p>
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Resume
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
