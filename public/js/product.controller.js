async function ProductDetail(product_id) {
  var ejsFilePath = "/page/product/product.detail.ejs";
  var root = document.getElementById("root");
  fetch('http://localhost/product/watch/'+product_id,{
    method:'POST',
    headers:{
      Authorization: getCookie('token')
    }
  });
  await axios.get("http://localhost/product/" + product_id).then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, {
          product: response.data.product,
          solds: response.data.solds,
        });
        root.innerHTML = renderedHtml;
        var script = document.createElement("script");
        script.src = "/js/fetchOpt.js";
        root.appendChild(script);
        document.getElementById("titlePage").innerHTML = response.data.product.name;
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
function ProductEdit(product_id) {
  var ejsFilePath = "/page/product/product.edit.ejs";
  var root = document.getElementById("root");
  axios.get("http://localhost/product/" + product_id).then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, {
          product: response.data.product,
          solds: response.data.solds,
        });
        root.innerHTML = renderedHtml;
        var script = document.createElement("script");
        script.src = "/js/fetchOpt.js";
        root.appendChild(script);
        document.getElementById("titlePage").innerHTML = "Chỉnh sửa sản phẩm";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
async function ProductDelete(product_id) {
  var result = window.confirm("Bạn có muốn xoá sản phẩm này không?");
  if (result) {
    try {
      const response = await fetch(
        "http://localhost/product/" + product_id,
        {
          method: "DELETE",
          withCredentials: true,
          headers: {
            Authorization: getCookie("token"),
          },
        }
      );
      if (response.status !== 200) {
        const errorData = await response.json();
        alert(errorData.message);
        ProductList();
      } else {
        ProductList();
        alert("Đã xoá thành công");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
}
function showCreatePopup() {
  var ejsFilePath = "/page/product/product.create.ejs";
  var root = document.getElementById("root");
  fetch(ejsFilePath)
    .then((response) => response.text())
    .then((data) => {
      const renderedHtml = ejs.render(data);
      var popup = document.createElement("div");
      popup.id = "popupContainer";
      popup.innerHTML = renderedHtml;
      root.appendChild(popup);
      fetchOptions();
    })
    .catch((error) => console.error("Error fetching EJS file:", error));
}
function closeCreatePopup() {
  var root = document.getElementById("root");
  var popup = document.getElementById("popupContainer");

  if (popup) {
    root.removeChild(popup);
  }
}
function fetchOptions() {
  fetch("http://localhost/category")
    .then((res) => res.json())
    .then((data) => {
      // Bind data to the category select element
      const categorySelect = document.getElementById("category");
      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching categories:", error));
  fetch("http://localhost/brand")
    .then((res) => res.json())
    .then((data) => {
      // Bind data to the brand select element
      const brandSelect = document.getElementById("brand");
      data.forEach((brand) => {
        const option = document.createElement("option");
        option.value = brand.id;
        option.textContent = brand.name;
        brandSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching brands:", error));
}
async function submitProductForm(event) {
  event.preventDefault();
  try {
    var productName = document.getElementById("productName").value;
    var category = document.getElementById("category").value;
    var brand = document.getElementById("brand").value;
    var productImage = document.getElementById("productImage").files[0];
    var productPrice = document.getElementById("productPrice").value;
    var productInfo = document.getElementById("productInfo").value;
    var productStock = document.getElementById("productStock").value;
    if ( !productName || !category || !brand || !productImage || !productPrice || !productInfo || !productStock ) {
      alert("Vui lòng nhập đầy đủ thông tin");
    } else {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("category_id", category);
      formData.append("brand_id", brand);
      formData.append("price", productPrice);
      formData.append("info", productInfo);
      formData.append("stock", productStock);
      if (productImage) formData.append("image", productImage);
      console.log(formData);
      const response = await fetch(
        "http://localhost/product",
        {
          method: 'POST',
          body: formData,
          withCredentials: true,
          headers: {
            Authorization: getCookie("token"),
          },
        }
      );
      if (response.status === 201) {
        closeCreatePopup();
        ProductList();
        alert("Thêm sản phẩm thành công");
      }
      else {
        const errorData = await response.json();
        alert(errorData.message);
        ProductList();
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
async function submitEditProductForm(event) {
  event.preventDefault();
  try {
    var productId = document.getElementById("productId").value;
    var productName = document.getElementById("productName").value;
    var category = document.getElementById("category").value;
    var brand = document.getElementById("brand").value;
    var productImage = document.getElementById("productImage").files[0];
    var productPrice = document.getElementById("productPrice").value;
    var productInfo = document.getElementById("productInfo").value;
    var productStock = document.getElementById("productStock").value;

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category_id", category);
    formData.append("brand_id", brand);
    formData.append("price", productPrice);
    formData.append("info", productInfo);
    formData.append("stock", productStock);
    if (productImage) formData.append("image", productImage);
    console.log(formData);
    const response = await fetch(
      "http://localhost/product/" + productId,
      {
        method: 'PUT',
        body: formData,
        withCredentials: true,
        headers: {
          Authorization: getCookie("token"),
        },
      }
    );
    if (response.status === 201) {
      closeCreatePopup();
      ProductList();
      alert("Cập nhật thành công");
    }
    else {
      const errorData = await response.json();
      alert(errorData.message);
      ProductList();
    }
  } catch (error) {
    console.error("Error:", error);
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
async function AddToCart(product_id) {
  const account_id = getCookie("id");
  if (!account_id) {
    if (
      confirm(
        "Để tiếp tục bạn cần đăng nhập hoặc đăng ký, bạn có muốn đăng nhập không?"
      )
    ) {
      window.location.href = "/signin";
    }
  } else {
    const response = await fetch(
      "http://localhost/cart/" + product_id + "/" + account_id,
      {
        method: "PUT",
        withCredentials: true,
        headers: {
          Authorization: getCookie("token"),
        },
      }
    );
    getCartNumber();
    console.log(response.data);
  }
}
