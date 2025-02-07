module.exports = {
  siteUrl: 'https://oneromeo.com', 
  generateRobotsTxt: true,
  exclude: ['/login', '/dashboard', '/dashboard/*' ,'/api', '/api/*'],  // Exclude both /dashboard and any sub-pages
  additionalPaths: async (config) => {
    const quizSlugs = await fetchQuizSlugs();
    // Create a URL for each quiz slug
    return quizSlugs.map((slug) => ({
      loc: `/quiz/${slug}`, // Add the correct path here for your quizzes
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    }));
  },
  changefreq: 'daily',
  priority: 0.7,
};

async function fetchQuizSlugs() {
  const response = await fetch('https://oneromeo.com/api/fetchQuizzes', {
    method: 'POST', // Ensure you're using the correct method
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quizzes, status: ${response.status}`);
  }

  try {
    const quizzes = await response.json();
    // Access quizzes from the 'quizzes' key in the response
    if (!quizzes.quizzes || !Array.isArray(quizzes.quizzes)) {
      throw new Error('Invalid data format received.');
    }

    const quizSlugs = quizzes.quizzes.map((quiz) => quiz.slug); // Return an array of slugs
    return quizSlugs;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return [];  // Return an empty array if there's an error parsing JSON
  }
}

