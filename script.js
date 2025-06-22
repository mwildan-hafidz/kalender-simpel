// Fitur:
    // Menampilkan tanggal sesuai bulan dan tahunnya.
    // Mengklik tanggal untuk membuat reminder.
    // Menampilkan penanda pada tanggal yang memiliki reminder.
    // Menyimpan reminder.
// 

// To do:
// + Fitur remainder.
// + Menyimpan data sesi.

class Tanggal {
    constructor(tgl, isFill) {
        this.tanggal = tgl;
        this.isFill = isFill;
    }
}

const now = new Date();
let tahun = now.getFullYear();
let bulan = now.getMonth();
let tanggal = [];

document.addEventListener('DOMContentLoaded', function () {
    tanggal = buatTanggal(tahun, bulan);
    updateKalender();
});

const tblKiri = document.querySelector('.tbl-kiri');
const tblKanan = document.querySelector('.tbl-kanan');

tblKanan.addEventListener('click', () => gantiBulan(1));
tblKiri.addEventListener('click', () => gantiBulan(-1));

// Membuat array tanggal.
function buatTanggal(thn, bln) {
    const hariPertama = new Date(thn, bln, 1).getDay();
    const jumlahTanggal = new Date(thn, bln + 1, 0).getDate();
    const tglAkhirBulanLalu = new Date(thn, bln, 0).getDate();

    let tanggal = [];

    for (let i = hariPertama - 1; i >= 0; i--) {
        tanggal.push(new Tanggal(tglAkhirBulanLalu - i, true));
    }

    for (let i = 1; i <= jumlahTanggal; i++) {
        tanggal.push(new Tanggal(i, false));
    }

    let tglBulanDepan = 1;
    while (tanggal.length < 42) {
        if (tanggal.length === 35) break;
        tanggal.push(new Tanggal(tglBulanDepan++, true));
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
        let cls = '';
        if (tgl.isFill) cls = 'fill';
        else if (index % 7 === 0) cls = 'libur';

        html += `<div class="tanggal ${cls}"><span>${tgl.tanggal}</span></div>`;
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