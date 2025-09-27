document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('client-form');
    const tableBody = document.getElementById('clients-table-body');
    
    // --- Data Management Functions ---

    // 1. Get clients from localStorage or return an empty array
    function getClients() {
        const clients = localStorage.getItem('clients');
        return clients ? JSON.parse(clients) : [];
    }

    // 2. Save the current clients array back to localStorage
    function saveClients(clients) {
        localStorage.setItem('clients', JSON.stringify(clients));
    }

    // --- Rendering and Display ---

    // 3. Render the client list table
    function renderClients() {
        const clients = getClients();
        tableBody.innerHTML = ''; // Clear existing rows

        clients.forEach((client, index) => {
            const row = tableBody.insertRow();
            
            // Add a class based on status for color-coding
            row.classList.add(`status-${client.status.replace(/\s/g, '')}`); 

            row.insertCell().textContent = client.name;
            row.insertCell().textContent = client.contact;
            row.insertCell().textContent = client.need;

            // Create a dropdown for status change
            const statusCell = row.insertCell();
            const statusSelect = document.createElement('select');
            statusSelect.innerHTML = `
                <option value="Not Contacted">Not Contacted</option>
                <option value="Contacted">Contacted</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed">Closed</option>
            `;
            statusSelect.value = client.status;
            statusSelect.dataset.index = index; // Store index for identification

            // Event listener to handle immediate status change
            statusSelect.addEventListener('change', updateStatus);

            statusCell.appendChild(statusSelect);


            // Action cell (Delete button)
            const actionCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.dataset.index = index; // Store index for identification
            deleteButton.addEventListener('click', deleteClient);
            actionCell.appendChild(deleteButton);
        });
    }

    // --- Event Handlers ---

    // 4. Handle form submission (Adding a new client)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newClient = {
            name: document.getElementById('client-name').value,
            contact: document.getElementById('client-contact').value,
            need: document.getElementById('client-need').value,
            status: document.getElementById('client-status').value
        };

        const clients = getClients();
        clients.push(newClient);
        saveClients(clients);

        form.reset(); // Clear the form
        renderClients(); // Refresh the table
    });
    
    // 5. Update client status 
    function updateStatus(e) {
        const index = e.target.dataset.index;
        const newStatus = e.target.value;
        const clients = getClients();
        
        clients[index].status = newStatus;
        saveClients(clients);
        renderClients(); // Re-render to update the row color
    }

    // 6. Delete a client
    function deleteClient(e) {
        if (!confirm('Are you sure you want to delete this client?')) return;
        
        const index = e.target.dataset.index;
        const clients = getClients();

        clients.splice(index, 1); // Remove the client from the array
        saveClients(clients);
        renderClients(); // Refresh the table
    }


    // --- Initialization ---
    renderClients(); // Load and display existing data when the page loads

});
