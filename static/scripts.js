const electron = require('electron');
const { ipcRenderer } = electron;
const tt = require('electron-tooltip');
const { get } = require('jquery');

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function load() {
  $(document).ready(function () {
    $('#prsearch').on('keyup', function () {
      var value = $(this).val().toLowerCase();
      //console.log(value);
      $('.ttbody tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });

    $('#prsearchid').on('keyup', function () {
      var value = $(this).val().toLowerCase();
      //console.log(value);
      $('.ttbody tr')
        .show()
        .filter(':not(#' + value + ')')
        .hide();
    });

    $('#prsearchno').on('keyup', function () {
      var value = $(this).val().toUpperCase();
      console.log(value);
      //console.log(value);
      $('.ttbody tr')
        .show()
        .filter(':not(.' + value + ')')
        .hide();
    });
  });

  setInterval(async () => {
    searchbar();
  }, 6000);

  for (var i = 0; i < 50; i++) {}
  setInterval(async function () {
    ipcRenderer.send('cnc', '');
  }, 10000);

  setTimeout(async function () {
    $('#loader-wrapper').fadeOut('slow');
  }, 3000);

  $(document).ready(function () {
    var placeHolder = [
      'Ara..',
      'Seri No..',
      'Tarih..',
      'Cihaz Modeli..',
      'Alıcı İsmi..',
    ];
    var n = 0;
    var loopLength = placeHolder.length;

    if (n < loopLength) {
      var newPlaceholder = placeHolder[n];
      n++;
      $('#prsearch').attr('placeholder', newPlaceholder);
    } else {
      $('#prsearch').attr('placeholder', placeHolder[0]);
      n = 0;
    }
  });
}

async function searchbar() {
  var ms = 1000;

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

let minbtn = document.querySelector('#minimize');
minbtn.addEventListener('click', async () => {
  document.getElementById('root').classList.add('root2');
  document.getElementById('root').classList.remove('root');
  await sleep(120).then(() => {
    ipcRenderer.send('min', '');
    document.getElementById('root').classList.add('root');
    document.getElementById('root').classList.remove('root2');
  });
});

let extbnt = document.querySelector('#exit');
extbnt.addEventListener('click', () => {
  ipcRenderer.send('ext', '');
});

let lockbtn = document.querySelector('#lock');
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
  var a = document.getElementById('notification');
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
  var ms = 500;

  var id = globalid;
  //console.log(e.id)
  var a = document.getElementById(id);

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

var globalid;

function tableedit(e) {
  globalid = e.id;
  var modalb = document.getElementById('modalbase');
  var modal = document.getElementById('modal');

  modalb.style.display = 'block';
  modal.style.display = 'block';
}

async function modalhide() {
  var modalb = document.getElementById('modalbase');
  var modal = document.getElementById('modal');
  modalb.style.animationName = 'modalbase2';
  modal.style.animationName = 'modal2';
  await sleep(450);
  modalb.style.display = 'none';
  modal.style.display = 'none';
  modalb.style.animationName = 'modalbase';
  modal.style.animationName = 'modal';
}

document.getElementsByClassName('leftbar')[0].onclick = function () {
  var modalb = document.getElementById('modalbase');
  var modal = document.getElementById('modal');

  modalhide();
};

function getdata(e) {
  document.getElementById('tbody').innerHTML +=
    "<tr id='" +
    e.id.toString() +
    "' class='trc " +
    e.serial.toString() +
    "' onclick='tableedit(this)'>" +
    '<td>' +
    e.id +
    '</td>' +
    '<td> ' +
    e.date +
    '</td>' +
    "<td id='" +
    e.serial +
    "'>" +
    e.serial +
    '</td>' +
    '<td>' +
    e.model +
    '</td>' +
    '<td>' +
    e.count +
    '</td>' +
    '<td>' +
    e.adress +
    '</td>' +
    '<td>' +
    e.name +
    '</td>' +
    '<td>' +
    e.description +
    '</td>' +
    '<td>' +
    e.status +
    '</td>' +
    '</tr>';
}

var con = false;

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
  var a = document.getElementById('printers'),
    b = document.getElementById('printeradd'),
    c = document.getElementById('logs');
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
  var a = document.getElementById('printersc'),
    b = document.getElementById('printeraddsc'),
    c = document.getElementById('logsc');

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
  var a = document.getElementById('printers'),
    b = document.getElementById('printeradd'),
    c = document.getElementById('logs');
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
