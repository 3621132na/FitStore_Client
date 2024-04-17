async function submitAccountForm(event, method) {
  event.preventDefault();
  var accountId = "";
  var accountName = document.getElementById("accountName").value;
  var accountImage = document.getElementById("Avt").files[0];
  var accountUserName = document.getElementById("accountUsername").value;
  var accountEmail = (document.getElementById("accountEmail").value =
    data.email);
  if (!accountName || !accountImage || !accountUserName) {
    alert("Vui lòng nhập đầy đủ thông tin");
  } else {
    const formData = new FormData();
    formData.append("name", accountName);
    formData.append("email", accountEmail);
    formData.append("userName", accountUserName);
    if (accountImage) formData.append("image", accountImage);
    if (method === "PUT") {
      accountId = document.getElementById("accountId").value;
    }
    try {
      const response = await axios({
        method: method,
        url: "http://localhost/account/" + accountId,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Success:", response.data);

      if (method === "PUT") {
        AccountList();
        alert("Cập nhật thành công");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
function AccountEdit(account_id) {
  var ejsFilePath = "/page/account/account.edit.ejs";
  var root = document.getElementById("root");
  axios.get("http://localhost/account/" + account_id).then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, {
          titlePage: "Chỉnh sửa tài khoản",
          account: response.data,
        });
        root.innerHTML = renderedHtml;
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
async function AccountDelete(account_id) {
  var result = window.confirm("Bạn có muốn xoá tài khoản này không?");
  if (result) {
    try {
      await axios.delete("http://localhost/account/" + account_id);
      // Yêu cầu xoá đã được xử lý, sau đó thực hiện AccountList()
      AccountList();
      alert("Đã xoá thành công");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  }
}
