module.exports = {
  siteUrl: 'http://localhost:3000',
  generateRobotsTxt: true,
  exclude: ['/login', '/dashboard', '/dashboard/*'],  // Exclude both /dashboard and any sub-pages
  additionalPaths: async (config) => {
    const dynamicPaths = await fetchQuizIds();  // Fetch quiz IDs dynamically
    return [
      ...dynamicPaths.map((quiz) =>
        config.transform(config, `/quiz/${quiz.id}`)  // Add dynamic quiz pages
      ),
    ];
  },
  changefreq: 'daily',
  priority: 0.7,
};

async function fetchQuizIds() {
  const response = await fetch('http://oneromeo.com/api/quizzes');   
  const quizzes = await response.json();
  return quizzes.data.map((quiz) => quiz.id);  // Return an array of quiz IDs
}
