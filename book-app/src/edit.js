import { Store } from "./common";
import { getCategories, renderCategories } from "./index";

let categories = getCategories();
renderCategories();

const title = document.querySelector("#book-edit-title");
const author = document.querySelector("#book-edit-author");
const category = document.querySelector("#book-category");
const priority = document.querySelector("#book-edit-priority");

const bookId = location.hash.substring(1);

const book = Store.getBooks().find((book) => book.id === bookId);

if (!book) {
  location.assign("/index.html");
}

title.value = book.title;
author.value = book.author;
category.value = book.category;
priority.value = book.priority;

const formSubmitHandler = (e) => {
  e.preventDefault();

  Store.updateBook(bookId, {
    title: title.value,
    author: author.value,
    category: category.value,
    priority: priority.value,
  });
};

document
  .querySelector("#book-edit-form")
  .addEventListener("submit", formSubmitHandler);
