function showCreatePopup() {
  var ejsFilePath = "/page/brand/brand.create.ejs";
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
async function submitBrandForm(event, method) {
  event.preventDefault();
  var brandId = "";
  var brandName = document.getElementById("brandName").value;
  var brandImage = document.getElementById("brandImage").files[0];
  var brandInfo = document.getElementById("brandInfo").value;
  if (!brandName || !brandImage || !brandInfo) {
    alert("Vui lòng nhập đầy đủ thông tin");
  } else {
    const formData = new FormData();
    formData.append("name", brandName);
    formData.append("info", brandInfo);
    if (brandImage) formData.append("image", brandImage);
    if (method === "PUT") {
      brandId = document.getElementById("brandId").value;
    }

    try {
      const response = await axios({
        method: method,
        url: "http://localhost/brand/" + brandId,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Success:", response.data);

      if (method === "PUT") {
        BrandList();
        alert("Cập nhật thành công");
      }
      if (method === "POST") {
        closeCreatePopup();
        BrandList();
        alert("Thêm nhãn hiệu thành công");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
function BrandEdit(brand_id) {
  var ejsFilePath = "/page/brand/brand.edit.ejs";
  var root = document.getElementById("root");
  axios.get("http://localhost/brand/" + brand_id).then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, { brand: response.data });
        root.innerHTML = renderedHtml;
        document.getElementById("titlePage").innerHTML = "Chỉnh sửa nhãn hiệu";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
async function BrandDelete(brand_id) {
  var result = window.confirm("Bạn có muốn xoá nhãn hiệu này không?");
  if (result) {
    try {
      await axios.delete("http://localhost/brand/" + brand_id);
      // Yêu cầu xoá đã được xử lý, sau đó thực hiện BrandList()
      BrandList();
      alert("Đã xoá thành công");
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  }
}
