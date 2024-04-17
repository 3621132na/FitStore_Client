function PostCreate() {
  var ejsFilePath = "/page/post/post.create.ejs";
  var root = document.getElementById("root");
  fetch(ejsFilePath)
    .then((response) => response.text())
    .then((data) => {
      root.innerHTML = data;
      document.getElementById("titlePage").innerHTML = "Thêm bài viết";
    })
    .catch((error) => console.error("Error fetching EJS file:", error));
}
async function submitPostForm(event, method) {
  event.preventDefault();
  var postId = "";
  var postTitle = document.getElementById("postTitle").value;
  var postIntro = document.getElementById("postIntro").value;
  var postImage = document.getElementById("postImage").files[0];
  var postAuthor = getCookie("id");
  if (!postTitle || !postIntro || !postImage || !postAuthor) {
    alert("Vui lòng nhập đầy đủ thông tin");
  } else {
    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("author_id", postAuthor);
    formData.append("intro", postIntro);
    if (postImage) formData.append("background", postImage);
    if (method === "PUT") {
      postId = document.getElementById("postId").value;
    }
    try {
      const response = await axios({
        method: method,
        url: "http://localhost/post/" + postId,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      CreateContents(response.data.id);
      console.log("Success:", response.data);
      PostList();
      alert("Thêm blog thành công");
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
async function CreateContents(post_id) {
  var forms = document.querySelectorAll(".contentForm");
  forms.forEach(async function (form) {
    var contentformData = new FormData(form);
    contentformData.append("post_id", post_id);
    const res = await axios.post(
      "http://localhost/post_content",
      contentformData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("create content success");
  });
}
function PreviewImage(input, image) {
  const img = document.getElementById(image);

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      img.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
  }
}
function AddContent() {
  var ejsFilePath = "/page/post/content.form.ejs";
  var root = document.getElementById("contents");
  fetch(ejsFilePath)
    .then((response) => response.text())
    .then((data) => {
      var newForm = document.createElement("form");
      newForm.innerHTML = data;
      newForm.classList.add("contentForm");
      newForm.style.width = "800px";
      root.appendChild(newForm);
    })
    .catch((error) => console.error("Error fetching EJS file:", error));
}
function PostDetail(post_id) {
  var ejsFilePath = "/page/post/post.detail.ejs";
  var root = document.getElementById("root");
  axios.get("http://localhost/post/" + post_id).then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, { post: response.data });
        root.innerHTML = renderedHtml;
        // var script = document.createElement('script');
        // script.src = '/js/fetchOpt.js';
        // root.appendChild(script);
        document.getElementById("titlePage").innerHTML = response.data.title;
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
function PostEdit(post_id) {
  var ejsFilePath = "/page/post/post.edit.ejs";
  var root = document.getElementById("root");
  axios.get("http://localhost/post/" + post_id).then((response) => {
    data = response.data;
    fetch(ejsFilePath)
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data, { post: response.data });
        root.innerHTML = renderedHtml;
        // var script = document.createElement('script');
        // script.src = '/js/fetchOpt.js';
        // root.appendChild(script);
        document.getElementById("titlePage").innerHTML = "post";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
