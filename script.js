// Fitur:
    // Menampilkan tanggal sesuai bulan dan tahunnya.
    // Mengklik tanggal untuk membuat reminder.
    // Menampilkan penanda pada tanggal yang memiliki reminder.
    // Menyimpan reminder.
// 

// To do:
// + Memperbarui kalendar setelah menambahkan reminder.
// + Menyimpan data sesi.

class Tanggal {
    constructor(thn, bln, tgl, isFill) {
        this.tahun = thn;
        this.bulan = bln;
        this.tanggal = tgl;
        this.isFill = isFill;
    }

    getStringTgl() {
        let yyyymmdd = '';

        yyyymmdd += this.tahun.toString();
        yyyymmdd += String(this.bulan + 1).padStart(2, '0');
        yyyymmdd += String(this.tanggal).padStart(2, '0');

        return yyyymmdd;
    }
}


const now = new Date();
let tahun = now.getFullYear();
let bulan = now.getMonth();
let tanggal = [];
let reminder = {};


document.addEventListener('DOMContentLoaded', function () {
    const reminderData = sessionStorage.getItem('reminder');
    if (reminderData) reminder = JSON.parse(reminderData);

    tanggal = buatTanggal(tahun, bulan);
    updateKalender();
});


document.addEventListener('click', function (e) {
    const eTgl = e.target.closest('.tanggal');

    if (eTgl && !eTgl.classList.contains('fill')) {
        const tgl = tanggal[eTgl.dataset.index];
        reminder[tgl.getStringTgl()] = tgl;

        simpanDataSesi();
        updateKalender();
    }
});


const tblKiri = document.querySelector('.tbl-kiri');
const tblKanan = document.querySelector('.tbl-kanan');

tblKanan.addEventListener('click', () => gantiBulan(1));
tblKiri.addEventListener('click', () => gantiBulan(-1));


function buatTanggal(thn, bln) {
    const hariPertama = new Date(thn, bln, 1).getDay();
    const jumlahTanggal = new Date(thn, bln + 1, 0).getDate();
    const tglAkhirBulanLalu = new Date(thn, bln, 0).getDate();

    let tanggal = [];

    for (let i = hariPertama - 1; i >= 0; i--) {
        tanggal.push(new Tanggal(thn, bln, tglAkhirBulanLalu - i, true));
    }

    for (let i = 1; i <= jumlahTanggal; i++) {
        tanggal.push(new Tanggal(thn, bln, i, false));
    }

    let tglBulanDepan = 1;
    while (tanggal.length < 42) {
        if (tanggal.length === 35) break;
        tanggal.push(new Tanggal(thn, bln, tglBulanDepan++, true));
    }

    return tanggal;
}


const elemenTahun = document.querySelector('.tahun');
const elemenBulan = document.querySelector('.bulan');
const containerTanggal = document.querySelector('.container-tanggal');

function updateKalender() {
    const date = new Date(tahun, bulan);
    
    elemenTahun.innerHTML = date.getFullYear();
    elemenBulan.innerHTML = date.toLocaleString('id-ID', { month: 'long' });

    renderTanggal();
}

function renderTanggal() {
    containerTanggal.innerHTML = '';

    let html = '';
    tanggal.forEach(function (tgl, index) {
        let clsTanggal = '';
        if (tgl.isFill) clsTanggal = 'fill';
        else if (index % 7 === 0) clsTanggal = 'libur';

        const clsReminder = reminder.hasOwnProperty(tgl.getStringTgl()) ? '' : 'hidden';

        html += `<div class="tanggal ${clsTanggal}" data-index="${index}">
            <span>${tgl.tanggal}</span>
            <div class="reminder ${clsReminder}"></div>
        </div>`;
    });

    containerTanggal.innerHTML = html;
}


function gantiBulan(offset) {
    const date = new Date(tahun, bulan + offset);

    tahun = date.getFullYear();
    bulan = date.getMonth();
    tanggal = buatTanggal(tahun, bulan);
    updateKalender();
}

function simpanDataSesi() {
    sessionStorage.setItem('reminder', JSON.stringify(reminder))
}