// Project Categories and Templates
const projectData = {
  'CRM': {
    category: 'Dashboards',
    templates: {
      'Basic CRM': {
        'manifest.json': '{\n  "timeZone": "America/Los_Angeles"\n}',
        'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>CRM Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>CRM Dashboard</h1>
  <div id="crmApp"></div>
  <script src="crm.js"></script>
</body>
</html>`,
        'crm.js': `document.getElementById('crmApp').innerHTML = '<p>Welcome to your CRM!</p>';`
      },
      'Advanced CRM': {
        'manifest.json': '{\n  "timeZone": "America/Los_Angeles"\n}',
        'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>Advanced CRM</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Advanced CRM</h1>
  <div id="crmApp"></div>
  <script src="advanced-crm.js"></script>
</body>
</html>`,
        'advanced-crm.js': `document.getElementById('crmApp').innerHTML = '<p>Advanced features coming soon.</p>';`
      }
    }
  },
  'BI': {
    category: 'Dashboards',
    templates: {
      'Starter BI Dashboard': {
        'manifest.json': '{\n  "timeZone": "America/Los_Angeles"\n}',
        'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>BI Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>BI Dashboard</h1>
  <canvas id="myChart"></canvas>
  <script src="bi.js"></script>
</body>
</html>`,
        'bi.js': `window.onload = function() {
  document.getElementById('myChart').getContext ? document.getElementById('myChart').getContext('2d') : null;
  // Insert Chart.js code here.
};`
      }
    }
  },
  'SEO': {
    category: 'Tools',
    templates: {
      'Keyword Scraper': {
        'manifest.json': '{\n  "timeZone": "America/Los_Angeles"\n}',
        'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>Keyword Scraper</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>SEO Keyword Scraper</h1>
  <input id="keywords" type="text" placeholder="Enter a topic">
  <button id="scrapeBtn">Scrape</button>
  <pre id="result"></pre>
  <script src="scraper.js"></script>
</body>
</html>`,
        'scraper.js': `document.getElementById('scrapeBtn').onclick = function() {
  const kw = document.getElementById('keywords').value;
  document.getElementById('result').textContent = 'Scraping for: ' + kw;
};`
      }
    }
  },
  'Business Tools': {
    category: 'Tools',
    templates: {
      'SOP Builder': {
        'manifest.json': '{\n  "timeZone": "America/Los_Angeles"\n}',
        'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>SOP Builder</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>SOP Builder</h1>
  <div id="sopApp"></div>
  <script src="sop.js"></script>
</body>
</html>`,
        'sop.js': `document.getElementById('sopApp').innerHTML = '<ul><li>Create steps</li><li>Assign owners</li></ul>';`
      }
    }
  },
  'API Network': {
    category: 'Web Development',
    templates: {
      'API Controller': {
        'manifest.json': '{\n  "timeZone": "America/Los_Angeles"\n}',
        'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>API Network Controller</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>API Controller</h1>
  <div id="apiController"></div>
  <script src="api-controller.js"></script>
</body>
</html>`,
        'api-controller.js': `document.getElementById('apiController').innerHTML = '<button id="callApi">Call Endpoint</button><div id="apiResult"></div>';
document.getElementById('callApi').onclick = function() {
  document.getElementById('apiResult').textContent = 'API called: result success!';
};`
      }
    }
  }
};

// Theme options
const themes = ['business', 'fun', 'creative', 'classy', 'modern'];

// --- UI Logic ---
const editor = document.getElementById('editor');
const themeSelect = document.getElementById('themeSelect');
const projectCategoriesDiv = document.getElementById('projectCategories');
let currentCategory = null;
let currentProject = null;
let currentFile = null;
let files = {};

// Theme Handling
themeSelect.onchange = () => {
  setTheme(themeSelect.value);
};
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
}
setTheme(themeSelect.value);

// Populate sidebar
function populateCategories() {
  const categories = {};
  for (const projType in projectData) {
    const cat = projectData[projType].category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(projType);
  }
  projectCategoriesDiv.innerHTML = '';
  for (const cat in categories) {
    const title = document.createElement('div');
    title.className = 'category-title';
    title.textContent = cat;
    projectCategoriesDiv.appendChild(title);
    const ul = document.createElement('ul');
    ul.className = 'project-type-list';
    categories[cat].forEach(ptype => {
      const li = document.createElement('li');
      li.textContent = ptype;
      li.onclick = () => selectProjectType(ptype);
      ul.appendChild(li);
    });
    projectCategoriesDiv.appendChild(ul);
  }
}
populateCategories();

// Project type click
function selectProjectType(type) {
  currentCategory = type;
  const tmplList = projectData[type].templates;
  // Only one template? Autoselect, else prompt choice
  if (Object.keys(tmplList).length === 1) {
    selectProject(type, Object.keys(tmplList)[0]);
  } else {
    let tmpl = prompt('Select template: ' + Object.keys(tmplList).join(', '));
    if (tmpl && tmplList[tmpl]) selectProject(type, tmpl);
  }
  // Sidebar selection highlight
  Array.from(document.querySelectorAll('.project-type-list li')).forEach(li =>
    li.classList.toggle('selected', li.textContent === type)
  );
}

// Load project
function selectProject(type, template) {
  currentProject = type;
  files = { ...projectData[type].templates[template] };
  updateFileList();
  selectFile(Object.keys(files)[0]);
  updateTerminal(`Loaded project: ${type} (${template})`);
}

// File list UI
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

// Editor panel
function selectFile(file) {
  currentFile = file;
  editor.value = files[file];
  updateFileList();
}

// Save file
document.getElementById('saveBtn').onclick = () => {
  if (currentFile) {
    files[currentFile] = editor.value;
    updateTerminal(`Saved ${currentFile}`);
  }
};

// Download ZIP
document.getElementById('downloadBtn').onclick = async () => {
  if (!currentProject) return;
  updateTerminal('Packaging files...');
  if (!window.JSZip) {
    await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
  }
  const zip = new JSZip();
  for (const file in files) zip.file(file, files[file]);
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

// Terminal
function updateTerminal(msg) {
  document.getElementById('terminal').textContent = msg;
}

// Dynamic script loader
function loadScript(src) {
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    document.head.appendChild(s);
  });
}
