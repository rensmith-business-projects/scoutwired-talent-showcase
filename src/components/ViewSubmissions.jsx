import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubmissions } from '@/lib/api';

const ViewSubmissions = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const correctPassword = 'scoutwired123'; // In a real app, this would be handled securely on the server

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
    enabled: isAuthenticated,
  });

  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[90%] max-w-[350px]">
          <CardHeader>
            <CardTitle className="text-center">Enter Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mb-4"
            />
            <Button onClick={handleLogin} className="w-full">Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <div className="text-center p-4">Loading submissions...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error loading submissions: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Talent Submissions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{submission.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-2"><strong>Talent:</strong> {submission.talentDescription}</p>
              <p className="mb-4"><strong>Discord:</strong> {submission.discordUsername}</p>
              <video src={submission.videoUrl} controls className="w-full h-48 object-cover rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewSubmissions;