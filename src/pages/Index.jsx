import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Scoutwired's Got Talent</h1>
        <p className="text-2xl mb-8">Show off your skills and become the next big star!</p>
        <Button asChild className="bg-white text-purple-600 hover:bg-gray-100">
          <Link to="/submit">Submit Your Talent</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
