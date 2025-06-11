// --- App State ---
const demoProjects = {
  'BI Dashboard': {
    'manifest.json': '{\n  "timeZone": "America/Los_Angeles"\n}',
    'index.html': '<!DOCTYPE html>\n<html>\n<head>\n  <title>Demo</title>\n</head>\n<body>\n  <h1>BI Dashboard Demo</h1>\n</body>\n</html>',
    'main.js': 'console.log("Demo project loaded!");'
  },
  'CRM': {
    'manifest.json': '{\n  "timeZone": "America/Los_Angeles"\n}',
    'index.html': '<!DOCTYPE html>\n<html>\n<head>\n  <title>CRM Demo</title>\n</head>\n<body>\n  <h1>CRM Demo</h1>\n</body>\n</html>',
    'crm.js': 'console.log("CRM loaded!");'
  }
};

let currentProject = null;
let currentFile = null;
let files = {};
let editor = document.getElementById('editor');

// --- UI Functions ---

// Populate project types
const projectTypesUL = document.getElementById('projectTypes');
for (const proj in demoProjects) {
  const li = document.createElement('li');
  li.textContent = proj;
  li.onclick = () => selectProject(proj);
  projectTypesUL.appendChild(li);
}

// Select project
function selectProject(proj) {
  currentProject = proj;
  files = { ...demoProjects[proj] };
  updateFileList();
  // Select the first file by default
  const file = Object.keys(files)[0];
  selectFile(file);
  updateTerminal(`Selected project: ${proj}\nReady to edit or download.`);
  // Highlight selection
  for (const li of projectTypesUL.children) {
    li.classList.toggle('selected', li.textContent === proj);
  }
}

// Update file list in UI
function updateFileList() {
  const fileListUL = document.getElementById('fileList');
  fileListUL.innerHTML = '';
  for (const file in files) {
    const li = document.createElement('li');
    li.textContent = file;
    li.onclick = () => selectFile(file);
    if (file === currentFile) li.classList.add('selected');
    fileListUL.appendChild(li);
  }
}

// Select file to edit
function selectFile(file) {
  currentFile = file;
  editor.value = files[file];
  updateFileList();
}

// Save edits to file
document.getElementById('saveBtn').onclick = () => {
  if (currentFile) {
    files[currentFile] = editor.value;
    updateTerminal(`Saved ${currentFile}`);
  }
};

// Download all files as ZIP
document.getElementById('downloadBtn').onclick = async () => {
  if (!currentProject) return;
  updateTerminal('Packaging files...');
  // Use JSZip from CDN
  if (!window.JSZip) {
    await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
  }
  const zip = new JSZip();
  for (const file in files) {
    zip.file(file, files[file]);
  }
  zip.generateAsync({ type: "blob" }).then(content => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `${currentProject.replace(/\s/g, '_')}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    updateTerminal('Download complete!');
  });
};

// Helper to update terminal
function updateTerminal(msg) {
  document.getElementById('terminal').textContent = msg;
}

// Helper to load scripts dynamically
function loadScript(src) {
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    document.head.appendChild(s);
  });
}
