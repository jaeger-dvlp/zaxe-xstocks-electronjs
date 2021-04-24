const electron = require('electron');

const { ipcRenderer } = electron;
const tt = require('electron-tooltip');
const { get } = require('jquery');

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function load() {
  $(document).ready(() => {
    $('#prsearch').on('keyup', function () {
      const value = $(this).val().toLowerCase();
      // console.log(value);
      $('.ttbody tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });

    $('#prsearchid').on('keyup', function () {
      const value = $(this).val().toLowerCase();
      // console.log(value);
      $('.ttbody tr').show().filter(`:not(#${value})`).hide();
    });

    $('#prsearchno').on('keyup', function () {
      const value = $(this).val().toUpperCase();
      console.log(value);
      // console.log(value);
      $('.ttbody tr').show().filter(`:not(.${value})`).hide();
    });
  });

  setInterval(async () => {
    searchbar();
  }, 6000);

  for (let i = 0; i < 50; i++) {}
  setInterval(async () => {
    ipcRenderer.send('cnc', '');
  }, 10000);

  setTimeout(async () => {
    $('#loader-wrapper').fadeOut('slow');
  }, 3000);

  $(document).ready(() => {
    const placeHolder = [
      'Ara..',
      'Seri No..',
      'Tarih..',
      'Cihaz Modeli..',
      'Alıcı İsmi..',
    ];
    let n = 0;
    const loopLength = placeHolder.length;

    if (n < loopLength) {
      const newPlaceholder = placeHolder[n];
      n++;
      $('#prsearch').attr('placeholder', newPlaceholder);
    } else {
      $('#prsearch').attr('placeholder', placeHolder[0]);
      n = 0;
    }
  });
}

async function searchbar() {
  const ms = 1000;

  await sleep(ms);
  document.getElementById('prsearch').placeholder = 'Model..';
  await sleep(ms);

  document.getElementById('prsearch').placeholder = 'Seri No..';
  await sleep(ms);

  document.getElementById('prsearch').placeholder = 'Alıcı İsmi..';
  await sleep(ms);

  document.getElementById('prsearch').placeholder = 'Adres..';
  await sleep(ms);

  document.getElementById('prsearch').placeholder = 'Ara..';
  await sleep(ms);
}

const minbtn = document.querySelector('#minimize');
minbtn.addEventListener('click', async () => {
  document.getElementById('root').classList.add('root2');
  document.getElementById('root').classList.remove('root');
  await sleep(120).then(() => {
    ipcRenderer.send('min', '');
    document.getElementById('root').classList.add('root');
    document.getElementById('root').classList.remove('root2');
  });
});

const extbnt = document.querySelector('#exit');
extbnt.addEventListener('click', () => {
  ipcRenderer.send('ext', '');
});

const lockbtn = document.querySelector('#lock');
lockbtn.addEventListener('click', () => {
  ipcRenderer.send('lck', '');
});

ipcRenderer.on('init', (e, printers) => {
  printers = printers.reverse();
  console.log(printers);
  document.getElementById('tbody').innerHTML == '';
  printers.forEach((printer) => {
    getdata(printer);
  });
});

async function update(data) {
  modalhide();
  await sleep(500);
  notificator('Güncellendi.');
}

async function notificator(d) {
  const a = document.getElementById('notification');
  console.log(d);
  document.getElementById('event').innerHTML = d;
  a.style.display = 'block';
  await sleep(1500);
  a.style.animationName = 'notification2';
  await sleep(200);
  a.style.display = 'none';
  a.style.animationName = 'notification';
}

async function deletepr(e) {
  const ms = 500;

  const id = globalid;
  // console.log(e.id)
  const a = document.getElementById(id);

  modalhide();
  a.classList.add('deletedprinter');
  await sleep(ms);

  a.remove();
  notificator('Silindi.');
}

document.getElementById('modalbase').onclick = function () {
  if (
    event.target != document.getElementById('modal') &&
    event.target != document.getElementById('modalheader') &&
    event.target != document.getElementsByClassName('buttons')[0] &&
    event.target != document.getElementsByClassName('button-group')[0]
  ) {
    modalhide();
  }
};

let globalid;

function tableedit(e) {
  globalid = e.id;
  const modalb = document.getElementById('modalbase');
  const modal = document.getElementById('modal');

  modalb.style.display = 'block';
  modal.style.display = 'block';
}

async function modalhide() {
  const modalb = document.getElementById('modalbase');
  const modal = document.getElementById('modal');
  modalb.style.animationName = 'modalbase2';
  modal.style.animationName = 'modal2';
  await sleep(450);
  modalb.style.display = 'none';
  modal.style.display = 'none';
  modalb.style.animationName = 'modalbase';
  modal.style.animationName = 'modal';
}

document.getElementsByClassName('leftbar')[0].onclick = function () {
  const modalb = document.getElementById('modalbase');
  const modal = document.getElementById('modal');

  modalhide();
};

const svg1 =
  '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="64" height="64"viewBox="0 0 172 172"style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M115.5625,8.0625h-72.5625c-9.675,0 -17.46875,7.79375 -17.46875,17.46875v120.9375c0,9.675 7.79375,17.46875 17.46875,17.46875h86c9.675,0 17.46875,-7.79375 17.46875,-17.46875v-107.5c0,-8.19688 -3.225,-15.99062 -9.00313,-21.90312c-5.77812,-5.9125 -13.70625,-9.00313 -21.90312,-9.00313zM56.4375,61.8125h56.4375c2.28437,0 4.03125,1.74687 4.03125,4.03125c0,2.28437 -1.74688,4.03125 -4.03125,4.03125h-56.4375c-2.28438,0 -4.03125,-1.74688 -4.03125,-4.03125c0,-2.28438 1.74687,-4.03125 4.03125,-4.03125zM56.4375,81.96875h33.59375c2.28437,0 4.03125,1.74688 4.03125,4.03125c0,2.28437 -1.74688,4.03125 -4.03125,4.03125h-33.59375c-2.28438,0 -4.03125,-1.74688 -4.03125,-4.03125c0,-2.28437 1.74687,-4.03125 4.03125,-4.03125zM68.8,110.1875h-12.09375c-2.28438,0 -4.03125,-1.74688 -4.03125,-4.03125c0,-2.28437 1.74687,-4.03125 4.03125,-4.03125h12.09375c2.28438,0 4.03125,1.74688 4.03125,4.03125c0,2.28437 -1.74688,4.03125 -4.03125,4.03125zM130.34375,87.20938l-38.29687,38.29688c-4.03125,4.03125 -9.27187,6.18125 -14.91563,6.18125h-2.6875v-2.6875c0,-5.64375 2.15,-10.88437 6.18125,-14.91562l38.29688,-38.29687c1.47812,-1.47813 3.49375,-2.41875 5.64375,-2.41875c2.15,0 4.16562,0.80625 5.64375,2.41875c1.47813,1.47813 2.41875,3.49375 2.41875,5.64375c0,2.15 -0.67187,4.3 -2.28438,5.77813zM129,34.9375c-5.24063,0 -9.40625,-4.16563 -9.40625,-9.40625v-9.00313c4.56875,0.80625 8.73438,2.95625 12.09375,6.31563c3.35938,3.35938 5.50938,7.525 6.31563,12.09375z"></path></g></g></svg>';
const svg2 =
  '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="50" height="50"viewBox="0 0 172 172"style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M72.24,6.88c-5.65719,0 -10.32,4.66281 -10.32,10.32v6.88h-34.4c-1.23625,-0.01344 -2.39187,0.63156 -3.02344,1.70656c-0.61813,1.075 -0.61813,2.39187 0,3.46687c0.63156,1.075 1.78719,1.72 3.02344,1.70656h3.44v123.84c0,5.68406 4.63594,10.32 10.32,10.32h89.44c5.68406,0 10.32,-4.63594 10.32,-10.32v-123.84h3.44c1.23625,0.01344 2.39188,-0.63156 3.02344,-1.70656c0.61813,-1.075 0.61813,-2.39187 0,-3.46687c-0.63156,-1.075 -1.78719,-1.72 -3.02344,-1.70656h-34.4v-6.88c0,-5.65719 -4.66281,-10.32 -10.32,-10.32zM72.24,13.76h27.52c1.90813,0 3.44,1.53188 3.44,3.44v6.88h-34.4v-6.88c0,-1.90812 1.53188,-3.44 3.44,-3.44zM61.92,68.8c0.87344,0 1.76031,0.33594 2.43219,1.00781l21.64781,21.64781l21.64781,-21.64781c1.34375,-1.34375 3.52062,-1.34375 4.86437,0c1.34375,1.34375 1.34375,3.52062 0,4.86437l-21.64781,21.64781l21.64781,21.64781c1.34375,1.34375 1.34375,3.52062 0,4.86437c-0.67187,0.67188 -1.54531,1.00781 -2.43219,1.00781c-0.88687,0 -1.76031,-0.33594 -2.43219,-1.00781l-21.64781,-21.64781l-21.64781,21.64781c-0.67187,0.67188 -1.54531,1.00781 -2.43219,1.00781c-0.88687,0 -1.76031,-0.33594 -2.43219,-1.00781c-1.34375,-1.34375 -1.34375,-3.52062 0,-4.86437l21.64781,-21.64781l-21.64781,-21.64781c-1.34375,-1.34375 -1.34375,-3.52062 0,-4.86437c0.67187,-0.67188 1.55875,-1.00781 2.43219,-1.00781z"></path></g></g></svg>';
function getdata(e) {
  document.getElementById('tbody').innerHTML +=
    `<tr id='${e.id.toString()}' class='trc ${e.serial.toString()}' onclick='tableedit(this)'>` +
    `<td>${e.id}</td>` +
    `<td> ${e.date}</td>` +
    `<td id='${e.serial}'>${e.serial}</td>` +
    `<td>${e.model}</td>` +
    `<td>${e.count}</td>` +
    `<td>${e.adress}</td>` +
    `<td>${e.name}</td>` +
    `<td>${e.description}</td>` +
    `<td>${e.status}</td>` +
    `</tr>`;
}

let con = false;

ipcRenderer.on('noconn', (e, data) => {
  console.log(data);
  document.getElementById('wifi').style.color = '#FB635E';
  document
    .getElementById('wifi')
    .setAttribute('title', 'Sunucu Bağlantısı Yok.');
  document.getElementById('tbody').innerHTML =
    "<td id='noconn' colspan='10' class='disabled text-center mx-auto text-danger' style='font-weight:400'>Sunucu Bağlantısı Yok.</td>";
  con = false;
  ipcRenderer.send('con', con);
});

ipcRenderer.on('yeconn', (e, data) => {
  console.log(data);
  document.getElementById('wifi').style.color = '#31C442';
  document
    .getElementById('wifi')
    .setAttribute('title', 'Sunucu Bağlantısı Mevcut.');

  con = true;
  ipcRenderer.send('con', con);
  if (document.getElementById('noconn')) {
    document.getElementById('noconn').remove();
  }
});

ipcRenderer.on('mainup', (e, data) => {
  document.getElementById('mains').classList.add('mainsup');
  document.getElementById('mains').classList.remove('mains');
});

ipcRenderer.on('maindown', (e, data) => {
  document.getElementById('mainsup').classList.add('mains');
  document.getElementById('mainsup').classList.remove('mainsup');
});

function buttons() {
  const a = document.getElementById('printers');
  const b = document.getElementById('printeradd');
  const c = document.getElementById('logs');
  if (a.classList.contains('lbarselected')) {
    a.classList.remove('lbarselected');
  }
  if (b.classList.contains('lbarselected')) {
    b.classList.remove('lbarselected');
  }
  if (c.classList.contains('lbarselected')) {
    c.classList.remove('lbarselected');
  }
}

function panels(e) {
  const a = document.getElementById('printersc');
  const b = document.getElementById('printeraddsc');
  const c = document.getElementById('logsc');

  if (e == 'printeradd') {
    a.classList.remove('printers');
    a.classList.add('printersdeactive');
    b.classList.add('printeradd');
    b.classList.remove('printeradddeactive');
    c.classList.remove('logs');
    c.classList.add('logsdeactive');
  } else if (e == 'logs') {
    a.classList.remove('printers');
    a.classList.add('printersdeactive');
    b.classList.remove('printeradd');
    b.classList.add('printeradddeactive');
    c.classList.add('logs');
    c.classList.remove('logsdeactive');
  } else if (e == 'printers') {
    a.classList.add('printers');
    a.classList.remove('printersdeactive');
    b.classList.remove('printeradd');
    b.classList.add('printeradddeactive');
    c.classList.remove('logs');
    c.classList.add('logsdeactive');
  }
}

function buttontest(e) {
  buttons();
  const a = document.getElementById('printers');
  const b = document.getElementById('printeradd');
  const c = document.getElementById('logs');
  if (e == 'printers') {
    if (a.classList.contains('lbarselected') == true) {
    } else {
      a.classList.add('lbarselected');
      panels('printers');
    }
  } else if (e == 'printeradd') {
    buttons();
    if (b.classList.contains('lbarselected') == true) {
    } else {
      b.classList.add('lbarselected');
      panels('printeradd');
    }
  } else if (e == 'logs') {
    buttons();
    if (c.classList.contains('lbarselected') == true) {
    } else {
      c.classList.add('lbarselected');
      panels('logs');
    }
  }
}
