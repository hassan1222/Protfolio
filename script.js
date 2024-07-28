function openMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('open');
}

function downloadCV() {
  window.location.href = 'assets/Hassan_Shahzad_CV.pdf';
}

let slideIndex1 = 0;
let slideIndex2 = 0;
let slideIndex3 = 0;
let slideIndex4 = 0;


function showSlides1() {
  let slides = document.getElementsByClassName("mySlides1");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex1++;
  if (slideIndex1 > slides.length) {slideIndex1 = 1}    
  slides[slideIndex1-1].style.display = "block";  
  setTimeout(showSlides1, 2000); // Change image every 2 seconds
}

function showSlides2() {
  let slides = document.getElementsByClassName("mySlides2");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex2++;
  if (slideIndex2 > slides.length) {slideIndex2 = 1}    
  slides[slideIndex2-1].style.display = "block";  
  setTimeout(showSlides2, 2000); // Change image every 2 seconds
}

function showSlides3() {
  let slides = document.getElementsByClassName("mySlides3");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex3++;
  if (slideIndex3 > slides.length) {slideIndex3 = 1}    
  slides[slideIndex3-1].style.display = "block";  
  setTimeout(showSlides3, 2000); // Change image every 2 seconds
}

function showSlides4() {
  let slides = document.getElementsByClassName("mySlides4");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex4++;
  if (slideIndex4 > slides.length) {slideIndex4 = 1}    
  slides[slideIndex4-1].style.display = "block";  
  setTimeout(showSlides4, 2000); // Change image every 2 seconds
}


showSlides1();
showSlides2();
showSlides3();
showSlides4();