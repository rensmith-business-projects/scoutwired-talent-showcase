import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">Scoutwired's Got Talent</h1>
        <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto">Show off your skills and become the next big star!</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Button asChild className="bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto">
            <Link to="/submit">Submit Your Talent</Link>
          </Button>
          <Button asChild className="bg-purple-600 text-white hover:bg-purple-700 w-full sm:w-auto">
            <Link to="/submissions">View Submissions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
