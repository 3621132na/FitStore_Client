async function IncreaseByOne(product_id, product_price) {
  const account_id = getCookie("id");
  const response = await axios({
    method: "PUT",
    url: "http://localhost/cart/" + product_id + "/" + account_id,
  });
  getCartNumber();
  document.getElementById("product" + product_id + "number").value++;
  document.getElementById("product" + product_id + "total").innerText = (
    document.getElementById("product" + product_id + "number").value *
    product_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  var checkbox = document.getElementById(product_id);
  if (checkbox.checked) {
    var updateTotal = parseInt(document.getElementById("hiddenBillTotal").value);
    updateTotal += parseInt(product_price);
    document.getElementById("hiddenBillTotal").value = updateTotal;
    document.getElementById("billTotal").innerText = updateTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  checkItemNumber(product_id);
}
async function DecreaseByOne(product_id, product_price) {
  const account_id = getCookie("id");
  const response = await axios({
    method: "PATCH",
    url: "http://localhost/cart/" + product_id + "/" + account_id,
  });
  getCartNumber();
  document.getElementById("product" + product_id + "number").value--;
  document.getElementById("product" + product_id + "total").innerText = (
    document.getElementById("product" + product_id + "number").value *
    product_price
  )
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  var checkbox = document.getElementById(product_id);
  if (checkbox.checked) {
    var updateTotal = parseInt(document.getElementById("hiddenBillTotal").value);
    updateTotal -= parseInt(product_price);
    document.getElementById("hiddenBillTotal").value = updateTotal;
    document.getElementById("billTotal").innerText = updateTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  checkItemNumber(product_id);
}
async function RemoveItem(product_id, product_price) {
  var userResponse = confirm("Bạn có chắc muốn xoá sản phẩm này không?");
  if (userResponse) {
    const account_id = getCookie("id");
    const response = await axios({
      method: "DELETE",
      url: "http://localhost/cart/" + product_id + "/" + account_id,
    });
    getCartNumber();
    var updateTotal = parseInt(
      document.getElementById("hiddenBillTotal").value
    );
    updateTotal -=
      parseInt(product_price) *
      document.getElementById("product" + product_id + "number").value;
    document.getElementById("hiddenBillTotal").value = updateTotal;
    document.getElementById("billTotal").innerText = updateTotal
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    document.getElementById("product" + product_id + "item").remove();
    alert("Đã xoá sản phẩm khỏi giỏ hàng");
  }
}
async function RemoveAllItem() {
  var userResponse = confirm(
    "Bạn có chắc muốn xoá tất cả sản phẩm trong giỏ hàng không?"
  );
  if (userResponse) {
    const account_id = getCookie("id");
    const response = await axios({
      method: "DELETE",
      url: "http://localhost/cart/" + account_id,
    });
    getCartNumber();
    CartList();
    alert("Đã xoá tất cả sản phẩm khỏi giỏ hàng");
  }
}
function checkItemNumber(product_id) {
  var number = document.getElementById("product" + product_id + "number").value;
  var button = document.getElementById("product" + product_id + "button");
  if (number === "1") button.classList.add("disable-btn");
  else button.classList.remove("disable-btn");
}
//trang cart
async function Payment() {
  var items = document.querySelectorAll('.item-check');
  const checkedItems = [];
  items.forEach(checkbox => {
    if (checkbox.checked) {
      checkedItems.push(checkbox.id);
    }
  });
  if(checkedItems.length === 0){
    alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán');
  }
  else {
    var account_id = getCookie("id");
    var ejsFilePath = "/page/cart/cart.pay.ejs";
    var root = document.getElementById("root");
    var account;

    axios.get("http://localhost/account/" + account_id).then((response) => {
      account = response.data;
    });
    const reqData = {
      ids: checkedItems,
      account_id: account_id,
    };
    await axios.put("http://localhost/cart/ids", reqData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      fetch(ejsFilePath)
        .then((response) => response.text())
        .then((data) => {
          const renderedHtml = ejs.render(data, {
            data: response.data,
            account: account,
            items: checkedItems,
          });
          root.innerHTML = renderedHtml;
          var cartController = document.createElement("script");
          cartController.src = "/js/cart.controller.js";
          root.appendChild(cartController);
          document.getElementById("titlePage").innerHTML = "Thanh toán";
        })
        .catch((error) => console.error("Error fetching EJS file:", error));
    });
  }
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
async function SubmitOrder(event) {
  event.preventDefault();
  var items = document.querySelectorAll('.item-id');
  const checkedItems = [];
  items.forEach(id => {
    checkedItems.push(parseInt(id.value));
  });
  var account_id = getCookie("id");
  var total = document.getElementById("hiddenBillTotal").value;
  var ward_code = document.getElementById("wards").value;
  var formData = new FormData();
  formData.append("account_id", account_id);
  formData.append("total", total);
  formData.append("ward_code", ward_code);
  formData.append('items', JSON.stringify(checkedItems));
  await axios("http://localhost/order/", {
    method: "POST",
    data: formData,
    headers: {
      Authorization: getCookie("token"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 201) {
        alert("Ordered successfully");
        var ejsFilePath = "/page/cart/cart.success.ejs";
        var targetElement = document.getElementById("root");
        fetch(ejsFilePath)
          .then((response) => response.text())
          .then((data) => {
            targetElement.innerHTML = data;
            document.getElementById("titlePage").innerHTML = "Thanh toán thành công";
            getCartNumber();
          })
          .catch((error) => console.error("Error fetching HTML file:", error));
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function onItemChecked(checkbox, product_id, product_price) {
  var product_number = parseInt(document.getElementById(product_id).value);
  var updateTotal = parseInt(document.getElementById("hiddenBillTotal").value);
  if (checkbox.checked) {
    updateTotal += parseInt(product_price) * product_number;
  } else {
    updateTotal -= parseInt(product_price) * product_number;
  }
  document.getElementById("hiddenBillTotal").value = updateTotal;
  document.getElementById("billTotal").innerText = updateTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function ChangeAll(checkbox){
  var otherCheckboxes = document.querySelectorAll('.item-check');
  if(checkbox.checked){
    otherCheckboxes.forEach(checkbox=>{
      if(!checkbox.checked){
        checkbox.checked=true;
        checkbox.dispatchEvent(new Event('change'));
      }
    })
  }
  else{
    otherCheckboxes.forEach(checkbox=>{
      if(checkbox.checked){
        checkbox.checked=false;
        checkbox.dispatchEvent(new Event('change'));
      }
    })
  }
}
