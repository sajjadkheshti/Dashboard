// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeToggleSettings = document.getElementById('theme-toggle-settings');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

function toggleTheme() {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    themeIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateCharts();
}

themeToggle.addEventListener('click', toggleTheme);
themeToggleSettings.addEventListener('click', toggleTheme);

// Load theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
    html.classList.add('dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// User Menu Toggle
const userMenuToggle = document.getElementById('user-menu-toggle');
const userMenu = document.getElementById('user-menu');
const desktopUserMenuToggle = document.getElementById('desktop-user-menu-toggle');
const desktopUserMenu = document.getElementById('desktop-user-menu');

userMenuToggle.addEventListener('click', () => {
    userMenu.classList.toggle('hidden');
});

desktopUserMenuToggle.addEventListener('click', () => {
    desktopUserMenu.classList.toggle('hidden');
});

// Sales Chart
const salesChartCtx = document.getElementById('sales-chart').getContext('2d');
const salesChart = new Chart(salesChartCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Sales ($)',
            data: [3000, 4500, 4000, 6000, 5500, 7000],
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#1E40AF' } }
        },
        scales: {
            x: { ticks: { color: '#1E40AF' } },
            y: { ticks: { color: '#1E40AF' } }
        }
    }
});

// User Chart (Doughnut)
const userChartCtx = document.getElementById('user-chart').getContext('2d');
const userChart = new Chart(userChartCtx, {
    type: 'doughnut',
    data: {
        labels: ['New Users', 'Returning Users', 'Guests'],
        datasets: [{
            data: [500, 600, 134],
            backgroundColor: ['#F59E0B', '#3B82F6', '#10B981'],
            borderColor: ['#F59E0B', '#3B82F6', '#10B981'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#1E40AF' } }
        }
    }
});

function updateCharts() {
    const isDark = html.classList.contains('dark');
    const textColor = isDark ? '#E5E7EB' : '#1E40AF';
    const salesColor = isDark ? '#22D3EE' : '#F59E0B';
    const salesBg = isDark ? 'rgba(34, 211, 238, 0.2)' : 'rgba(245, 158, 11, 0.2)';

    salesChart.options.plugins.legend.labels.color = textColor;
    salesChart.options.scales.x.ticks.color = textColor;
    salesChart.options.scales.y.ticks.color = textColor;
    salesChart.data.datasets[0].borderColor = salesColor;
    salesChart.data.datasets[0].backgroundColor = salesBg;
    salesChart.update();

    userChart.options.plugins.legend.labels.color = textColor;
    userChart.data.datasets[0].backgroundColor = isDark ? ['#22D3EE', '#60A5FA', '#34D399'] : ['#F59E0B', '#3B82F6', '#10B981'];
    userChart.data.datasets[0].borderColor = isDark ? ['#22D3EE', '#60A5FA', '#34D399'] : ['#F59E0B', '#3B82F6', '#10B981'];
    userChart.update();
}

// Task List
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const fab = document.getElementById('fab');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md';
        li.innerHTML = `
      <span>${task}</span>
      <button class="text-red-500 hover:text-red-600 transition-all duration-300" onclick="deleteTask(${index})">
        <i class="fas fa-trash"></i>
      </button>
    `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const task = taskInput.value.trim();
    if (task) {
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        renderTasks();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
fab.addEventListener('click', () => {
    document.getElementById('tasks').scrollIntoView({ behavior: 'smooth' });
    taskInput.focus();
});

renderTasks();

// Data Table
const dataTableBody = document.querySelector('#data-table tbody');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');

const data = [
    { id: 1, name: 'Project Alpha', category: 'Sales', value: 5000, date: '2025-01-10' },
    { id: 2, name: 'Campaign Beta', category: 'Marketing', value: 3000, date: '2025-02-15' },
    { id: 3, name: 'Support Gamma', category: 'Support', value: 1500, date: '2025-03-20' },
    { id: 4, name: 'Project Delta', category: 'Sales', value: 7000, date: '2025-04-05' },
];

function renderTable(filteredData) {
    dataTableBody.innerHTML = '';
    filteredData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td class="p-4">${item.id}</td>
      <td class="p-4">${item.name}</td>
      <td class="p-4">${item.category}</td>
      <td class="p-4">$${item.value}</td>
      <td class="p-4">${item.date}</td>
    `;
        dataTableBody.appendChild(tr);
    });
}

function filterTable() {
    const searchText = searchInput.value.toLowerCase();
    const category = filterCategory.value;
    const filteredData = data.filter(item =>
        (category === 'all' || item.category === category) &&
        (item.name.toLowerCase().includes(searchText) || item.id.toString().includes(searchText))
    );
    renderTable(filteredData);
}

searchInput.addEventListener('input', filterTable);
filterCategory.addEventListener('change', filterTable);
renderTable(data);

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Date Picker
const datePicker = document.getElementById('date-picker');
datePicker.addEventListener('change', (e) => {
    console.log('Selected date:', e.target.value);
});