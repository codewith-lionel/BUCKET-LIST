// Load existing bucket list from localStorage or start with empty array
let bucketList = localStorage.getItem("listvalue")
  ? JSON.parse(localStorage.getItem("listvalue"))
  : [];

var completedCount = 0;
let filterValue = "All";

function addItem() {
  const itemInput = document.getElementById("item-input").value;
  const itemCategory = document.getElementById("item-category").value;
  const itemDate = document.getElementById("item-date").value;

  if (itemInput && itemCategory && itemDate) {
    bucketList.push({ itemInput, itemCategory, itemDate, completed: false });
    localStorage.setItem("listvalue", JSON.stringify(bucketList));
    cleardesc();
    displayUI();
  }
}

// clear description
function cleardesc() {
  document.getElementById("item-input").value = "";
  document.getElementById("item-category").value = "";
  document.getElementById("item-date").value = "";
}

// display ui
function displayUI() {
  const bucketListContainer = document.getElementById("item-list");
  bucketListContainer.innerHTML = "";

  // Filter logic
  let filteredList =
    filterValue === "All"
      ? bucketList
      : bucketList.filter((item) => item.itemCategory === filterValue);

  document.getElementById("total-count").innerText = filteredList.length;
  completedCount = filteredList.filter((item) => item.completed).length;
  document.getElementById("completed-count").innerText = completedCount;

  filteredList.forEach((item, index) => {
    const itemElement = document.createElement("li");
    itemElement.classList.add(
      "p-4",
      "mb-2",
      "rounded",
      "shadow",
      "flex",
      "justify-between",
      "items-center",
      "w-full",
      item.completed ? "bg-gray-200" : "bg-white"
    );

    itemElement.innerHTML =
      "<div>" +
      '<p class="font-bold ' +
      (item.completed ? "line-through text-gray-500" : "") +
      '">' +
      item.itemInput +
      "</p>" +
      '<p class="text-sm text-gray-600">' +
      item.itemCategory +
      " | " +
      item.itemDate +
      "</p>" +
      "</div>" +
      '<div class="flex gap-2">' +
      '<button class="bg-green-500 text-white px-2 py-1 rounded" onclick="markCompleted(' +
      index +
      ')">' +
      (item.completed ? "Completed" : "Pending") +
      "</button>" +
      '<button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteItem(' +
      index +
      ')">Delete</button>' +
      "</div>";
      //reset button functionality
    const resetButton = document.getElementById("reset-button");
    resetButton.onclick = function() {
    
      localStorage.clear();
      bucketList = [];
      displayUI();
    }

    bucketListContainer.appendChild(itemElement);
  });

  // Progress bar width update
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    let percent =
      filteredList.length === 0
        ? 0
        : (completedCount / filteredList.length) * 100;
    progressBar.style.width = percent + "%";
  }
}
// Filter handler
function setFilter(category) {
  filterValue = category;
  displayUI();
}

// delete item
function deleteItem(index) {
  bucketList.splice(index, 1);
  localStorage.setItem("listvalue", JSON.stringify(bucketList));
  displayUI();
}

// mark complete / toggle status
function markCompleted(index) {
  bucketList[index].completed = !bucketList[index].completed;
  localStorage.setItem("listvalue", JSON.stringify(bucketList));
  displayUI();
}

// Add event listeners for filter radio buttons after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const filterRadios = document.querySelectorAll(
    "input[name='filter-category']"
  );
  filterRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      setFilter(this.value);
    });
  });
  displayUI();
});
