function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const img = document.querySelector('.profile-placeholder');
    img.style.backgroundImage = `url(${reader.result})`;
  };
  reader.readAsDataURL(event.target.files[0]);
}

document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tabs ul li a');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(tab) {
        tab.classList.remove('active'); 
      });
      this.classList.add('active'); 
    });
  });
});

const modal = document.getElementById('new-project-modal');
const btn = document.getElementById('add-project-btn');
const span = document.getElementsByClassName('close')[0];


btn.onclick = function() {
  modal.style.display = 'block';
}

span.onclick = function() {
  modal.style.display = 'none';
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}
