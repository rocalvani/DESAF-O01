const socket = io();

// const input = document.getElementById("inputId");
// const log = document.getElementById("log");

// const productTitle = document.getElementById("productTitle");
// const productPrice = document.getElementById("productPrice");
// const productCategory = document.getElementById("productCategory");
// const productComplete = document.getElementById("productComplete");

// input.addEventListener("keyup", (evt) => {
//   if (evt.key === "Enter") {
//     socket.emit("id", input.value);
//     input.value = "";
//   }
// });

// productComplete.addEventListener("click", (e) => {
//   let product = {
//     title: productTitle.value,
//     price: productPrice.value,
//     category: productCategory.value,
//   };
//   socket.emit("product", product);
//   productTitle.value = "";
//   productPrice.value = "";
//   productCategory.value = "";
// });

// socket.on("products", (data) => {
//   log.innerHTML = "";
//   data.forEach((el) => {
//     let article = document.createElement("article");
//     article.innerHTML = `<h3>${el.title}</h3> <p> ${el.price} </p> <p> ${el.category} with id #${el.id}</p>`;
//     log.appendChild(article);
//   });
// });

const chat = document.getElementById("chat");

const send = document.getElementById("send");

const user = document.getElementById("user");
const message = document.getElementById("message");

if(send) {
  send.addEventListener("click", (e) => {
    let msg = {
      user: user.value,
      message: message.value,
    };
    socket.emit("message", msg);
  });
}

socket.on("messages", (data) => {
  chat.innerHTML = "";
  data.forEach((el) => {
    let article = document.createElement("article");
    article.innerHTML = `<b> ${el.user} </b>: ${el.message}`;
    chat.appendChild(article)
  });
});