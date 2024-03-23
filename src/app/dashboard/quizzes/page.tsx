import Link from "next/link";
import { db } from "@/db"

export default async function Dashboard() {
    
    const quizzes = await db.quiz.findMany();
    const renderQuizzes = quizzes.map((quiz)=> {
        return(
          <Link 
          key={quiz.id}
          href={`/dashboard/quizzes/${quiz.id}`}
          className="flex justify-between items-center p-2 border rounded no-underline"
          >
            <div className='text-zinc-500'> {quiz.quizName}</div> 
            <div>view</div>
          </Link>
        )
    })


    return(
        <div className='flex flex-col'>
            <div className="my-5">
            <Link href={'/dashboard/'}>Dashboard</Link> {"\u00AB"} Quizzes
            </div>
          <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Quizzes</h1>
                <div>
                <Link href={'/dashboard/quizzes/new-quiz'} className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline">Create Quiz</Link>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">
          {renderQuizzes}
          </div>
        </div>
    )
}


