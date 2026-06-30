const toggle=document.querySelector('#menu'),nav=document.querySelector('#nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
const form=document.querySelector('#appointment-form'),appointmentModal=document.querySelector('#appointment-success-modal'),formStatus=document.querySelector('#appointment-form-status');
const setFormStatus=(type,message)=>{formStatus.classList.remove('success','error');if(type)formStatus.classList.add(type);formStatus.textContent=message||'';};
const openAppointmentModal=()=>{appointmentModal.classList.add('is-open');appointmentModal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');appointmentModal.querySelector('.appointment-success-close')?.focus();};
const closeAppointmentModal=()=>{appointmentModal.classList.remove('is-open');appointmentModal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');};
appointmentModal.querySelectorAll('.appointment-success-close').forEach(button=>button.addEventListener('click',closeAppointmentModal));
appointmentModal.addEventListener('click',event=>{if(event.target===appointmentModal)closeAppointmentModal();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&appointmentModal.classList.contains('is-open'))closeAppointmentModal();});
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(form.dataset.submitting==='true')return;
  setFormStatus('','');
  if(!form.checkValidity()){form.reportValidity();return;}
  const formData=new FormData(form);
  if(String(formData.get('honeypot')||'').trim())return;
  const submitButton=form.querySelector("button[type='submit']"),submitLabel=submitButton?.dataset.submitLabel||'Request Appointment',originalButtonContent=submitButton?.innerHTML||submitLabel;
  form.dataset.submitting='true';form.classList.add('is-submitting');submitButton.disabled=true;submitButton.textContent='Sending...';
  try{
    const message=String(formData.get('message')||'').trim();
    formData.set('message',[`Preferred Date: ${String(formData.get('preferredDate')||'')}`,`Preferred Time: ${String(formData.get('preferredTime')||'')}`,`Service Needed: ${String(formData.get('service')||'')}`,`Contact Number: ${String(formData.get('phone')||'')}`,'',message||'No additional message provided.'].join('\n'));
    const response=await fetch(form.action,{method:form.method||'POST',headers:{Accept:'application/json'},body:formData});
    const result=await response.json().catch(()=>({}));
    if(!response.ok||result.success===false)throw new Error(result.message||'The appointment request could not be sent.');
    form.reset();submitButton.textContent='Sent';openAppointmentModal();
  }catch(error){console.error(error);setFormStatus('error','We could not send your request. Please check your connection and try again.');delete form.dataset.submitting;submitButton.disabled=false;submitButton.innerHTML=originalButtonContent;}
  finally{form.classList.remove('is-submitting');}
});

const header=document.querySelector('header');
const updateHeader=()=>header.classList.toggle('scrolled',window.scrollY>8);
window.addEventListener('scroll',updateHeader,{passive:true});
updateHeader();

const faqItems=[...document.querySelectorAll('#faq details')];
faqItems.forEach(item=>item.addEventListener('toggle',()=>{
  if(!item.open)return;
  faqItems.forEach(other=>{if(other!==item)other.open=false;});
}));

const expandableStates=[];
const hiddenClass='expandable-item--hidden';

const getColumnCount=grid=>{
  const columns=window.getComputedStyle(grid).gridTemplateColumns;
  return columns&&columns!=='none'?columns.split(' ').filter(Boolean).length:1;
};

const getInitialLimit=grid=>{
  if(grid.id==='gallery-cards'&&!window.matchMedia('(max-width: 600px)').matches){
    return grid.querySelectorAll('[data-expandable-item]').length;
  }
  const rows=window.matchMedia('(max-width: 600px)').matches
    ?3
    :window.matchMedia('(max-width: 1050px)').matches
      ?2
      :1;
  return Math.max(1,getColumnCount(grid)*rows);
};

const updateExpandableSection=state=>{
  const initialLimit=getInitialLimit(state.grid);
  const items=[...state.grid.querySelectorAll('[data-expandable-item]')];
  const hasHiddenItems=items.length>initialLimit;

  if(!hasHiddenItems)state.expanded=false;

  items.forEach((item,index)=>{
    const isHidden=hasHiddenItems&&!state.expanded&&index>=initialLimit;
    item.hidden=isHidden;
    item.classList.toggle(hiddenClass,isHidden);
    item.setAttribute('aria-hidden',String(isHidden));
  });

  state.button.hidden=!hasHiddenItems;
  state.button.parentElement.hidden=!hasHiddenItems;
  state.button.textContent=state.expanded?'Show Less':'Show More';
  state.button.setAttribute('aria-expanded',String(state.expanded));
};

document.querySelectorAll('[data-expandable-section]').forEach(section=>{
  const grid=section.querySelector('[data-expandable-grid]');
  const button=section.querySelector('[data-expand-toggle]');
  const items=[...section.querySelectorAll('[data-expandable-item]')];
  if(!grid||!button||!items.length)return;

  const state={grid,button,expanded:false};
  expandableStates.push(state);
  updateExpandableSection(state);
  window.requestAnimationFrame(()=>updateExpandableSection(state));
  window.setTimeout(()=>updateExpandableSection(state),250);

  const observer=new MutationObserver(()=>updateExpandableSection(state));
  observer.observe(grid,{childList:true});
  state.observer=observer;

  button.addEventListener('click',()=>{
    state.expanded=!state.expanded;
    updateExpandableSection(state);
  });
});

let expandableResizeTimer;
window.addEventListener('resize',()=>{
  window.clearTimeout(expandableResizeTimer);
  expandableResizeTimer=window.setTimeout(()=>expandableStates.forEach(updateExpandableSection),180);
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
