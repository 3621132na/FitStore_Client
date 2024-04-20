function triggerFileInput() {
    document.getElementById("profileImage").click();
}
document.getElementById("Avt").addEventListener("click", triggerFileInput);
document.getElementById("profileImage").addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            document.getElementById("Avt").src =
                readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    }
});
function EditPassword() {
    const editAccountInfoFrm = document.getElementById("editAccountInfo");
    const editAccountPasswordFrm = document.getElementById("editAccountPassword");
    const btnEdit = document.getElementById("btnEdit");
    const btnEditPassword = document.getElementById("btnEditPassword");
    const btnCancel = document.getElementById("btnCancel");
    const btnSubmit = document.getElementById("btnSubmit");
    editAccountInfoFrm.style.display = "none";
    editAccountPasswordFrm.style.display = "block";
    btnEditPassword.style.display = "none";
    btnSubmit.style.display = "inline-block";
    btnEdit.style.display = "none";
    btnCancel.style.display = "inline-block";
}
function Edit() {
    const accountEmail = document.querySelector("#accountEmail");
    const accountPhone = document.querySelector("#accountPhone");
    const accountName = document.querySelector("#accountName");
    const btnEdit = document.getElementById("btnEdit");
    const btnEditPassword = document.getElementById("btnEditPassword");
    const btnCancel = document.getElementById("btnCancel");
    const btnSubmit = document.getElementById("btnSubmit");
    const Avt = document.getElementById("Avt");
    const text = document.getElementById("text");
    // Toggle button visibility
    btnSubmit.style.display = "inline-block";
    btnEdit.style.display = "none";
    btnEditPassword.style.display = "none";
    btnCancel.style.display = "inline-block";
    Avt.style.cursor = "pointer";
    text.style.display = "inherit";
    // Enable editing
    accountEmail.readOnly = false;
    accountPhone.readOnly = false;
    accountName.readOnly = false;
}

function CancelEdit() {
    const accountEmail = document.querySelector("#accountEmail");
    const accountName = document.querySelector("#accountName");
    const btnEdit = document.getElementById("btnEdit");
    const btnEditPassword = document.getElementById("btnEditPassword");
    const btnCancel = document.getElementById("btnCancel");
    const btnSubmit = document.getElementById("btnSubmit");
    const img = document.getElementById("Avt");
    const text = document.getElementById("text");
    const editAccountInfoFrm = document.getElementById("editAccountInfo");
    const editAccountPasswordFrm = document.getElementById("editAccountPassword");
    editAccountInfoFrm.style.display = "block";
    editAccountPasswordFrm.style.display = "none";
    // Restore the previous values
    fetchAccountDetails();
    // Toggle button visibility
    text.style.display = "none";
    btnSubmit.style.display = "none";
    btnEdit.style.display = "inline-block";
    btnEditPassword.style.display = "inline-block";
    btnCancel.style.display = "none";
    img.style.cursor = "none";

    // Disable editing
    accountEmail.readOnly = true;
    accountName.readOnly = true;
}
function fetchAccountDetails() {
    const id = getCookie("id");
    fetch("http://localhost/account/" + id)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("accountId").value = data.id;
            document.getElementById("accountUsername").value = data.username;
            document.getElementById("accountName").value = data.name;
            document.getElementById("Avt").src = data.image;
            document.getElementById("accountEmail").value = data.email;
            document.getElementById("wards").innerHTML =
                '<option value="' +
                data.ward_code_ward.code +
                '"">' +
                data.ward_code_ward.full_name +
                "</option>";
            document.getElementById("districts").innerHTML =
                '<option value="' +
                data.ward_code_ward.district_code_district.code +
                '"">' +
                data.ward_code_ward.district_code_district.full_name +
                "</option>";
            document.getElementById("provinces").innerHTML =
                '<option value="' +
                data.ward_code_ward.district_code_district.province_code_province
                    .code +
                '"">' +
                data.ward_code_ward.district_code_district.province_code_province
                    .full_name +
                "</option>";
        })
        .catch((error) => console.error("Error fetching provinces:", error));
}
document.getElementById("btnCancel").addEventListener("click", function () {
    const accountEmail = document.querySelector("#accountEmail");
    const accountName = document.querySelector("#accountName");
    const btnEdit = document.getElementById("btnEdit");
    const btnCancel = document.getElementById("btnCancel");
    const btnSubmit = document.getElementById("btnSubmit");
    const img = document.getElementById("Avt");
    const text = document.getElementById("text");

    // Restore the previous values
    fetchAccountDetails();
    // Toggle button visibility
    text.style.display = "none";
    btnSubmit.style.display = "none";
    btnEdit.style.display = "inline-block";
    btnCancel.style.display = "none";
    img.style.cursor = "none";

    // Disable editing
    accountEmail.readOnly = true;
    accountName.readOnly = true;
});