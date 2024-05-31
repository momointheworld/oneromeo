import { format } from 'date-fns';
import Link from 'next/link';
import { db } from '@/db';
import paths from '@/components/paths';
import Profile from '@/components/profile';

export const revalidate = 3; // re-render in every 3 seconds
export default async function Dashboard() {
  const posts = await db.post.findMany({ orderBy: { date: 'desc' } }); // Ordering posts by date in descending order
  const latestPosts = posts.slice(0, 5); // Get the latest 5 posts
  const renderPosts = latestPosts.map((post) => {
    const formattedDate = format(new Date(post.date), 'MMMM d, yyyy');
    return (
      <Link
        key={post.id}
        href={paths.showSinglePost(post.id)}
        className="flex justify-between items-center p-2 border rounded hover:bg-stone-50 no-underline"
      >
        <div className="text-zinc-500">
          {formattedDate} | {post.title}
        </div>
        {/* <div>{post.categoryIDs}</div> */}
        <div>view</div>
      </Link>
    );
  });

  const quizzes = await db.quiz.findMany({ orderBy: { date: 'desc' } });
  const latestQuizzes = quizzes.slice(0, 5); // Get the latest 5 quizzes
  const renderQuizzes = latestQuizzes.map((quiz) => {
    const formattedDate = format(new Date(quiz.date), 'MMMM d, yyyy');
    return (
      <Link
        key={quiz.id}
        href={paths.showSingleQuiz(quiz.id)}
        className="flex justify-between items-center p-2 border rounded hover:bg-stone-50 no-underline"
      >
        <div className="text-zinc-500">
          {formattedDate} | {quiz.quizName}
        </div>
        <div>view</div>
      </Link>
    );
  });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center sm:flex-row">
        <h1 className="text-xl font-bold">Latest Posts</h1>
        <div className="flex sm:flex-row">
          <Link
            href={'/dashboard/posts/new-post'}
            className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
          >
            Create New Post
          </Link>
          <Link
            href={'/dashboard/posts/'}
            className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
          >
            View All Posts
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-5">
        {renderPosts}
        {/* {DisplayPostsByCategory} */}
      </div>
      <div className="flex justify-between items-center mt-10">
        <h1 className="text-xl font-bold">Latest Quizzes</h1>
        <div className="flex sm:flex-row">
          <Link
            href={'/dashboard/quizzes/new-quiz'}
            className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
          >
            Create New Quiz
          </Link>
          <Link
            href={'/dashboard/quizzes/'}
            className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
          >
            View All Quizzes
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-5">{renderQuizzes}</div>
    </div>
  );
}
