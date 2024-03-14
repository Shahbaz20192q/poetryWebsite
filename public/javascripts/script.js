function stripHtmlTags(html) {
    // Create a temporary div element
    var tempDiv = document.createElement('div');

    // Set the HTML content of the div with your poetry
    tempDiv.innerHTML = html;

    // Get the text content without HTML tags
    var textContent = tempDiv.textContent || tempDiv.innerText;

    return textContent;
}

function shareContent(poetryContent) {
    var textContent = stripHtmlTags(poetryContent);
    if (navigator.share) {
        navigator
            .share({
                title: `share poetry`,
                text: textContent,
                // url: 'http://localhost:3000/write',
            })
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.log('Error sharing', error));
    } else {
        alert("Your browser doesn't support sharing. You can copy the link and share it manually.");
    }
}

function setPoetsHeight() {
    var subLink = document.getElementById("sub-link");
    var poetsList = subLink.querySelectorAll("li");
    var totalHeight = 0;

    poetsList.forEach(function (poet) {
        totalHeight += poet.offsetHeight;
    });

    subLink.style.height = totalHeight + "px";
}

function removePoetsHeight() {
    var subLink = document.getElementById("sub-link");
    subLink.style.height = "0px";
}