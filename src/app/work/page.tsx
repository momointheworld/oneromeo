import Articles from "@/components/articles";

const content = [
    {
       "title": "Article title 1",
       "summary": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia unde id quaerat quas aspernatur quo expedita. Excepturi at nulla quas quae molestias enim aut eaque dolores doloremque dolore, in tempore?"
    },
    {
        "title": "Article title 2",
        "summary": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia unde id quaerat quas aspernatur quo expedita. Excepturi at nulla quas quae molestias enim aut eaque dolores doloremque dolore, in tempore?"
         }
]

function Work() {
    return (
       <div className="flex flex-col px-8 mt-16 max-w-5xl">
        <div className="lg:px-8">
        <h1>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Id odio ut quidem eligendi? Quaerat ut sit iste, dolorem accusamus vero, voluptatem neque exercitationem modi quos illo dolor.</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non repellat suscipit exercitationem laboriosam optio quam placeat aut unde dicta odio id dolorem, expedita ullam nam sapiente ad neque enim consectetur?</p>
       </div>
       <Articles articles={content} />
       </div>
    )
}

export default Work;