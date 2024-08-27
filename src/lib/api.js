// This is a mock API file. Replace these functions with actual API calls when you have a backend.
import { useState } from 'react';

let submissions = [];

export const submitTalent = async (data) => {
  const newSubmission = {
    id: Date.now(),
    ...data,
  };
  submissions.push(newSubmission);
  return newSubmission;
};

export const getSubmissions = async () => {
  return submissions;
};