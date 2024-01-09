const express = require("express");
const app = express();
const axios = require("axios").create({baseUrl: "https://jsonplaceholder.typicode.com/"});

app.listen(2400, () => {
	console.log("Server started at port 2400");
});