import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SubmissionSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="text-center text-white">
        <CheckCircle className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Submission Successful!</h1>
        <p className="text-xl mb-8 max-w-md mx-auto">
          Thank you for sharing your talent with us. We're excited to review your submission!
        </p>
        <div className="space-y-4">
          <Button asChild className="bg-white text-green-600 hover:bg-gray-100">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button asChild className="bg-green-600 text-white hover:bg-green-700">
            <Link to="/submissions">View All Submissions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;