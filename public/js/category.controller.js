function showCreatePopup() {
  var ejsFilePath = "/page/category/category.create.ejs";
  var root = document.getElementById("root");
  fetch(ejsFilePath)
    .then((response) => response.text())
    .then((data) => {
      const renderedHtml = ejs.render(data);
      var popup = document.createElement("div");
      popup.id = "popupContainer";
      popup.innerHTML = renderedHtml;
      root.appendChild(popup);
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
async function submitCategoryForm(event, method) {
  event.preventDefault();
  var categoryId = "";
  var categoryName = document.getElementById("categoryName").value;
  var categoryInfo = document.getElementById("categoryInfo").value;
  if (!categoryName || !categoryInfo) {
    alert("Vui lòng nhập đầy đủ thông tin");
  } else {
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("info", categoryInfo);
    if (method === "PUT") {
      categoryId = document.getElementById("categoryId").value;
    }

    try {
      const response = await axios({
        method: method,
        url: "http://localhost/category/" + categoryId,
        data: formData,
        headers: { "Content-Type": "application/json" },
      });

      console.log("Success:", response.data);

      if (method === "PUT") {
        CategoryList();
        alert("Cập nhật thành công");
      }
      if (method === "POST") {
        closeCreatePopup();
        CategoryList();
        alert("Thêm loại sản phẩm thành công");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

function CategoryEdit(category_id) {
  var ejsFilePath = "/page/category/category.edit.ejs";
  var root = document.getElementById("root");
  axios
    .get("http://localhost/category/" + category_id)
    .then((response) => {
      data = response.data;
      fetch(ejsFilePath)
        .then((response) => response.text())
        .then((data) => {
          const renderedHtml = ejs.render(data, { category: response.data });
          root.innerHTML = renderedHtml;
          document.getElementById("titlePage").innerHTML =
            "Chỉnh sửa loại sản phẩm";
        })
        .catch((error) => console.error("Error fetching EJS file:", error));
    });
}
async function CategoryDelete(category_id) {
  var result = window.confirm("Bạn có muốn xoá thể loại này không?");
  if (result) {
    try {
      await axios.delete("http://localhost/category/" + category_id);
      // Yêu cầu xoá đã được xử lý, sau đó thực hiện CategoryList()
      CategoryList();
      alert("Đã xoá thành công");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }
}
