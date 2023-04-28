const addPost = () => {
    const contentElement = document.getElementById("content");
    const date = new Date();
    document.getElementById("postList").innerHTML += `<div class="post"><h2>Me</h2><p>${contentElement.value}</p><span>${date.toDateString()}</span></div>`;
    contentElement.value = "";
}

(function initializeApp() {
    document.getElementById("postButton").addEventListener("click", addPost);
})();