/* Import dependencies*/
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

/* Import custom mongoose module */
import Person from "./models/person.js";

/* Create express object */
const app = express();

/* Define port */
const PORT = process.env.PORT;

/* Create middleware errorHandler, enable last in script, uses next() */
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id." });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({
      error:
        "Name must be min 3 characters. Number must be format 123-12345 or 12-123456.",
    });
  }
  next(error);
};

/* Enable middleware to convert json */
app.use(express.json());

/* Enable middleware "morgan" for console logging */
morgan.token("body", (request, response) => {
  const body = JSON.stringify(request.body);
  return body;
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/* Enable cors */
app.use(cors());

/* Enable middleware "static"  */
app.use(express.static("frontend/build"));

app.get("/", (req, res) => {
  res.send("moikka");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
