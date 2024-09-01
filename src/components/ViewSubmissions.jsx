import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubmissions } from '@/lib/api';
import { useMsal } from "@azure/msal-react";
import { initializeSAML, signInWithSAML, checkAuthStatus, signOut } from '@/lib/samlAuth';

const ViewSubmissions = () => {
  const { instance } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeSAML();
      const authStatus = await checkAuthStatus();
      setIsAuthenticated(authStatus);
    };
    init();
  }, []);

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
    enabled: isAuthenticated,
  });

  const handleLogin = async () => {
    try {
      await signInWithSAML();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[90%] max-w-[350px]">
          <CardHeader>
            <CardTitle className="text-center">MS365 Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full">Login with Microsoft 365</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <div className="text-center p-4">Loading submissions...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error loading submissions: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Talent Submissions</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
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
