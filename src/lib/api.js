// Mock API functions for frontend development

export const submitTalent = async (formData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate successful submission
  if (Math.random() > 0.1) { // 90% success rate
    return { success: true, message: "Talent submitted successfully" };
  } else {
    throw new Error("Failed to submit talent. Please try again.");
  }
};

export const getSubmissions = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate fetching submissions
  const mockSubmissions = [
    { id: 1, name: "John Doe", talentDescription: "Juggling", discordUsername: "johnd#1234", videoUrl: "https://example.com/video1.mp4" },
    { id: 2, name: "Jane Smith", talentDescription: "Singing", discordUsername: "janes#5678", videoUrl: "https://example.com/video2.mp4" },
    { id: 3, name: "Alex Johnson", talentDescription: "Magic Tricks", discordUsername: "alexj#9012", videoUrl: "https://example.com/video3.mp4" },
  ];

  if (Math.random() > 0.1) { // 90% success rate
    return mockSubmissions;
  } else {
    throw new Error("Failed to fetch submissions. Please try again.");
  }
};
