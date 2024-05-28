$(document).ready(function() {
    employeeButtonsHandle(true);
    $("#addEmployeeButton").click(function (e) {
        $("#employeeSaveButton").show();
        $("#employeeUpdateButton").hide();
        $("#employeeDeleteButton").hide();
        $("#employeeCodeField").hide();
        clearSupplierFields();
    });

    let base64StringImage = '';

    $('#employeeProfilePicture').on('change', function() {
        const file = this.files[0];
        if (file) {
            toBase64(file).then(result => {
                base64StringImage = result
                $("#employeeProfilePicturePreview").attr("src", result).show();
            }).catch(error => {
                console.error('Error converting to Base64:', error);
            });
        }
    });
    
    $("#employeeSaveButton").click(function (e) {
        const employeeName = $("#employeeName").val();
        const employeeProfilePicture = base64StringImage;
        const employeeGender = $("#employeeGender").val();
        const employeeCivilStatus = $("#employeeCivilStatus").val();
        const employeeDesignation = $("#employeeDesignation").val();
        const employeeRole = $("#employeeRole").val();
        const employeeDob = $("#employeeDob").val();
        const employeeJoinedDate = $("#employeeJoinedDate").val();
        const employeeAttachedBranch = $("#employeeAttachedBranch").val();
        const employeeAddressNo = $("#employeeAddressNo").val();
        const employeeLane = $("#employeeLane").val();
        const employeeMainCity = $("#employeeMainCity").val();
        const employeeMainState = $("#employeeMainState").val();
        const employeePostalCode = $("#employeePostalCode").val();
        const employeeContactNumber = $("#employeeContactNumber").val();
        const employeeEmail = $("#employeeEmail").val();
        const employeeGuardianName = $("#employeeGuardianName").val();
        const employeeGuardianContact = $("#employeeGuardianContact").val();
        
        const employee = new EmployeeDTO(
            0,
            employeeName, 
            employeeProfilePicture, 
            employeeGender, 
            employeeCivilStatus, 
            employeeDesignation, 
            employeeRole, 
            employeeDob, 
            employeeJoinedDate, 
            employeeAttachedBranch, 
            employeeAddressNo, 
            employeeLane, 
            employeeMainCity, 
            employeeMainState, 
            employeePostalCode, 
            employeeContactNumber, 
            employeeEmail, 
            employeeGuardianName, 
            employeeGuardianContact);
        console.log(employee)
        saveEmployee(employee);
    });
    $('#employeeLink').click(async function () {
        loadEmployee();
    })
    $("#employeeUpdateButton").click(function (e) {
        const employeeCode = $("#employeeCode").val();
        const employeeName = $("#employeeName").val();
        const srcBase64 = $('#employeeProfilePicturePreview').attr('src');
        var employeeProfilePicture;
        if (srcBase64)
        employeeProfilePicture = base64StringImage;
        else if (srcBase64 === undefined) {
            employeeProfilePicture = "";
        }else employeeProfilePicture = srcBase64;
        const employeeGender = $("#employeeGender").val();
        const employeeCivilStatus = $("#employeeCivilStatus").val();
        const employeeDesignation = $("#employeeDesignation").val();
        const employeeRole = $("#employeeRole").val();
        const employeeDob = $("#employeeDob").val();
        const employeeJoinedDate = $("#employeeJoinedDate").val();
        const employeeAttachedBranch = $("#employeeAttachedBranch").val();
        const employeeAddressNo = $("#employeeAddressNo").val();
        const employeeLane = $("#employeeLane").val();
        const employeeMainCity = $("#employeeMainCity").val();
        const employeeMainState = $("#employeeMainState").val();
        const employeePostalCode = $("#employeePostalCode").val();
        const employeeContactNumber = $("#employeeContactNumber").val();
        const employeeEmail = $("#employeeEmail").val();
        const employeeGuardianName = $("#employeeGuardianName").val();
        const employeeGuardianContact = $("#employeeGuardianContact").val();

        const employee = new EmployeeDTO(
            employeeCode,
            employeeName,
            employeeProfilePicture,
            employeeGender,
            employeeCivilStatus,
            employeeDesignation,
            employeeRole,
            employeeDob,
            employeeJoinedDate,
            employeeAttachedBranch,
            employeeAddressNo,
            employeeLane,
            employeeMainCity,
            employeeMainState,
            employeePostalCode,
            employeeContactNumber,
            employeeEmail,
            employeeGuardianName,
            employeeGuardianContact);
        console.log(employee)
        updateEmployee(employee, employeeCode);
        loadEmployee();
    });
    $('#employeeTable tbody').on('click', 'tr', function() {
        var rowData = [];
        $("#employeeSaveButton").hide();
        $("#employeeUpdateButton").show();
        $("#employeeDeleteButton").show();
        $("#employeeCodeField").show();
        $(this).find('td').each(function() {
            rowData.push($(this).text());
        });

        searchEmployee(rowData[0]);
        $('#employeeModal').modal('show');
    });
});
function employeeButtonsHandle(status) {
    if (status) {
        $("#employeeSaveButton").removeClass('disabled');
    }else {
        $("#employeeSaveButton").addClass('disabled');
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
async function saveEmployee(employee) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1/employee",
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(employee),
            contentType: "application/json"
        });
        $("#customerFoamCloseButton").click();
        Swal.fire({
            title: "Success!",
            text: response.name + " has been saved successfully!",
            icon: "success"
        });
        loadEmployee();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}
const loadEmployee = () => {
    const refreshToken = localStorage.getItem('refreshToken');

    $('#employeeTableBody').empty();
    $.ajax({
        type:"GET",
        url: "http://localhost:8080/api/v1/employee",
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        contentType: "application/json",

        success: function (response) {

            console.log(response)
            response.map((employee, index) => {
                
                addRowEmployee(employee.employeeCode, employee.name, employee.gender, employee.civilStatus, employee.designation, employee.role, formatDate(employee.dob), formatDate(employee.joinedDate), employee.attachedBranch, employee.mainCity, employee.contactNumber, employee.email, employee.guardianName, employee.guardianContact);
            });

        },
        error: function (xhr, status, error) {
            console.error('Something Error');
        }
    });
};
function addRowEmployee(employeeCode, name, gender, civilStatus, designation, role, dob, joinedDate, attachedBranch, mainCity, contactNumber, email, guardianName, guardianContact) {
    var newRow = $('<tr>');
    newRow.append($('<td>').text(employeeCode));
    newRow.append($('<td>').text(name));
    newRow.append($('<td>').text(gender));
    newRow.append($('<td>').text(civilStatus));
    newRow.append($('<td>').text(designation));
    newRow.append($('<td>').text(role));
    newRow.append($('<td>').text(dob));
    newRow.append($('<td>').text(joinedDate));
    newRow.append($('<td>').text(attachedBranch));
    newRow.append($('<td>').text(mainCity));
    newRow.append($('<td>').text(contactNumber));
    newRow.append($('<td>').text(email));
    newRow.append($('<td>').text(guardianName));
    newRow.append($('<td>').text(guardianContact));

    $('#employeeTableBody').append(newRow);
}

async function updateEmployee(employee, employeeId) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "PUT",
            url: "http://localhost:8080/api/v1/employee/" + employeeId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(employee),
            contentType: "application/json"
        });
        $("#supplierCloseButton").click();
        Swal.fire({
            title: "Success!",
            text: employee.name + " has been update successfully!",
            icon: "success"
        });
        loadEmployee();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}
async function searchEmployee(employeeId) {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/v1/employee/" + employeeId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            contentType: "application/json"
        });

        $("#employeeCode").val(response.employeeCode);
        $("#employeeName").val(response.name);

        if (response.profilePicture) {
            $("#employeeProfilePicturePreview").attr("src", response.profilePicture).show();
        } else {
            $("#employeeProfilePicturePreview").hide();
        }

        $("#employeeGender").val(response.gender);
        $("#employeeCivilStatus").val(response.civilStatus);
        $("#employeeDesignation").val(response.designation);
        $("#employeeRole").val(response.role);
        $("#employeeDob").val(formatDate(response.dob));
        $("#employeeJoinedDate").val(formatDate(response.joinedDate));
        $("#employeeAttachedBranch").val(response.attachedBranch);
        $("#employeeAddressNo").val(response.addressNo);
        $("#employeeLane").val(response.lane);
        $("#employeeMainCity").val(response.mainCity);
        $("#employeeMainState").val(response.mainState);
        $("#employeePostalCode").val(response.postalCode);
        $("#employeeContactNumber").val(response.contactNumber);
        $("#employeeEmail").val(response.email);
        $("#employeeGuardianName").val(response.guardianName);
        $("#employeeGuardianContact").val(response.guardianContact);

    } catch (error) {
        console.error("Request failed:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Employee not found!",
        });
    }
}

