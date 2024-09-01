const API_URL = 'http://localhost:3001/api';

export const submitTalent = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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
    const response = await fetch(`${API_URL}/submissions`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch submissions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
};
