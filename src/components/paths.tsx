const paths = {
    home() {
        return '/'
    },
    price() {
        return '/price'
    },
    about() {
        return '/about'
    },
    contact() {
        return '/contact'
    },
    privacy() {
        return '/privacy'
    },
    terms() {
        return '/terms'
    },
    dashboard() {
        return '/dashboard'
    },
    login() {
        return '/login'
    },
    showAllPosts() {
        return `/dashboard/posts/`
    },
    showAllCategories() {
        return `/dashboard/posts/categories`
    },
    showCategoryPosts(categorySlug: string) {
        return `/dashboard/posts/categories/${categorySlug}`
    },
    showSinglePost(postId: string) {
        return `/dashboard/posts/${postId}`
    },
    showAllAppointments() {
        return '/dashboard/appointments'
    },
    createNewPost() {
        return `/dashboard/posts/new-post`
    },
    showAllQuizzes() {
        return '/dashboard/quizzes'
    },
    showSingleQuiz(quizId: string) {
        return `/dashboard/quizzes/${quizId}`
    },
    createNewQuiz() {
        return '/dashboard/quizzes/new-quiz'
    },
    editPost(postId: string) {
        return `/dashboard/posts/${postId}/edit`
    },
    editQuiz(quizId: string) {
        return `/dashboard/quizzes/${quizId}/edit`
    },
}

export default paths
