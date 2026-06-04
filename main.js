const { app } = require("./app");

// port
const PORT = process.env.PORT || 3001;


// listen to server at specified port 
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
