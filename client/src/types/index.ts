export interface User {
    id: string;
    email: string;
    role: 'recruiter' | 'candidate';
  }
  
  export interface Job {
    _id: string;
    title: string;
    description: string;
    status: 'open' | 'closed';
  }
  
  export interface Application {
    id: string;
    candidateId: string;
    jobId: string;
    resumeUrl: string;
    parsed_fields: { [key: string]: unknown };
  }