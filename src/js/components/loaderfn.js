export function _showLoader() {
  const loader = document.querySelector(".loader-container");

  if (loader) {
    loader.style.display = "flex";
  }
}

export function _hideLoader() {
  const loader = document.querySelector(".loader-container");

  if (loader) {
    loader.style.display = "none";
  }
}
