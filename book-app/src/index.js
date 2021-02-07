import { v4 as uuidv4 } from "uuid";
import { Store } from "./common";

class Book {
  constructor(title, author, category, priority) {
    this.id = uuidv4();
    this.title = title;
    this.author = author;
    this.category = category;
    this.priority = priority;
  }
}

class UI {
  static displayBooks(books) {
    const counter = document.querySelector("#counter");
    document.querySelector("#book-list").innerHTML = "";

    books.forEach((book) => {
      UI.addBookToList(book);
    });
    counter.innerHTML = `${books.length}`;
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.category}</td>
        <td>${book.priority}</td>
        <td><a href="./edit.html#${book.id}" class="btn btn-sm btn-secondary edit">Edytuj</a></td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

    row
      .querySelector(".delete")
      .addEventListener("click", createDeleteBookHandler(row, book.id));
    list.appendChild(row);
  }

  static showAlert(message, className) {
    const div = document.createElement("div");

    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");

    container.insertBefore(div, form);

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static deleteBook(el) {
    if (el instanceof HTMLTableRowElement) {
      el.remove();
    }
  }

  static clearFields() {
    document.querySelector("#book-form").reset();
  }
}

const sortBooks = (sortBy) => {
  const books = Store.getBooks();
  if (sortBy === "byCategory") {
    return books.sort((a, b) => {
      if (a.category.toLowerCase() < b.category.toLowerCase()) {
        return -1;
      } else if (a.category.toLowerCase() > b.category.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortBy === "byAuthor") {
    return books.sort((a, b) => {
      if (a.author.toLowerCase() < b.author.toLowerCase()) {
        return -1;
      } else if (a.author.toLowerCase() > b.author.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortBy === "byPriority") {
    return books.sort((a, b) => {
      if (a.priority > b.priority) {
        return -1;
      } else if (a.priority < b.priority) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  return books;
};

const filterBooks = (filters) => {
  const filteredBooks = Store.getBooks().filter((book) => {
    if (typeof filters.author === "string") {
      return book.author.toLowerCase().includes(filters.author.toLowerCase());
    }

    if (typeof filters.category === "string") {
      return book.category
        .toLowerCase()
        .includes(filters.category.toLowerCase());
    }

    if (typeof filters.priority === "string") {
      return book.priority
        .toLowerCase()
        .includes(filters.priority.toLowerCase());
    }
  });
  if (filteredBooks.length > 0) {
    UI.displayBooks(filteredBooks);
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  const title = document.querySelector("#book-title").value;
  const author = document.querySelector("#book-author").value;
  const category = document.querySelector("#book-category").value;
  const priority = document.querySelector("#book-priority").value;

  if (!title || !author || !category || !priority) {
    UI.showAlert("Uzupełnij wszystkie pola", "danger");
    return;
  }

  const book = new Book(title, author, category, priority);
  UI.addBookToList(book);
  Store.addBook(book);
  UI.showAlert("Dodano książkę", "success");
  UI.clearFields();
};

const createDeleteBookHandler = (row, id) => () => {
  UI.deleteBook(row);
  Store.removeBook(id);
  UI.showAlert("Usunięto książkę", "success");
};

const handleBookSort = (e) => {
  e.preventDefault();

  const sortBy = document.querySelector("#sort-by").value;
  const sortedBooks = sortBooks(sortBy);

  UI.displayBooks(sortedBooks);
};

const handleBookFilter = () => {
  const author = document.querySelector("#filter-author").value;
  const category = document.querySelector("#filter-category").value;
  const priority = document.querySelector("#filter-priority").value;

  filterBooks({ author, category, priority });
};

const renderCategories = () => {
  const categoryList = document.querySelector("#book-category");
  categoryList.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Wybierz kategorię";
  categoryList.appendChild(defaultOption);
  categories.forEach((category) => {
    const optionEl = document.createElement("option");

    optionEl.textContent = `${category}`;
    optionEl.value = `${category}`;

    categoryList.appendChild(optionEl);
  });
};

const saveCategories = () =>
  localStorage.setItem("categories", JSON.stringify(categories));

const getCategories = () => {
  const categoriesJSON = localStorage.getItem("categories");

  try {
    return categoriesJSON
      ? JSON.parse(categoriesJSON)
      : ["Kryminał", "Sci-fi", "Fantasy", "Poezja", "Dramat", "Nauki-ścisłe"];
  } catch (error) {
    return [
      "Kryminał",
      "Sci-fi",
      "Fantasy",
      "Poezja",
      "Dramat",
      "Nauki-ścisłe",
    ];
  }
};

let categories = getCategories();

renderCategories();

const handleAddCategory = (e) => {
  e.preventDefault();
  const addCategory = document.querySelector("#add-book-category").value;
  if (addCategory) {
    categories.push(addCategory);
    saveCategories();
    categories = getCategories();
  }

  renderCategories();
};

document.addEventListener("DOMContentLoaded", () => {
  UI.displayBooks(Store.getBooks());
  document
    .querySelector("#book-form")
    .addEventListener("submit", handleFormSubmit);

  document
    .querySelector("#sort-books")
    .addEventListener("submit", handleBookSort);

  document
    .querySelector("#filter-books")
    .addEventListener("input", handleBookFilter);

  document
    .querySelector("#add-category")
    .addEventListener("submit", handleAddCategory);

  window.addEventListener("storage", (e) => {
    if (e.key === "books") {
      UI.displayBooks(books);
    }
  });
});

export { renderCategories, getCategories };
