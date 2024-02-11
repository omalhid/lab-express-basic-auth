document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("lab-express-basic-auth JS imported successfully!");
  },
  false
);

document.getElementById("goBack").addEventListener("click", goBack);
document.getElementById("goHome").addEventListener("click", goToHomePage);
function goBack() {
  window.history.back();
}
function goToHomePage() {
  window.location.href = "/";
}
