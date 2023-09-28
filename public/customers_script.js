let currentPage = 1;
let currentSearchTerm = '';
const itemsPerPage = 20;

function fetchCustomers(page, searchTerm = '') {
    fetch(`http://localhost:3000/customers?page=${page}&search=${searchTerm}`)
    .then(response => response.json())
    .then(customers => {
        const customerList = document.getElementById('customerList');
        let listItems = '';
        customers.forEach(customer => {
            listItems += `<li onclick="getCustomerDetails(${customer.customer_id})">${customer.first_name} ${customer.last_name}</li>`;
        });
        customerList.innerHTML = listItems;
        currentPage = page;
    })
    .catch(error => {
        console.error('Error fetching customers:', error);
    });
}

function nextPage() {
    fetchCustomers(currentPage + 1, currentSearchTerm);
}

function prevPage() {
    if (currentPage > 1) {
        fetchCustomers(currentPage - 1, currentSearchTerm);
    }
}

function getCustomerDetails(customer_id) {
    fetch(`http://localhost:3000/customer-details/${customer_id}`)
    .then(response => response.json())
    .then(customer => {
        const customerDetails = document.getElementById('customerDetails');
        customerDetails.innerHTML = `
            <h3>${customer.first_name} ${customer.last_name}</h3>
            <p>Email: ${customer.email}</p>
            <p>Address: ${customer.address}</p>
            <!-- Add more details as needed -->
        `;
    })
    .catch(error => {
        console.error('Error fetching customer details:', error);
    });
}

function searchCustomers() {
    const searchTerm = document.getElementById('customerSearch').value;
    currentSearchTerm = searchTerm;
    fetchCustomers(1, searchTerm);
}

document.getElementById('customerSearch').addEventListener('input', searchCustomers);
document.getElementById('prevPageBtn').addEventListener('click', prevPage);
document.getElementById('nextPageBtn').addEventListener('click', nextPage);

fetchCustomers(1);
