function switchToForm2(event) {
  event.preventDefault();
  if (validateForm1()) {
    document.getElementById("form1").style.display = "none";
    document.getElementById("form2").style.display = "block";
  }
}
function switchToForm1(event) {
  event.preventDefault();
  document.getElementById("form1").style.display = "block";
  document.getElementById("form2").style.display = "none";
}
function validateForm1() {
  var accountName = document.getElementById("accountName").value;
  var accountEmail = document.getElementById("accountEmail").value;
  if (accountName === "" || accountEmail === "") {
    alert(
      "Vui lòng nhập thông tin cho Form 1 trước khi chuyển sang Form 2."
    );
    return false;
  }
  return true;
}
function submitForm(event, method) {
  event.preventDefault();
  var accountId = "";
  var accountUsername = document.getElementById("accountUsername").value;
  if (method === 'POST') {
    var accountPassword = document.getElementById("accountPassword").value;
    var checkPassword = document.getElementById("checkPassword").value;
  }
  var accountImage = document.getElementById("profileImage").files[0];
  var accountEmail = document.getElementById("accountEmail").value;
  var accountPhone = document.getElementById("accountPhone").value;
  var accountName = document.getElementById("accountName").value;
  if (accountPassword !== checkPassword) {
    window.alert("Mật khẩu nhập lại không đúng!!!");
  } else if (
    accountUsername === "" ||
    accountPassword === "" ||
    checkPassword === ""
  ) {
    alert("Vui lòng nhập thông tin cho Form 2 trước khi hoàn tất.");
  } else {
    const formData = new FormData();
    formData.append("username", accountUsername);
    if (method === 'POST') formData.append("password", accountPassword);
    if (accountImage) formData.append("image", accountImage);
    else formData.append("image", document.getElementById("Avt").src);
    formData.append("email", accountEmail);
    formData.append("phone", accountPhone);
    formData.append("name", accountName);
    if (method === 'PUT') {
      accountId = document.getElementById('accountId').value;
      formData.append("id", accountId);
    }
    fetch("http://localhost/account/" + accountId, {
      method: method,
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Success:", data);
        if (method === 'POST') window.location.href = "/signin";
        else PersonalAccountEdit();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
function submitChangePassword(event){
  event.preventDefault();
  try{
    var oldPass = document.getElementById('oldPass').value;
    var newPass = document.getElementById('newPass').value;
    var confirmNewPass = document.getElementById('confirmNewPass').value;
    if(oldPass===''||newPass === ''||confirmNewPass===''){
      alert('Vui lòng nhập đầy đủ thông tin');
    }
    else if(confirmNewPass!==newPass){
      alert('Mật khẩu nhập lại không đúng');
    }
    else{
      fetch('http://localhost/account/changePassword',{
        method:'POST',
        body:JSON.stringify({
          oldPass: oldPass,
          newPass: newPass,
        }),
        headers:{
          Authorization:getCookie('token'),
          'Content-Type':'application/json'
        }
      }).then(response =>{
        if(response.status===404){
          alert('Session không hợp lệ hoặc đã hết hạn');
        }
        if(response.status === 401){
          alert('Mật khẩu cũ không đúng');
        }
        if(response.status === 200){
          alert('Đổi mật khẩu thành công !\nvui lòng đăng nhập lại bằng mật khẩu mới !');
          window.location.href = '/logout';
        }
      })
    }
  }catch(err){
    console.log(err);
  }
}