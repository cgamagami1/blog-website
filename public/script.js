const deletePost = async (e) => {
    const postID = e.target.parentNode.parentNode.id;

    await fetch("/delete", {
        method: "POST",
        body: JSON.stringify({ postID })
    })

    window.location.replace("/recent");
}

const toggleEditPost = (e) => {
    const formElement = e.target.parentNode.parentNode.nextElementSibling;

    formElement.classList.toggle("hidden");
}

(function initializeApp() {
    for (const element of document.querySelectorAll(".delete")) {
        element.addEventListener("click", deletePost);
    }
    for (const element of document.querySelectorAll(".edit")) {
        element.addEventListener("click", toggleEditPost);
    }
})();