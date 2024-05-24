import Link from "next/link";
import { format } from 'date-fns';
import { db } from "@/db"
import paths from "@/components/paths";
import PageBreadCrumbs from "@/components/common/breadcrumbs";


interface Breadcrumb {
  href: string;
  text: string;
}

export default async function RenderAllQuizzesPage() {
    const quizzes = await db.quiz.findMany({ orderBy: { date: 'desc' } });
    const breadcrumbs: Breadcrumb[] = [
      { href: paths.dashboard(), text: 'Dashboard' },
      { href: paths.showAllQuizzes(), text: 'Quizzes' },
  ];
    const renderQuizzes = quizzes.map((quiz)=> {
      const formattedDate = format(new Date(quiz.date), 'MMMM d, yyyy');
        return(
          <Link 
          key={quiz.id}
          href={paths.showSingleQuiz(quiz.id)}
          className="flex justify-between items-center p-2 border rounded no-underline"
          >
            <div className='text-zinc-500'> {formattedDate} | {quiz.quizName}</div> 
            <div>view</div>
          </Link>
        )
    })

    return(
      <div>
            <PageBreadCrumbs items={breadcrumbs}/>
        <div className='flex flex-col'>
          <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Quizzes</h1>
                <div>
                <Link href={paths.createNewQuiz()} 
                className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline">Create Quiz</Link>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">
          {renderQuizzes}
          </div>
        </div>
      </div>
    )
}


