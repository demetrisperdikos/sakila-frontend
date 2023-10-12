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

function addCustomer() {
    const first_name = prompt("Enter the first name:");
    const last_name = prompt("Enter the last name:");
    const email = prompt("Enter the email:");
  
    // Check if the user canceled any of the prompts
    if (first_name === null || last_name === null || email === null) {
      alert("Operation canceled by the user.");
      return;
    }
  
    fetch('http://localhost:3000/add-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ first_name, last_name, email }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Customer added successfully!");
        fetchCustomers(1);  // Refresh the customer list
      } else {
        alert("An error occurred while adding the customer.");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
function getCustomerDetails(customer_id) {
    fetch(`http://localhost:3000/customer-details/${customer_id}`)
    .then(response => response.json())
    .then(customer => {
        const customerDetails = document.getElementById('customerDetails');

        // Extract the movies rented and returned as arrays of titles
        const rentedMovies = customer.rentedMovies.join(', ');
        const returnedMovies = customer.returnedMovies.join(', ');

        customerDetails.innerHTML = `
            <h3>${customer.first_name} ${customer.last_name}                <button class="edit-customer-btn" data-edit-type="name" data-customer-id="${customer.customer_id}">Edit</button>
            </h3>
            <p>Customer ID: ${customer.customer_id}</p>
            <p id="customerEmail">Email: ${customer.email}.              <button class="edit-customer-btn" data-edit-type="email" data-customer-id="${customer.customer_id}">Edit</button>
            </p>
            <p><strong>Rented Movies:</strong> ${rentedMovies || 'None'}                <button class="edit-customer-btn" data-edit-type="movies" data-customer-id="${customer.customer_id}" data-movie-type="rented">Edit</button>
            </p>
            <p><strong>Returned Movies:</strong> ${returnedMovies || 'None'}                <button class="edit-customer-btn" data-edit-type="movies" data-customer-id="${customer.customer_id}" data-movie-type="returned">Edit</button>
            </p>
           
            <button class="delete-customer-btn" data-customer-id="${customer.customer_id}">Delete Customer</button>

            `;
  
        // Add event listeners to the edit buttons
        const editButtons = document.querySelectorAll('.edit-customer-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', handleEditCustomer);
        });
    })
    .catch(error => {
        console.error('Error fetching customer details:', error);
    });
}
function handleEditCustomer(event) {
    let newFieldContent = null; // Declare this variable
    let fieldName = null; // Declare this variable

    const editType = event.target.getAttribute('data-edit-type');
    const customerId = event.target.getAttribute('data-customer-id');
    const customerEmailElement = document.getElementById('customerEmail');

    switch (editType) {
        case 'email':
            const newEmail = prompt('Enter the new email:');
            if (newEmail !== null) {
                customerEmailElement.textContent = `Email: ${newEmail}.`;
                newFieldContent = { email: newEmail };
                fieldName = 'Email';
            }
            break;
        case 'name':
            const newFirstName = prompt('Enter new first name:');
            const newLastName = prompt('Enter new last name:');
            if (newFirstName !== null && newLastName !== null) {
                newFieldContent = { first_name: newFirstName, last_name: newLastName };
                fieldName = 'Name';
            }
            break;
            case 'movies':
                const movieType = event.target.getAttribute('data-movie-type');
                if (movieType === 'rented') {
                  const newRentedMovies = prompt('Enter new rented movies (comma separated IDs):');
                  if (newRentedMovies !== null) {
                    const rentedMovieIds = newRentedMovies.split(',').map(s => parseInt(s.trim()));
                    fetch(`http://localhost:3000/edit-customer-rented-movies/${customerId}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ rentedMovies: rentedMovieIds }),
                    })
                    .then(response => response.json())
                    .then(data => {
                      if (data.success) {
                        alert('Rented movies updated successfully');
                      } else {
                        alert('Failed to update rented movies');
                      }
                    });
                  }

                
                }
                else if (movieType === 'returned') {
                    const newReturnedMovies = prompt('Enter new returned movies (comma separated IDs):');
                    if (newReturnedMovies !== null) {
                        const returnedMovieIds = newReturnedMovies.split(',').map(s => parseInt(s.trim()));
                        fetch(`http://localhost:3000/edit-customer-returned-movies/${customerId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ returnedMovies: returnedMovieIds }),
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert('Returned movies updated successfully');
                            } else {
                                alert('Failed to update returned movies');
                            }
                        });
                    }
                }
                break;


        default:
            console.log('Unknown edit type');
            break;
    }

    if (newFieldContent !== null) {
        fetch(`http://localhost:3000/edit-customer/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFieldContent),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`${fieldName} updated successfully`);
                location.reload();
            } else {
                alert(`Failed to update ${fieldName}`);
            }
        });
    }
}


function updateCustomerInfo(customerId, updatedInfo) {
    console.log('Updating customer info for customer ID:', customerId);
    console.log('Updated info:', updatedInfo);

    fetch(`http://localhost:3000/edit-customer/${customerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo),
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (response.status === 200) {
            alert("Customer information updated successfully!");
        } else {

        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-customer-btn')) {
        const customer_id = event.target.getAttribute('data-customer-id');
        if (customer_id) {
            deleteCustomer(customer_id);
        } else {
            console.error('Customer ID is missing.');
        }
    }
});

function deleteCustomer(customer_id) {
    const confirmDelete = confirm("Are you sure you want to delete this customer?");

    if (!confirmDelete) {
        return;
    }

    fetch(`http://localhost:3000/delete-customer/${customer_id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.status === 200) {
            alert("Customer deleted successfully!");
        } else {
            alert("An error occurred while deleting the customer.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
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

function showEditForm(customerId, firstName, lastName) {
    document.getElementById('editCustomerForm').style.display = 'block';
    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editLastName').value = lastName;

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = 'editCustomerId';
    hiddenInput.value = customerId;
    document.getElementById('customerEditForm').appendChild(hiddenInput);
}

function hideEditForm() {
    document.getElementById('editCustomerForm').style.display = 'none';
    const hiddenInput = document.getElementById('editCustomerId');
    if (hiddenInput) {
        hiddenInput.remove();
    }
}

document.getElementById('customerEditForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const customerId = document.getElementById('editCustomerId').value;
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    fetch(`/updateCustomer/${customerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
        }
    })
    .catch(error => {
        console.error('Error updating customer:', error);
    });
});

function updateFirstName(id) {
  const newFirstName = prompt('Enter new first name:');
  if (newFirstName) {
    fetch(`http://localhost:3000/updateCustomerFirstName/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ first_name: newFirstName }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert('First name updated successfully');
        location.reload();
      } else {
        alert('Failed to update first name');
      }
    });
  }
}

function updateLastName(id) {
  const newLastName = prompt('Enter new last name:');
  if (newLastName) {
    fetch(`http://localhost:3000/updateCustomerLastName/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ last_name: newLastName }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert('Last name updated successfully');
        location.reload();
      } else {
        alert('Failed to update last name');
      }
    });
  }
}
