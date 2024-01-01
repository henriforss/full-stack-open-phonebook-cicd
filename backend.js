/* Import dependencies */
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

/* Import custom mongoose module */
import Person from "./models/person.js";

/* Create express object */
const app = express();

/* Define port */
const PORT = 3000;

/* Create middleware errorHandler, enable last in script, uses next() */
const errorHandler = (error, _request, response, next) => {
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
morgan.token("body", (request, _response) => {
  const body = JSON.stringify(request.body);
  return body;
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/* Enable cors */
app.use(cors());

/* Enable middleware "static"  */
app.use(express.static("frontend/dist"));

/* Health check */
app.get("/health", (_request, response) => {
  response.send("ok");
});

/* Get all persons */
app.get("/api/persons", async (_request, response) => {
  const persons = await Person.find({});
  response.json(persons);
});

/* Get info  */
app.get("/info", async (_request, response) => {
  const number = await Person.countDocuments({});
  const date = new Date();

  response.send(`Phone has info on ${number} persons. <br /> ${date}`);
  console.log(number);
});

/* Get person by id */
app.get("/api/persons/:id", async (request, response, next) => {
  try {
    const foundPerson = await Person.findById(request.params.id);
    if (foundPerson) {
      response.json(foundPerson);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

/* Delete person by id */
app.delete("/api/persons/:id", async (request, response, next) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(request.params.id);

    if (deletedPerson) {
      response.status(204).end();
    } else {
      console.log("No such id.");
    }
  } catch (error) {
    next(error);
  }
});

/* Add new person */
app.post("/api/persons", async (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "No name." });
  }

  if (!body.number) {
    return response.status(400).json({ error: "No number." });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  try {
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

/* Update person name or number. */
app.put("/api/persons/:id", async (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      person,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

/* Enable errorHandler, must always be last */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
