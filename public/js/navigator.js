//trang home
function Home() {
  var root = document.getElementById("root");
  fetch("/page/home/home.header.ejs")
    .then((response) => response.text())
    .then((data) => {
      const renderedHtml = ejs.render(data);
      var productController = document.createElement("script");
      productController.src = "/js/product.controller.js";
      root.appendChild(productController);
      root.innerHTML = renderedHtml;
    })
    .catch((error) => console.error("Error fetching EJS file:", error));
  //Danh sách sản phẩm bán chạy
  axios
    .get("http://localhost/recommend/topSolds", {
      headers: { authorization: getCookie("token") },
    })
    .then((response) => {
      fetch("/page/home/top.sold.ejs")
        .then((response) => response.text())
        .then((data) => {
          const renderedHtml = ejs.render(data, {
            data: response.data,
          });
          var list1 = document.createElement("div");
          list1.innerHTML +=
            '<h4 style="font-style:italic; text-decoration: underline; margin:30px 0 0 50px;">Được mua nhiều nhất</h4>';
          list1.innerHTML += renderedHtml;
          root.appendChild(list1);
          document.getElementById("titlePage").innerHTML = "Trang chủ";
        })
        .catch((error) => console.error("Error fetching EJS file:", error));
    })
    .catch((err) => console.log(err));
  //Sản phẩm đánh giá trung bình cao
  axios
    .get("http://localhost/recommend/topRating", {
      headers: { authorization: getCookie("token") },
    })
    .then((response) => {
      fetch("/page/home/top.rating.ejs")
        .then((response) => response.text())
        .then((data) => {
          const renderedHtml = ejs.render(data, {
            data: response.data,
          });
          var list1 = document.createElement("div");
          list1.innerHTML +=
            '<h4 style="font-style:italic; text-decoration: underline; margin:30px 0 0 50px;">Đánh giá trung bình cao</h4>';
          list1.innerHTML += renderedHtml;
          root.appendChild(list1);
          document.getElementById("titlePage").innerHTML = "Trang chủ";
        })
        .catch((error) => console.error("Error fetching EJS file:", error));
    })
    .catch((err) => console.log(err));
  //Sản phẩm đề xuất cá nhân
  axios
    .get("http://localhost/recommend", {
      headers: { authorization: getCookie("token") },
    })
    .then((response) => {
      if (response.data) {
        fetch("/page/home/home.view.ejs")
          .then((response) => response.text())
          .then((data) => {
            const renderedHtml = ejs.render(data, {
              data: response.data,
            });
            var list2 = document.createElement("div");
            list2.innerHTML +=
              '<h4 style="font-style:italic; text-decoration: underline; margin:30px 0 0 50px;">Có thể bạn sẽ thích</h4>';
            list2.innerHTML += renderedHtml;
            root.appendChild(list2);
          })
          .catch((error) => console.error("Error fetching EJS file:", error));
      }
    })
    .catch((err) => console.log(err));
  axios
    .get("http://localhost/recommend/watched", {
      headers: { authorization: getCookie("token") },
    })
    .then((response) => {
      if (response.data) {
        fetch("/page/home/watched.products.ejs")
          .then((response) => response.text())
          .then((data) => {
            const renderedHtml = ejs.render(data, {
              data: response.data,
            });
            var list2 = document.createElement("div");
            list2.innerHTML +=
              '<h4 style="font-style:italic; text-decoration: underline; margin:30px 0 0 50px;">Sản phẩm bạn đã xem </h4>';
            list2.innerHTML += renderedHtml;
            root.appendChild(list2);
          })
          .catch((error) => console.error("Error fetching EJS file:", error));
      }
    })
    .catch((err) => console.log(err));
}
//Trang giới thiệu
function Introduce() {
  var ejsFilePath = "/page/introduce.ejs";
  var targetElement = document.getElementById("root");
  fetch(ejsFilePath)
    .then((response) => response.text())
    .then((data) => {
      targetElement.innerHTML = data;
      document.getElementById("titlePage").innerHTML = "Giới thiệu";
    })
    .catch((error) => console.error("Error fetching HTML file:", error));
}

//Trang sản phẩm Admin
function ProductList() {
  var ejsFilePath = "/page/product/product.list.ejs";
  var root = document.getElementById("root");
  var data;
  axios.get("http://localhost/product").then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, {
          titlePage: "Sản phẩm",
          data: response.data,
        });
        root.innerHTML = renderedHtml;
        var productController = document.createElement("script");
        productController.src = "/js/product.controller.js";
        root.appendChild(productController);
        document.getElementById("titlePage").innerHTML = "Quản lý sản phẩm";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
//Trang sản phẩm khách hàng
function ProductView(page) {
  var ejsFilePath = "/page/product/product.view.ejs";
  var root = document.getElementById("root");
  var products;
  console.log(page);
  let currentPage = page || 1;
  const itemsPerPage = 8;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  axios.get("http://localhost/product").then((response) => {
    products = response.data;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Calculate the total number of pages
    const totalPages = Math.ceil(products.length / itemsPerPage);

    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        console.log(paginatedProducts);
        const renderedHtml = ejs.render(data, {
          data: paginatedProducts,
          currentPage: currentPage,
          totalPages: totalPages,
        });
        root.innerHTML = renderedHtml;
        var productController = document.createElement("script");
        productController.src = "/js/product.controller.js";
        root.appendChild(productController);
        document.getElementById("titlePage").innerHTML = "Sản phẩm";

        // Update state without modifying the URL
        window.currentPage = currentPage;
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}

//Trang liên hệ
function Contact() {
  var ejsFilePath = "/page/contact.ejs";
  var root = document.getElementById("root");
  fetch(ejsFilePath)
    .then((response) => response.text())
    .then((data) => {
      const renderedHtml = ejs.render(data);
      root.innerHTML = renderedHtml;
      document.getElementById("titlePage").innerHTML = "Liên hệ";
    })
    .catch((error) => console.error("Error fetching EJS file:", error));
}

function changeActiveState(id) {
  var navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(function (link) {
    link.classList.remove("active");
  });
  var element = document.getElementById(id);
  element.classList.add("active");
}
//trang nhãn hiệu admin
function BrandList() {
  var ejsFilePath = "/page/brand/brand.list.ejs";
  var root = document.getElementById("root");
  var data;
  axios.get("http://localhost/brand").then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, {
          titlePage: "Nhãn hiệu",
          data: response.data,
        });
        root.innerHTML = renderedHtml;
        var brandController = document.createElement("script");
        brandController.src = "/js/brand.controller.js";
        root.appendChild(brandController);
        document.getElementById("titlePage").innerHTML = "Nhãn hiệu";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
//trang category admin
function CategoryList() {
  var ejsFilePath = "/page/category/category.list.ejs";
  var root = document.getElementById("root");
  var data;
  axios.get("http://localhost/category").then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, {
          titlePage: "Loại sản phẩm",
          data: response.data,
        });
        root.innerHTML = renderedHtml;
        var categoryController = document.createElement("script");
        categoryController.src = "/js/category.controller.js";
        root.appendChild(categoryController);
        document.getElementById("titlePage").innerHTML = "Thể loại";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
//trang account admin
function AccountList() {
  var ejsFilePath = "/page/account/account.list.ejs";
  var root = document.getElementById("root");
  var data;
  axios.get("http://localhost/account").then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, {
          titlePage: "Tài khoản",
          data: response.data,
        });
        root.innerHTML = renderedHtml;
        var accountController = document.createElement("script");
        accountController.src = "/js/account.controller.js";
        root.appendChild(accountController);
        document.getElementById("titlePage").innerHTML = "Tài khoản";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
//Trang cart
function CartList() {
  var account_id = getCookie("id");
  if (!account_id) {
    if (
      confirm(
        "Để tiếp tục bạn cần đăng nhập hoặc đăng ký, bạn có muốn đăng nhập không?"
      )
    ) {
      window.location.href = "/signin";
    }
  }
  var ejsFilePath = "/page/cart/cart.list.ejs";
  var root = document.getElementById("root");
  var data;
  axios.get("http://localhost/cart/" + account_id).then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        console.log(response.data);
        const renderedHtml = ejs.render(data, {
          titlePage: "Giỏ hàng",
          data: response.data,
        });
        root.innerHTML = renderedHtml;
        var cartController = document.createElement("script");
        cartController.src = "/js/cart.controller.js";
        root.appendChild(cartController);
        document.getElementById("titlePage").innerHTML = "Giỏ hàng";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
function HistoryList() {
  var account_id = getCookie("id");
  var ejsFilePath = "/page/cart/cart.history.ejs";
  var root = document.getElementById("root");
  var data;
  axios
    .get("http://localhost/order/acc/" + account_id)
    .then((response) => {
      data = response.data;
      fetch(ejsFilePath)
        .then((response) => response.text())
        .then((data) => {
          const renderedHtml = ejs.render(data, {
            titlePage: "Lịch sử mua hàng",
            data: response.data,
          });
          root.innerHTML = renderedHtml;
          document.getElementById("titlePage").innerHTML = "Lịch sử mua hàng";
        })
        .catch((error) => console.error("Error fetching EJS file:", error));
    });
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
//trang quản lý tài khoản
function PersonalAccountEdit() {
  var ejsFilePath = "/page/account/personal.account.ejs";
  var root = document.getElementById("root");
  axios
    .get("http://localhost/account/" + getCookie("id"))
    .then((response) => {
      const account = response.data;
      fetch(ejsFilePath)
        .then((response) => response.text())
        .then((data) => {
          const renderedHtml = ejs.render(data, { data: account });
          root.innerHTML = renderedHtml;
          var script1 = document.createElement("script");
          script1.src = "/js/account/edit.account.js";
          var script2 = document.createElement("script");
          script2.src = "/js/form.handle.js";
          var script3 = document.createElement("script");
          script3.src = "/js/fetch.address.js";
          script1.onload = "fetchAccountDetails()";
          root.appendChild(script1);
          root.appendChild(script2);
          root.appendChild(script3);
          document.getElementById("titlePage").innerHTML = "Quản lý tài khoản";
        })
        .catch((error) => console.error("Error fetching HTML file:", error));
    });
}
//trang post
function PostList() {
  var ejsFilePath = "/page/post/post.list.ejs";
  var root = document.getElementById("root");
  var data;
  axios.get("http://localhost/post").then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, {
          titlePage: "Post",
          data: response.data,
        });
        root.innerHTML = renderedHtml;
        var postController = document.createElement("script");
        postController.src = "/js/post.controller.js";
        root.appendChild(postController);
        document.getElementById("titlePage").innerHTML = "Bài viết";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
async function SubmitSearch(event) {
  event.preventDefault();
  var search = document.getElementById("search-bar").value;
  if (search) {
    var ejsFilePath = "/page/product/product.search.ejs";
    var root = document.getElementById("root");
    axios
      .get("http://localhost/product/search/" + search)
      .then((response) => {
        fetch(ejsFilePath)
          .then((response) => response.text())
          .then((data) => {
            const renderedHtml = ejs.render(data, {
              data: response.data,
            });
            root.innerHTML = renderedHtml;
            var productController = document.createElement("script");
            productController.src = "/js/product.controller.js";
            root.appendChild(productController);
            document.getElementById("titlePage").innerHTML = "Sản phẩm";
          })
          .catch((error) => console.error("Error fetching EJS file:", error));
      });
  } else {
    alert("Vui lòng nhập từ khoá bạn muốn tìm");
  }
}
async function rating(stars, order_id, product_id) {
  var formData = new FormData();
  formData.append("product_id", product_id);
  formData.append("order_id", order_id);
  formData.append("rating", stars);
  await axios("http://localhost/order/rating", {
    method: "PUT",
    data: formData,
    headers: {
      Authorization: getCookie("token"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        alert("Đánh giá thành công !");
        HistoryList();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function Statistic(){
  var root = document.getElementById("root");
  fetch("/page/statistic/header.ejs")
    .then((response) => response.text())
    .then((data) => {
      const renderedHtml = ejs.render(data);
      root.innerHTML = renderedHtml;
    })
    .catch((error) => console.error("Error fetching EJS file:", error));
  var controller = document.createElement('script');
  controller.src='/js/statistic.controller.js';
  root.appendChild(controller);
}

