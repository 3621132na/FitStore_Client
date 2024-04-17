topSales();
monthIncome((new Date()).getMonth() + 1,(new Date()).getFullYear());
function monthIncome(month,year) {
    axios.get("http://localhost/statistic/income/" + month +'/'+year).then((response) => {
        fetch('/page/statistic/income.ejs')
            .then((response) => response.text())
            .then((data) => {
                const renderedHtml = ejs.render(data, { data: response.data });
                var chart = document.createElement('div');
                chart.id='month_income';
                chart.style.display = "flex";
                chart.style.justifyContent = "center";
                chart.innerHTML = renderedHtml;
                root.appendChild(chart);
                //checkMonthNumber();
            })
            .catch((error) => console.error("Error fetching EJS file:", error));
    });
}
function topSales(){
    axios.get("http://localhost/statistic/topSales").then((response) => {
    fetch('/page/statistic/top.sale.ejs')
      .then((response) => response.text())
      .then((data) => {
        const renderedHtml = ejs.render(data,{data:response.data});
        var chart = document.createElement('div');
        chart.innerHTML = renderedHtml;
        root.appendChild(chart);
        document.getElementById("titlePage").innerHTML = "Thống kê";
      })
      .catch((error) => console.error("Error fetching EJS file:", error));
  });
}
async function updateMonthIncome(month,year) {
    axios.get("http://localhost/statistic/income/" + month+'/'+year).then((response) => {
        fetch('/page/statistic/income.ejs')
            .then((response) => response.text())
            .then((data) => {
                const renderedHtml = ejs.render(data, { data: response.data });
                var chart = document.getElementById('month_income');
                chart.innerHTML = renderedHtml;
                document.getElementById('month').value=parseInt(month);
                document.getElementById('year').value=parseInt(year);
                //checkMonthNumber();
            })
            .catch((error) => console.error("Error fetching EJS file:", error));
    });
}
function increase(){
    var month = document.getElementById('month');
    var year = document.getElementById('year');
    if(month.value === '12') {
        year.value++;
        month.value = '1';
    }
    else month.value++;
    updateMonthIncome(month.value,year.value);
}
function decrease(){
    var month = document.getElementById('month');
    var year = document.getElementById('year');
    if(month.value === '1') {
        year.value--;
        month.value = '12';
    }
    else month.value--;
    updateMonthIncome(month.value,year.value);
}
function increaseYear(){
    var month = document.getElementById('month');
    var year = document.getElementById('year');
    year.value++;
    updateMonthIncome(month.value,year.value);
}
function decreaseYear(){
    var month = document.getElementById('month');
    var year = document.getElementById('year');
    year.value--;
    updateMonthIncome(month.value,year.value);
}
function checkMonthNumber() {
    var number = document.getElementById('month').value;
    var buttonPlus = document.getElementById('btnIncrease');
    var buttonMinus = document.getElementById('btnDecrease');
    if (number === "12") buttonPlus.classList.add("disable-btn");
    else buttonPlus.classList.remove("disable-btn");
    if (number === "1") buttonMinus.classList.add("disable-btn");
    else buttonMinus.classList.remove("disable-btn");
}
