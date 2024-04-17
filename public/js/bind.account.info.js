document.addEventListener('DOMContentLoaded', function () {
    const idCookieExists = document.cookie.includes('id=');
    const accountImage = document.getElementById('accountImage');
    const imageFromCookie = getCookie('image');
    if (imageFromCookie) {
      accountImage.src = decodeURIComponent(imageFromCookie);
    }
    const dropdownMenu = document.querySelector('.drop1');
    if (idCookieExists) {
      getCartNumber();
      // Thực hiện logic khi cookie 'id' tồn tại
      dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" style="cursor:pointer" onclick="PersonalAccountEdit(); changeActiveState('')">Quản lý tài khoản</a></li>
        <li><a class="dropdown-item" style="cursor:pointer" onclick="HistoryList(); changeActiveState('')">Lịch sử mua hàng</a></li>
        <li><a class="dropdown-item" href="/logout">Đăng xuất</a></li>
      `;
    } else {
      // Thực hiện logic khi cookie 'id' không tồn tại
      dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="/signin">Đăng nhập</a></li>
        <li><a class="dropdown-item" href="/signup">Đăng ký</a></li>
      `;
    }
  });
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  function getCartNumber(){
    var account_id=getCookie('id');
    fetch('http://localhost/cart/'+account_id,{
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: getCookie('token')
      }
    })
    .then(response => response.json())
    .then(data =>{
      document.getElementById('num-cart').innerHTML=data.length;
    })   
    .catch(error =>{
      console.log(error);
    });
  }