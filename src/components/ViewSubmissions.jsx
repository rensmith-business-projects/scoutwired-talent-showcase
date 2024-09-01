import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubmissions } from '@/lib/api';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from '@/lib/samlAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewSubmissions = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(false);
    if (isAuthenticated && location.pathname === '/auth-redirect') {
      navigate('/submissions');
    }
  }, [isAuthenticated, location, navigate]);

  const { data: submissions, isLoading: isLoadingSubmissions, error } = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
    enabled: isAuthenticated,
  });

  const handleLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect();
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Checking authentication status...</div>;
  }

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

  if (isLoadingSubmissions) return <div className="text-center p-4">Loading submissions...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error loading submissions: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Talent Submissions</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions && submissions.map((submission) => (
          <Card key={submission.id} className="flex flex-col">
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
