const API_URL = 'http://localhost:3001/api';

export const submitTalent = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Include credentials for CORS
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit talent');
    }
    const data = await response.json();
    return { success: true, message: "Talent submitted successfully", data };
  } catch (error) {
    console.error('Error submitting talent:', error);
    throw error;
  }
};

export const getSubmissions = async () => {
  try {
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'GET',
      credentials: 'include', // Include credentials for CORS
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        return []; // Return an empty array if no submissions are found
      }
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch submissions. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw new Error(`Failed to fetch submissions: ${error.message}`);
  }
};

export const getVideoUrl = (submissionId) => {
  return `${API_URL}/video/${submissionId}`;
};