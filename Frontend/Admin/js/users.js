document.addEventListener('DOMContentLoaded', function () {
  // User form schema
  const userFormSchema = {
    name: {
      label: 'Name',
      type: 'text',
      validation: {
        required: true,
        minLength: 2
      }
    },
    email: {
      label: 'Email',
      type: 'email',
      validation: {
        required: true,
        email: true
      }
    }
  };

  // Table config
  const userTableConfig = {
    perPage: 5,
    currentPage: 1
  };

  // DOM elements
  const usersTable = $('#usersTable tbody');
  const userSearchInput = $('#userSearch');
  const usersPagination = $('#usersPagination');
  const addUserBtn = $('.section-actions .btn', $('#users'));

  function initUsersModule() {
    fetchUsers();

    userSearchInput.addEventListener('input', debounce(() => {
      fetchUsers();
    }, 300));

    addUserBtn.addEventListener('click', () => {
      showAddUserForm();
    });
  }

  async function fetchUsers() {
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      renderUsersTable(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  function renderUsersTable(users) {
    const searchQuery = userSearchInput.value.trim();
    let filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredUsers.length;
    const startIndex = (userTableConfig.currentPage - 1) * userTableConfig.perPage;
    const endIndex = startIndex + userTableConfig.perPage;
    filteredUsers = filteredUsers.slice(startIndex, endIndex);

    usersTable.innerHTML = '';

    if (filteredUsers.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `<td colspan="4" class="text-center">No users found</td>`;
      usersTable.appendChild(emptyRow);
    } else {
      filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.user_id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <div class="actions">
              <button class="action-btn edit" data-id="${user.user_id}" title="Edit user"><i class="fas fa-edit"></i></button>
              <button class="action-btn delete" data-id="${user.user_id}" title="Delete user"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        `;
        usersTable.appendChild(row);
      });
    }

    renderUsersPagination(totalItems);

    // Event listeners for edit/delete
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-id');
        showEditUserForm(userId);
      });
    });

    document.querySelectorAll('.action-btn.delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-id');
        showDeleteUserConfirmation(userId);
      });
    });
  }

  function renderUsersPagination(totalItems) {
    usersPagination.innerHTML = '';

    const pagination = createPagination(
      totalItems,
      userTableConfig.perPage,
      userTableConfig.currentPage,
      page => {
        userTableConfig.currentPage = page;
        fetchUsers();
      }
    );

    usersPagination.appendChild(pagination);
  }

  function showAddUserForm() {
    const form = createForm(userFormSchema, {}, handleUserFormSubmit);
    showModal('Add New User', form);
  }

  async function showEditUserForm(userId) {
    const user = await getUserById(userId);

    if (user) {
      const form = createForm(userFormSchema, user, handleUserFormSubmit);
      showModal('Edit User', form);
    } else {
      showNotification('User not found', 'error');
    }
  }

  async function getUserById(id) {
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      return users.find(user => user.user_id === parseInt(id));
    } catch (error) {
      console.error('Error getting user:', error);
    }
  }

  function showDeleteUserConfirmation(userId) {
    const confirmContent = document.createElement('div');
    confirmContent.innerHTML = `
      <p>Are you sure you want to delete this user?</p>
      <div class="form-actions">
        <button class="btn light" id="cancelDelete">Cancel</button>
        <button class="btn danger" id="confirmDelete">Delete</button>
      </div>
    `;

    showModal('Confirm Delete', confirmContent);

    $('#cancelDelete').addEventListener('click', hideModal);
    $('#confirmDelete').addEventListener('click', async () => {
      try {
        await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        });
        hideModal();
        fetchUsers();
        showNotification('User deleted successfully');
      } catch (error) {
        showNotification('Error deleting user', 'error');
      }
    });
  }

  async function handleUserFormSubmit(formData) {
    try {
      if (formData.id) {
        // Update user
        await fetch(`/api/users/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        showNotification('User updated successfully');
      } else {
        // Create user
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        showNotification('User created successfully');
      }

      hideModal();
      fetchUsers();
    } catch (error) {
      showNotification('Error saving user', 'error');
    }
  }

  // Start module
  initUsersModule();
});
