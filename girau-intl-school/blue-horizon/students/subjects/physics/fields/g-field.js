document.addEventListener("DOMContentLoaded", function() {
    fetch("./fields-sims/gravity-force-lab_en.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
});