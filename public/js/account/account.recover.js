async function SendEmail(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    if (!email) {
        document.getElementById('message').value = 'Vui lòng nhập email';
    }
    else {
        await fetch(
            "http://localhost/account/" + email,
            {
                method: "PATCH",
                withCredentials: true,
            }
        ).then(response => {
            if (response.status === 404) {
                document.getElementById('emailMessage').innerHTML = 'Không tìm thấy tài khoản khớp với email trên';
            }
            if (response.status === 200) {
                return response.text();
                
            }
        }).then(data =>{
            alert(data);
            SwitchToCodeForm();
        })
        .catch(err => {
            console.log(err);
        });

    }
}
function SwitchToCodeForm() {
    document.getElementById('formEmail').style.display = 'none';
    document.getElementById('submitEmail').style.display = 'none';
    document.getElementById('formCode').style.display = 'block';
    document.getElementById('submitCode').style.display = 'block';
}
function SwitchToEmailForm(event) {
    event.preventDefault();
    document.getElementById('formEmail').style.display = 'block';
    document.getElementById('submitEmail').style.display = 'block';
    document.getElementById('formCode').style.display = 'none';
    document.getElementById('submitCode').style.display = 'none';
}
var token;
async function VerifyCode(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var code = document.getElementById('verifyCode').value;
    if (!code) {
        document.getElementById('message').value = 'Vui lòng nhập mã xác thực';
    }
    else {
        var formData = new FormData();
        formData.append('email', email);
        formData.append('code', code);
        await axios({
            method: 'POST',
            url: "http://localhost/account/verify",
            data: formData,
            headers: { "Content-Type": "application/json" },
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            },
        }).then(response => {
            if (response.status === 400) {
                document.getElementById('codeMessage').innerHTML = 'Mã xác thực không chính xác !';
            }
            if (response.status === 200) {
                token = response.data.token;
                SwitchToPasswordForm(event);
                alert('Xác thực thành công , vui lòng nhập mật khẩu mới');
            }
        }).catch(err => {
            console.log(err);
        });
    }
}
function SwitchToPasswordForm(event) {
    event.preventDefault();
    document.getElementById('formNewPassword').style.display = 'block';
    document.getElementById('submitNewPassword').style.display = 'block';
    document.getElementById('formCode').style.display = 'none';
    document.getElementById('submitCode').style.display = 'none';
}
async function ChangePassword(event) {
    event.preventDefault();
    var newPassword = document.getElementById('newPassword').value;
    var formData = new FormData();
    formData.append('password', newPassword);
    formData.append('token', token);
    await axios({
        method: 'PUT',
        url: "http://localhost/account/",
        data: formData,
        headers: { "Content-Type": "application/json" },
        validateStatus: function (status) {
            return status >= 200 && status < 500;
        },
    }).then(response=>{
        if(response.status===200){
            alert('Thay đổi mật khẩu thành công , mời bạn đăng nhập !')
            window.location.href='/signin';
        }
        else{
            alert('token không chính xác , vui lòng kiểm tra lại');
        }
    })
}