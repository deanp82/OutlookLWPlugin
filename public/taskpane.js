Office.initialize = function (reason) {
  console.log("Office initialized: " + reason);
  
async function getBody() {
  return new Promise(resolve =>
    Office.context.mailbox.item.body.getAsync("text", r => resolve(r.value))
  );
}

async function fetchProjects(subject) {
  const res = await fetch('/api/projects');
  const projects = await res.json();
  const list = document.getElementById('projectList');
  list.innerHTML = '';

  let bestId = null, bestScore = 0;
  projects.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.text = p.name || `Project ${p.id}`;
    opt.dataset.folder1 = p.FolderAddress1 || '';
    opt.dataset.folder2 = p.FolderAddress2 || '';
    list.appendChild(opt);

    const score = (subject||'').toLowerCase().includes((p.name||'').toLowerCase())
      ? (p.name||'').length
      : 0;
    if (score > bestScore) { bestScore = score; bestId = p.id; }
  });
  if (bestId) list.value = bestId;
}

Office.onReady(() => {
  fetchProjects(Office.context.mailbox.item.subject);
});

async function saveEmail() {
  const item = Office.context.mailbox.item;
  const data = {
    emailData: { subject: item.subject, from: item.from.emailAddress, body: await getBody() },
    projectId: document.getElementById('projectList').value
  };
  const r = await fetch('/api/save-email', {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  });
  alert(r.ok ? 'Email saved.' : await r.text());
}

async function createTask() {
  const form = ['taskEmail','taskDesc','taskNotes','deadlineDate','setReminder','addToOutlook']
    .reduce((obj,id) => {
      const el = document.getElementById(id);
      obj[id] = el.type==='checkbox'?el.checked:el.value;
      return obj;
    }, {});
  form.projectId = document.getElementById('projectList').value;
  await fetch('/api/create-task', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)
  });
}
};
