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
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Enter Password</CardTitle>
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

  if (isLoading) return <div>Loading submissions...</div>;
  if (error) return <div>Error loading submissions: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Talent Submissions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{submission.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Talent: {submission.talentDescription}</p>
              <p>Discord Username: {submission.discordUsername}</p>
              <video src={submission.videoUrl} controls className="w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewSubmissions;