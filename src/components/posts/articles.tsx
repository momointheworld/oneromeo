interface Article {
    title: string;
    summary: string;
  }

function Articles({ articles }: { articles: Article[] }) {
    return(
       
        <div className="flex max-w-3xl flex-col space-y-16">
            { articles.map((article, index) => (
        <article key={index} className="md:grid md:grid-cols-4 md:items-baseline">
        <time className="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500 pl-3.5">Dec 20, 2024</time>
        <div className="md:col-span-3 group relative flex flex-col items-start">
            <h2 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">{article.title}</h2>
            <div className="text-sm text-zinc-400 dark:text-zinc-500">{article.summary}</div>
            </div>
       </article>
       ))}
       </div>
       );
    }
export default Articles;