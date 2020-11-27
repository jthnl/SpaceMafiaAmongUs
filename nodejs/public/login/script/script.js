
console.log("Test LOGIN");

const postData = {
    username: "JEFFREY",
    password: "abc123"
}


axios.post('http://localhost:3000/login/auth', postData);

console.log("DONE");