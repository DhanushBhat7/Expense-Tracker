document.addEventListener("DOMContentLoaded", () => {
    const incomeInput = document.getElementById("income");
    const setIncomeBtn = document.getElementById("set-income-btn");
    const amountInput = document.getElementById("amount");
    const addExpenseBtn = document.getElementById("add-expense-btn");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const remainingEl = document.getElementById("remaining");
    const debtCard = document.getElementById("debt-card");
    const debtEl = document.getElementById("debt");
    const categorySummary = document.getElementById("category-summary");
    const expenseChart = document.getElementById("expense-chart").getContext("2d");
    const lastChangedInput = document.getElementById("last-changed");
    const setDateBtn = document.getElementById("set-date-btn");
    const lastChangedDisplay = document.getElementById("last-changed-display");
    const monthSelector = document.getElementById("month-selector");
    const yearSelector = document.getElementById("year-selector");
  
    let selectedCategory = "";
    const data = {};
  
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
  
    const getCurrentPeriodKey = () => `${yearSelector.value}-${monthSelector.value}`;
  
    const initializeData = () => {
      if (!data[getCurrentPeriodKey()]) {
        data[getCurrentPeriodKey()] = {
          income: 0,
          remaining: 0,
          debt: 0,
          expenses: {},
          lastChangedDate: "",
        };
      }
    };
  
    const updateUI = () => {
      const currentData = data[getCurrentPeriodKey()];
      remainingEl.textContent = currentData.remaining;
      debtEl.textContent = currentData.debt;
      lastChangedDisplay.textContent = currentData.lastChangedDate
        ? `Last Changed: ${currentData.lastChangedDate}`
        : "No date set";
  
      if (currentData.debt > 0) {
        debtCard.style.display = "block";
      } else {
        debtCard.style.display = "none";
      }
  
      categorySummary.innerHTML = "";
      Object.keys(currentData.expenses).forEach((category) => {
        const amount = currentData.expenses[category];
        const card = document.createElement("div");
        card.className = "card";
        card.innerText = `${category}: $${amount}`;
        categorySummary.appendChild(card);
      });
  
      updateChart(currentData.expenses);
    };
  
    const updateChart = (expenses) => {
      const chartData = {
        labels: Object.keys(expenses),
        datasets: [
          {
            data: Object.values(expenses),
            backgroundColor: [
              "#ff5722",
              "#4caf50",
              "#2196f3",
              "#ffeb3b",
              "#673ab7",
              "#009688",
              "#e91e63",
              "#795548",
              "#607d8b",
              "#ff9800",
            ],
          },
        ],
      };
  
      if (window.myPieChart) {
        window.myPieChart.destroy();
      }
  
      window.myPieChart = new Chart(expenseChart, {
        type: "pie",
        data: chartData,
      });
    };
  
    const saveData = () => {
      localStorage.setItem("expenseTrackerData", JSON.stringify(data));
    };
  
    const loadData = () => {
      const savedData = JSON.parse(localStorage.getItem("expenseTrackerData"));
      if (savedData) {
        Object.assign(data, savedData);
      }
      initializeData();
      updateUI();
    };
  
    const populateSelectors = () => {
      for (let i = 0; i < 12; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = new Date(0, i).toLocaleString("default", {
          month: "long",
        });
        monthSelector.appendChild(option);
      }
  
      for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
      }
  
      monthSelector.value = currentMonth;
      yearSelector.value = currentYear;
    };
  
    setIncomeBtn.addEventListener("click", () => {
      const currentData = data[getCurrentPeriodKey()];
      currentData.income = parseFloat(incomeInput.value) || 0;
      currentData.remaining = currentData.income;
      saveData();
      updateUI();
    });
  
    setDateBtn.addEventListener("click", () => {
      const currentData = data[getCurrentPeriodKey()];
      currentData.lastChangedDate = lastChangedInput.value;
      saveData();
      updateUI();
    });
  
    categoryButtons.forEach((button) =>
      button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
      })
    );
  
    addExpenseBtn.addEventListener("click", () => {
      const amount = parseFloat(amountInput.value) || 0;
      if (!selectedCategory || amount <= 0) {
        alert("Select a category and enter a valid amount.");
        return;
      }
  
      const currentData = data[getCurrentPeriodKey()];
      currentData.expenses[selectedCategory] =
        (currentData.expenses[selectedCategory] || 0) + amount;
      currentData.remaining -= amount;
  
      if (currentData.remaining < 0) {
        currentData.debt = Math.abs(currentData.remaining);
      } else {
        currentData.debt = 0;
      }
  
      saveData();
      updateUI();
    });
  
    monthSelector.addEventListener("change", () => {
      initializeData();
      updateUI();
    });
  
    yearSelector.addEventListener("change", () => {
      initializeData();
      updateUI();
    });
  
    populateSelectors();
    loadData();
  });
  