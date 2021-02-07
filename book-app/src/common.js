const LOCAL_STORAGE_KEY = "books";

export class Store {
  static getBooks() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? [];
  }

  static addBook(book) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...Store.getBooks(), book])
    );
  }

  static saveBooks(books = Store.getBooks()) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
  }

  static removeBook(id) {
    const books = Store.getBooks().filter((book) => book.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
  }

  static updateBook(id, updates) {
    const books = Store.getBooks().map((book) => {
      if (book.id === id) {
        const newObj = {
          ...book,
        };
        if (typeof updates.title === "string") {
          newObj.title = updates.title;
        }

        if (typeof updates.author === "string") {
          newObj.author = updates.author;
        }

        if (typeof updates.category === "string") {
          newObj.category = updates.category;
        }

        if (typeof updates.priority === "string") {
          newObj.priority = updates.priority;
        }
        return newObj;
      }
      return book;
    });

    Store.saveBooks(books);
  }
}
