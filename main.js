const { app } = require("./app");

// create port
const PORT = process.env.PORT || 3000;


// listen to server at specified port 
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
