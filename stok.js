const SUPABASE_URL = 'https://szdhehbojgqrjyhdgehc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZGhlaGJvamdxcmp5aGRnZWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDY0MzUsImV4cCI6MjA2MTA4MjQzNX0.9jWY-cQSIoPFVZ5Qk9Dwj-_6f01aUvJLJrSwHhOa86g'; // Ganti dengan kunci asli Anda
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allData = [];
let filteredData = [];
let currentPage = 1;
const rowsPerPage = 10;

async function getStokData() {
  const { data, error } = await supabase.from('stok').select('*');
  if (error) {
    console.error('Gagal ambil data:', error);
    alert('Gagal mengambil data dari Supabase.');
    return;
  }

  allData = data;
  filteredData = data;
  renderTable();
  setupPagination();
}

function renderTable() {
  const tableBody = document.getElementById('stokTableBody');
  tableBody.innerHTML = '';

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredData.slice(start, end);

  pageData.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.kode_barang}</td>
      <td>${item.nama_barang}</td>
      <td>${item.lokasi}</td>
      <td class="text-center">
        <button class="lihat-btn" onclick='showPopup(${JSON.stringify(item)})'>
          <i class="bi bi-search"></i> Lihat
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function showPopup(item) {
  const popup = document.getElementById('detailPopup');
  const overlay = document.getElementById('popupOverlay');
  const popupContent = document.getElementById('popupContent');

  popupContent.innerHTML = `
    <div><strong>Kode:</strong> ${item.kode_barang}</div>
    <div><strong>Nama:</strong> ${item.nama_barang}</div>
    <div><strong>Lokasi:</strong> ${item.lokasi}</div>
    <div><strong>Bruto:</strong> ${item.bruto}</div>
    <div><strong>Promo:</strong> ${item.promo_berlaku}</div>
    <div><strong>Netto:</strong> ${item.netto}</div>
    <hr>
    <div><strong>Ukuran Tersedia:</strong></div>
    <div class="d-flex flex-wrap mt-2">
      ${[39,40,41,42,43,44,45].map(size => {
        return `<span class="icon-ukuran"><i class="bi bi-rulers"></i> ${size}: ${item[`ukuran_${size}`] || 0}</span>`;
      }).join('')}
    </div>
  `;

  popup.classList.add('show');
  overlay.classList.add('show');
}

function closePopup() {
  document.getElementById('detailPopup').classList.remove('show');
  document.getElementById('popupOverlay').classList.remove('show');
}

function setupPagination() {
  const pagination = document.getElementById('paginationControls');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<button class="page-link">${i}</button>`;
    li.addEventListener('click', () => {
      currentPage = i;
      renderTable();
      setupPagination();
    });
    pagination.appendChild(li);
  }
}

function setupSearchFilter() {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    const keyword = input.value.toLowerCase();
    filteredData = allData.filter(item =>
      (item.kode_barang && item.kode_barang.toLowerCase().includes(keyword)) ||
      (item.nama_barang && item.nama_barang.toLowerCase().includes(keyword)) ||
      (item.lokasi && item.lokasi.toLowerCase().includes(keyword))
    );
    currentPage = 1;
    renderTable();
    setupPagination();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getStokData();
  setupSearchFilter();
});
