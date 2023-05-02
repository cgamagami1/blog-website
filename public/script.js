
const toggleEditPost = (e) => {
    const formElement = e.target.parentNode.parentNode.nextElementSibling;

    formElement.classList.toggle("hidden");
}

const toggleShowComments = (e) => {
    const commentElement = e.target.parentNode.parentNode.nextElementSibling.nextElementSibling;

    commentElement.classList.toggle("hidden");
}

(function initializeApp() {
    for (const element of document.querySelectorAll(".edit")) {
        element.addEventListener("click", toggleEditPost);
    }
    for (const element of document.querySelectorAll(".show-comments")) {
        element.addEventListener("click", toggleShowComments);
    }
})();