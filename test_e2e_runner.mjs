import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9444;
const TARGET_URL = 'file:///E:/Claude/Portales-Salfa-Pilotos/06-portal-salfa-flow/index.html';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('--- STARTING COMPREHENSIVE E2E VERIFICATION FOR SALFA FLOW ---');
  
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--user-data-dir=' + path.resolve('./temp_chrome_profile'),
    TARGET_URL
  ]);

  let isExited = false;
  chromeProcess.on('exit', (code) => {
    isExited = true;
    console.log(`Chrome process exited with code ${code}`);
  });

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find(p => p.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          console.log('Connected to Chrome page:', page.title, page.url);
          break;
        }
      }
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Failed to connect to Chrome CDP within 10s');
    chromeProcess.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        consoleErrors.push(text);
        console.error('[BROWSER CONSOLE ERROR]', text);
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const text = msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || '');
      consoleErrors.push(text);
      console.error('[BROWSER UNCAUGHT EXCEPTION]', text);
    }
  };

  await new Promise((resolve) => ws.onopen = resolve);

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error('Eval Error: ' + JSON.stringify(res.exceptionDetails));
    }
    return res.result.value;
  }

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Waiting for initial boot and DOM to settle...');
  await sleep(2000);

  // 1. Initial State Check
  console.log('\n--- TEST 1: Initial Render & View Inspection ---');
  const projectTitle = await evaluate(`document.getElementById('projHeaderTitle')?.textContent.trim()`);
  console.log('Project title displayed:', projectTitle);

  const sectionTitles = await evaluate(`Array.from(document.querySelectorAll('.section-title')).map(el => el.textContent.trim())`);
  console.log('Section titles rendered:', sectionTitles);

  const taskRowsCount = await evaluate(`document.querySelectorAll('.asana-task-row').length`);
  console.log('Task rows count rendered:', taskRowsCount);

  const taskTitles = await evaluate(`Array.from(document.querySelectorAll('.asana-task-row .task-title-text')).map(el => el.textContent.trim())`);
  console.log('Task titles rendered:', taskTitles);

  // 2. Check Screenshot Elements Match
  console.log('\n--- TEST 2: Visual & Structural Elements ---');
  const breadcrumb = await evaluate(`document.querySelector('.proj-breadcrumb')?.textContent.trim()`);
  console.log('Breadcrumb team:', breadcrumb);

  const subtabs = await evaluate(`Array.from(document.querySelectorAll('.subview-tabs-nav .s-tab')).map(b => b.textContent.trim())`);
  console.log('Project subtabs:', subtabs);

  const activeSubtab = await evaluate(`document.querySelector('.subview-tabs-nav .s-tab.active')?.textContent.trim()`);
  console.log('Active subtab:', activeSubtab);

  const avatarsCount = await evaluate(`document.querySelectorAll('.proj-avatar-stack .avatar-stacked').length`);
  console.log('Header avatars count:', avatarsCount);

  const shareBtnText = await evaluate(`document.querySelector('.btn-asana-share')?.textContent.trim()`);
  console.log('Share button:', shareBtnText);

  // 3. Test Inline Task Creation in "Pendientes activos"
  console.log('\n--- TEST 3: Inline Task Delivery in "Pendientes activos" ---');
  const inlineResult = await evaluate(`
    (() => {
      const firstSectionWrap = document.querySelector('.inline-add-task-wrap');
      const addBtn = firstSectionWrap.querySelector('.btn-inline-add-task');
      addBtn.click();
      
      const inputBox = firstSectionWrap.querySelector('.inline-task-input');
      inputBox.value = 'Minuta Técnica de Validación Eléctrica y Automatización';
      
      const saveBtn = firstSectionWrap.querySelector('[data-inline-save-sec]');
      saveBtn.click();
      
      return {
        rowsAfter: document.querySelectorAll('.asana-task-row').length,
        firstTitle: document.querySelector('.asana-task-row .task-title-text')?.textContent.trim()
      };
    })()
  `);
  console.log('Inline Task creation result:', inlineResult);

  // 4. Test Dialog Modal Task Delivery (Omnibutton / Subtoolbar)
  console.log('\n--- TEST 4: Dialog Task Delivery Form Submission ---');
  const modalResult = await evaluate(`
    (() => {
      document.getElementById('taskTitleInput').value = 'Elaboración de Informe Final de Cierre PMO';
      document.getElementById('taskProjectSelect').value = 'Minutas de reunión del área';
      if (document.getElementById('taskSectionSelect')) document.getElementById('taskSectionSelect').value = 'En revisión';
      if (document.getElementById('taskAssigneeSelect')) document.getElementById('taskAssigneeSelect').value = 'SEBASTIAN JESUS ROCA';
      document.getElementById('taskDueInput').value = '8 nov';
      if (document.getElementById('taskStatusSelect')) document.getElementById('taskStatusSelect').value = 'En progreso';
      if (document.getElementById('taskAreaSelect')) document.getElementById('taskAreaSelect').value = 'PMO';
      if (document.getElementById('taskPrioritySelect')) document.getElementById('taskPrioritySelect').value = 'Alta';
      if (document.getElementById('taskDescInput')) document.getElementById('taskDescInput').value = 'Documento listo para aprobación de jefatura.';

      // Submit form
      const form = document.getElementById('formCreateTask');
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

      return {
        totalRows: document.querySelectorAll('.asana-task-row').length,
        hasNewTask: Array.from(document.querySelectorAll('.asana-task-row .task-title-text')).some(el => el.textContent.includes('Elaboración de Informe Final'))
      };
    })()
  `);
  console.log('Modal Task delivery result:', modalResult);

  // 5. Test Check-Circle Completion Toggle
  console.log('\n--- TEST 5: Task Completion Toggle ---');
  const toggleResult = await evaluate(`
    (() => {
      const firstRow = document.querySelector('.asana-task-row');
      const taskId = firstRow.getAttribute('data-task-row-id');
      const checkBtn = firstRow.querySelector('.task-check-circle');
      const wasCompleted = checkBtn.classList.contains('completed');
      
      checkBtn.click();
      
      const isNowCompleted = checkBtn.classList.contains('completed');
      const storedTasks = JSON.parse(localStorage.getItem('asana_salfa_tasks_v10') || '[]');
      const storedItem = storedTasks.find(t => t.id === taskId);
      
      return {
        taskId,
        wasCompleted,
        isNowCompleted,
        storedStatus: storedItem?.status,
        storedCompleted: storedItem?.completed
      };
    })()
  `);
  console.log('Check-Circle toggle result:', toggleResult);

  // 6. Test Task Drawer Live Interactivity
  console.log('\n--- TEST 6: Task Drawer Live Interactivity ---');
  const drawerResult = await evaluate(`
    (() => {
      const firstRow = document.querySelector('.asana-task-row');
      const taskId = firstRow.getAttribute('data-task-row-id');
      
      firstRow.click();
      
      const drawer = document.getElementById('taskDrawer');
      const isOpen = drawer.classList.contains('open');
      
      // Edit drawer title
      const titleInput = document.getElementById('drawerTaskTitle');
      titleInput.value = titleInput.value + ' [AUDITADO]';
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Edit drawer description
      const descInput = document.getElementById('drawerDesc');
      descInput.value = 'Nueva descripción detallada guardada en vivo desde el panel lateral.';
      descInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Add Subtask via input
      const subtaskInput = document.getElementById('drawerSubtaskInput');
      subtaskInput.value = 'Validar con gerencia de operaciones';
      document.getElementById('btnSubmitDrawerSubtask').click();
      
      // Add Comment via input
      const commentInput = document.getElementById('drawerCommentInput');
      commentInput.value = 'Comentario de prueba: Se aprueban las observaciones de la minuta.';
      document.getElementById('btnSubmitDrawerComment').click();
      
      // Verify in localStorage
      const stored = JSON.parse(localStorage.getItem('asana_salfa_tasks_v10') || '[]').find(t => t.id === taskId);
      
      return {
        drawerOpened: isOpen,
        savedTitle: stored?.title,
        savedDesc: stored?.desc,
        subtasksCount: stored?.subtasks?.length,
        firstSubtask: stored?.subtasks?.[0]?.title,
        commentsCount: stored?.comments?.length,
        latestComment: stored?.comments?.[stored.comments.length - 1]?.text
      };
    })()
  `);
  console.log('Drawer interactive test result:', drawerResult);

  // 7. Test Subtab navigation (e.g. Tablero, Cronograma, etc.)
  console.log('\n--- TEST 7: Subtab Navigation ---');
  const subtabNavResult = await evaluate(`
    (() => {
      const tableroTab = document.querySelector('[data-proj-tab="tablero"]');
      if (tableroTab) tableroTab.click();
      const boardContent = document.getElementById('projectTabContent')?.innerHTML;
      
      const listaTab = document.querySelector('[data-proj-tab="lista"]');
      if (listaTab) listaTab.click();
      
      return {
        hasBoardCols: boardContent.includes('kanban-column') || boardContent.includes('Pendientes activos'),
        restoredToRows: document.querySelectorAll('.asana-task-row').length
      };
    })()
  `);
  console.log('Subtab navigation result:', subtabNavResult);

  // 8. Capture Screenshots
  console.log('\n--- TEST 8: Capturing Visual Proof Screenshots ---');
  const shotDrawer = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('E:/Claude/Portales-Salfa-Pilotos/06-portal-salfa-flow/screenshot_drawer_open.png', Buffer.from(shotDrawer.data, 'base64'));
  console.log('Saved screenshot_drawer_open.png');

  // Close drawer to capture full table and header
  await evaluate(`document.getElementById('btnCloseDrawer')?.click()`);
  await sleep(400);
  const shotTable = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('E:/Claude/Portales-Salfa-Pilotos/06-portal-salfa-flow/screenshot_project_lista_view.png', Buffer.from(shotTable.data, 'base64'));
  console.log('Saved screenshot_project_lista_view.png');

  // 9. Console Error Check
  console.log('\n--- SUMMARY & CONSOLE INTEGRITY ---');
  console.log('Total browser console errors captured:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  }

  // Cleanup
  ws.close();
  chromeProcess.kill();
  try {
    fs.rmSync(path.resolve('./temp_chrome_profile'), { recursive: true, force: true });
  } catch (e) {}

  const success = consoleErrors.length === 0 &&
    projectTitle.includes('Minutas de reunión') &&
    sectionTitles.length >= 3 &&
    taskRowsCount >= 6 &&
    inlineResult.rowsAfter > taskRowsCount &&
    modalResult.totalRows > inlineResult.rowsAfter &&
    drawerResult.drawerOpened &&
    drawerResult.savedTitle.includes('[AUDITADO]') &&
    drawerResult.subtasksCount > 0 &&
    drawerResult.commentsCount > 0;

  console.log('\nFINAL TEST SUITE OUTCOME:', success ? 'ALL ASSERTIONS PASSED ✅' : 'FAILURES DETECTED ❌');
  process.exit(success ? 0 : 1);
}

run().catch((err) => {
  console.error('Test execution failed with error:', err);
  process.exit(1);
});
