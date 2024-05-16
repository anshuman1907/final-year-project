$(document).ready(function () {
    let table = $('#data-table').DataTable({
        "ajax": {
            "url": "http://127.0.0.1:3000/api/employees",
            "dataSrc": ""
        },
        "columns": [
            { "data": "id", "title": "User ID" },
            { "data": "name", "title": "Name" },
            { "data": "company.name", "title": "Department" },
            { "data": "website", "title": "Designation" },
            { "data": "email", "title": "Email ID" },
            { "data": "phone", "title": "Contact" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                        <a href="#" class="edit" data-toggle="modal" data-target="#editEmployeeModal" data-userid="${row.id}"><i
                            class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        <a href="#" class="delete" data-toggle="modal" data-target="#deleteEmployeeModal" data-userid="${row.id}"><i
                            class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                    `;
                }
            }
        ]
    });

    // Add Employee
    $('#addEmployeeForm').on('submit', function (e) {
        e.preventDefault();
        let newEmployee = {
            id: $('#userId').val(),
            name: $('#name').val(),
            company: {
                name: $('#department').val()
            },
            website: $('#designation').val(),
            email: $('#emailId').val(),
            phone: $('#contact').val()
        };

        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:3000/api/employees',
            contentType: 'application/json',
            data: JSON.stringify(newEmployee),
            success: function (data) {
                table.ajax.reload();
            },
            error: function (err) {
                console.error('Error adding employee:', err);
            }
        });

        $('#addEmployeeModal').modal('hide');
        this.reset();
    });

    // Edit Employee
    $('#data-table tbody').on('click', 'a.edit', function () {
        let userId = $(this).data('userid');
        $.ajax({
            type: 'GET',
            url: `http://127.0.0.1:3000/api/employees/${userId}`,
            success: function (data) {
                $('#editUserId').val(data.id);
                $('#editName').val(data.name);
                $('#editDepartment').val(data.company.name);
                $('#editDesignation').val(data.website);
                $('#editEmailId').val(data.email);
                $('#editContact').val(data.phone);
            },
            error: function (err) {
                console.error('Error fetching employee details:', err);
            }
        });
    });

    $('#editEmployeeForm').on('submit', function (e) {
        e.preventDefault();
        let updatedEmployee = {
            name: $('#editName').val(),
            company: {
                name: $('#editDepartment').val()
            },
            website: $('#editDesignation').val(),
            email: $('#editEmailId').val(),
            phone: $('#editContact').val()
        };
        let userId = $('#editUserId').val();

        $.ajax({
            type: 'PUT',
            url: `http://127.0.0.1:3000/api/employees/${userId}`,
            contentType: 'application/json',
            data: JSON.stringify(updatedEmployee),
            success: function (data) {
                table.ajax.reload();
            },
            error: function (err) {
                console.error('Error updating employee:', err);
            }
        });

        $('#editEmployeeModal').modal('hide');
    });

    // Delete Employee
    $('#data-table tbody').on('click', 'a.delete', function () {
        let userId = $(this).data('userid');
        $('#deleteEmployeeForm').off('submit').on('submit', function (e) {
            e.preventDefault();
            $.ajax({
                type: 'DELETE',
                url: `http://127.0.0.1:3000/api/employees/${userId}`,
                success: function () {
                    table.ajax.reload();
                },
                error: function (err) {
                    console.error('Error deleting employee:', err);
                }
            });
            $('#deleteEmployeeModal').modal('hide');
        });
    });
});
