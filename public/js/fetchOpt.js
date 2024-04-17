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