const API_URL = 'https://gottalent.scoutwired.org/api';

export const submitTalent = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: "Talent submitted successfully", data };
    } else {
      const text = await response.text();
      console.error('Received non-JSON response:', text);
      if (response.status === 413) {
        throw new Error('File size too large. Please upload a smaller file (max 100GB).');
      }
      throw new Error(`Received non-JSON response. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error submitting talent:', error);
    throw error;
  }
};

export const getSubmissions = async () => {
  try {
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch submissions. Status: ${response.status}`);
      }
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Received non-JSON response:', text);
      throw new Error(`Received non-JSON response. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw new Error(`Failed to fetch submissions: ${error.message}`);
  }
};

export const getVideoUrl = (submissionId) => {
  return `${API_URL}/video/${submissionId}`;
};