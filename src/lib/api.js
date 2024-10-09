const API_URL = '/api';

export const submitTalent = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/create-submission`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, message: "Drawing submitted successfully", data };
  } catch (error) {
    console.error('Error submitting drawing:', error);
    throw error;
  }
};

export const getSubmissions = async () => {
  try {
    const response = await fetch(`${API_URL}/get-submissions`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
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

export const getDrawingUrl = (submissionId) => {
  return `${API_URL}/get-drawing/${submissionId}`;
};