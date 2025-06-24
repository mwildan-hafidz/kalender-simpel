class Tanggal {
    constructor(thn, bln, tgl, isFill) {
        this.tahun = thn;
        this.bulan = bln;
        this.tanggal = tgl;
        this.isFill = isFill;
    }

    getStringTgl() {
        let str = '';

        str += this.tahun.toString();
        str += String(this.bulan + 1).padStart(2, '0');
        str += String(this.tanggal).padStart(2, '0');

        return str;
    }
}



const now = new Date();
let tahun = now.getFullYear();
let bulan = now.getMonth();
let tanggal = [];
let reminder = {};
let tglDipilih;



// Ketika halaman dimuat.
document.addEventListener('DOMContentLoaded', function () {
    const reminderData = sessionStorage.getItem('reminder');
    if (reminderData) reminder = JSON.parse(reminderData);

    tanggal = buatTanggal(tahun, bulan);
    updateKalender();
});



// Klik tanggal untuk tambah reminder.
document.addEventListener('click', function (e) {
    const elemenTgl = e.target.closest('.tanggal');

    // Jika elemen yg diklik adalah bagian dari tanggal dan tidak merupakan tanggal fill.
    if (elemenTgl && !elemenTgl.classList.contains('fill')) { 
        const tgl = tanggal[elemenTgl.dataset.index];
        tglDipilih = tgl;
        
        const key = tglDipilih.getStringTgl();

        // Jika tgl sudah ada di reminder:
        if (reminder.hasOwnProperty(key)) {
            tampilkanModalEdit(reminder[key].isi);
        }
        else {   
            tampilkanModal();
        }
    }
});



// Modal.
const containerModal = document.querySelector('.container-modal');
const inputReminder = containerModal.querySelector('#input-reminder');
const tblBatal = containerModal.querySelector('.tbl-batal');
const tblTambah = containerModal.querySelector('.tbl-tambah');
const tglModal = containerModal.querySelector('.tgl-modal');

tblTambah.addEventListener('click', () => {
    const isi = inputReminder.value;

    if (isi !== '') {
        tambahReminder(tglDipilih, isi);
        simpanDataSesi();
        updateKalender();
    }

    inputReminder.value = '';
    sembunyikanModal();
});

tblBatal.addEventListener('click', () => {
    inputReminder.value = '';
    sembunyikanModal();
});

function tampilkanModal() {
    tglModal.innerHTML = `${tglDipilih.tahun}/${tglDipilih.bulan + 1}/${tglDipilih.tanggal}`;
    containerModal.classList.remove('hidden');
}

function sembunyikanModal() {
    tglModal.innerHTML = '';
    containerModal.classList.add('hidden');
}

const containerModalEdit = document.querySelector('.container-modal-edit');
const inputEdit = containerModalEdit.querySelector('#input-edit');
const tblBatalEdit = containerModalEdit.querySelector('.tbl-batal');
const tblEdit = containerModalEdit.querySelector('.tbl-edit');
const tblHapus = containerModalEdit.querySelector('.tbl-hapus');
const tglModalEdit = containerModalEdit.querySelector('.tgl-modal-edit');

tblEdit.addEventListener('click', () => {
    const isi = inputEdit.value;

    if (isi !== '') {
        tambahReminder(tglDipilih, isi);
        simpanDataSesi();
        updateKalender();
    }

    inputEdit.value = '';
    sembunyikanModalEdit();
});

tblBatalEdit.addEventListener('click', () => {
    inputEdit.value = '';
    sembunyikanModalEdit();
});

tblHapus.addEventListener('click', function () {
    console.log(reminder[tglDipilih.getStringTgl()]);
    
    delete reminder[tglDipilih.getStringTgl()];
    simpanDataSesi();
    updateKalender();

    inputEdit.value = '';
    sembunyikanModalEdit();
})

function tampilkanModalEdit(isi) {
    tglModalEdit.innerHTML = `${tglDipilih.tahun}/${tglDipilih.bulan + 1}/${tglDipilih.tanggal}`;
    containerModalEdit.classList.remove('hidden');

    inputEdit.value = isi;
}

function sembunyikanModalEdit() {
    tglModalEdit.innerHTML = '';
    containerModalEdit.classList.add('hidden');
}

function tambahReminder(tgl, isi) {
    reminder[tgl.getStringTgl()] = {
        'isi': isi
    };
}



// Tombol ganti bulan.
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
        const [_thn, _bln] = getTahunBulan(thn, bln - 1);
        tanggal.push(new Tanggal(_thn, _bln, tglAkhirBulanLalu - i, true));
    }

    for (let i = 1; i <= jumlahTanggal; i++) {
        tanggal.push(new Tanggal(thn, bln, i, false));
    }

    let tglBulanDepan = 1;
    while (tanggal.length < 42) {
        if (tanggal.length === 35) break;
        tanggal.push(new Tanggal(thn, bln + 1, tglBulanDepan++, true));
    }

    return tanggal;
}



// Update visual.
const elemenTahun = document.querySelector('.tahun');
const elemenBulan = document.querySelector('.bulan');
const containerTanggal = document.querySelector('.container-tanggal');
const containerListReminder = document.querySelector('.container-list-reminder');
const containerReminder = document.querySelector('.container-reminder');

function updateKalender() {
    const date = new Date(tahun, bulan);
    
    elemenTahun.innerHTML = date.getFullYear();
    elemenBulan.innerHTML = date.toLocaleString('id-ID', { month: 'long' });

    renderTanggal();
    renderContainerListReminder();
}

function renderTanggal() {
    containerTanggal.innerHTML = '';

    let html = '';
    tanggal.forEach(function (tgl, index) {
        let clsTanggal = '';
        if (tgl.isFill) clsTanggal = 'fill';
        else if (index % 7 === 0) clsTanggal = 'libur';

        let clsReminder = 'hidden';
        if (tgl.bulan == bulan) {    
            clsReminder = reminder.hasOwnProperty(tgl.getStringTgl()) ? '' : 'hidden';
        }

        html += `<div class="tanggal ${clsTanggal}" data-index="${index}">
            <span>${tgl.tanggal}</span>
            <div class="reminder ${clsReminder}"></div>
        </div>`;
    });

    containerTanggal.innerHTML = html;
}

function renderContainerListReminder() {
    containerReminder.classList.remove('hidden');
    containerListReminder.innerHTML = '';

    tanggal.forEach(function (tgl) {
        if (tgl.bulan !== bulan) return;

        const key = tgl.getStringTgl();
        if (reminder.hasOwnProperty(key)) {
            const rem = reminder[key];

            const li = `<li class="list-reminder">
                ${tgl.tanggal} - ${rem.isi}
            </li>`;

            containerListReminder.innerHTML += li;
        }
    });

    if (containerListReminder.innerHTML == '') {
        containerReminder.classList.add('hidden');
    }
}



// Functions.
function gantiBulan(offset) {
    [tahun, bulan] = getTahunBulan(tahun, bulan + offset);
    tanggal = buatTanggal(tahun, bulan);
    updateKalender();
}

function simpanDataSesi() {
    sessionStorage.setItem('reminder', JSON.stringify(reminder))
}

function getTahunBulan(thn, bln) {
    const date = new Date(thn, bln);
    return [
        date.getFullYear(),
        date.getMonth()
    ];
}
