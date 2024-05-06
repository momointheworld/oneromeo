
const paths =  {
    dashboard() {
        return '/dashboard';
    },
    showAllPosts() {
        return `/dashboard/posts/`
    },
    showAllCategories(){
        return `/dashboard/posts/categories`
    },
    showCategoryPosts(categorySlug: string) {
        return `/dashboard/posts/categories/${categorySlug}`
    },
    showSinglePost(postId: string) {
        return `/dashboard/posts/${postId}`
    },
    createNewPost(){
        return `/dashboard/posts/new-post`
    },
    showAllQuizzes(){
        return '/dashboard/quizzes'
    },
    createNewQuiz(){
        return '/dashboard/quizzes/new-quiz'
    },
}

export default paths;