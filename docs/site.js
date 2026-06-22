const toggle=document.querySelector('#menu'),nav=document.querySelector('#nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
const form=document.querySelector('#appointment-form'),success=document.querySelector('#success');
form.addEventListener('submit',event=>{event.preventDefault();form.hidden=true;success.hidden=false;success.focus();});
document.querySelector('#reset').addEventListener('click',()=>{form.reset();form.hidden=false;success.hidden=true;});

const header=document.querySelector('header');
const updateHeader=()=>header.classList.toggle('scrolled',window.scrollY>8);
window.addEventListener('scroll',updateHeader,{passive:true});
updateHeader();

const faqItems=[...document.querySelectorAll('#faq details')];
faqItems.forEach(item=>item.addEventListener('toggle',()=>{
  if(!item.open)return;
  faqItems.forEach(other=>{if(other!==item)other.open=false;});
}));

document.querySelectorAll('[data-card-toggle]').forEach(button=>{
  button.addEventListener('click',()=>{
    const grid=document.getElementById(button.dataset.cardToggle);
    const expanded=grid.classList.toggle('is-expanded');
    button.setAttribute('aria-expanded',String(expanded));
    button.innerHTML=`${expanded?'Show Less':'Show More'} <span aria-hidden="true">${expanded?'↑':'↓'}</span>`;
  });
});

const sectionNavLinks=[...document.querySelectorAll('.desktop-side-nav a[href^="#"]')];
const trackedSections=sectionNavLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
const updateActiveSection=()=>{
  const marker=window.scrollY+window.innerHeight*.36;
  let current=trackedSections[0];
  trackedSections.forEach(section=>{if(section.offsetTop<=marker)current=section;});
  if(!current)return;
  sectionNavLinks.forEach(link=>{
    const active=link.getAttribute('href')===`#${current.id}`;
    link.classList.toggle('is-active',active);
    if(active)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  });
};
let sectionUpdateScheduled=false;
window.addEventListener('scroll',()=>{
  if(sectionUpdateScheduled)return;
  sectionUpdateScheduled=true;
  window.requestAnimationFrame(()=>{sectionUpdateScheduled=false;updateActiveSection();});
},{passive:true});
window.addEventListener('resize',updateActiveSection);
updateActiveSection();
