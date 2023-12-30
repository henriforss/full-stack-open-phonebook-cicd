/* eslint-disable react/prop-types */
/* Import */
import { useEffect, useState } from "react";
import numberService from "./services/numberServices";
import "./App.css";

/* Notification */
const Notification = (props) => {
  if (props.message === null) {
    return null;
  } else {
    return <div className={props.style}>{props.message}</div>;
  }
};

/* Filter */
const FilterForm = (props) => {
  return (
    <form>
      <div>
        filter with:{" "}
        <input value={props.filter} onChange={props.filterchange} />
      </div>
    </form>
  );
};

/* Add person */
const AddPersonForm = (props) => {
  return (
    <form onSubmit={props.add}>
      <div>
        name: <input value={props.name} onChange={props.namechange} />
      </div>
      <div>
        number: <input value={props.number} onChange={props.numberchange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

/* Show phonebook */
const ShowPhonebook = (props) => {
  return (
    <div>
      {props.persons.map((person) => (
        <ShowNameNumber
          id={person.id}
          key={person.name}
          name={person.name}
          number={person.number}
          deletePerson={props.deletePerson}
        />
      ))}
    </div>
  );
};

/* Show name and number */
const ShowNameNumber = (props) => {
  return (
    <div>
      {props.name} {props.number}{" "}
      <button onClick={() => props.deletePerson(props.id)}>Delete</button>
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterWith, setFilterWith] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationStyle, setNotificationStyle] = useState(null);

  /* Init */
  useEffect(() => {
    numberService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  /* Add person */
  const addPerson = async (event) => {
    event.preventDefault();
    const found = persons.filter((person) => person.name === newName);
    if (found.length === 0) {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      try {
        const addedPerson = await numberService.createNew(personObject);
        setPersons(persons.concat(addedPerson));
        setNewName("");
        setNewNumber("");
        setNotificationStyle("succes");
        setNotificationMessage(`${newName} added succesfully!`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      } catch (error) {
        console.log(error.response.data);
        setNotificationStyle("error");
        setNotificationMessage(`${error.response.data.error}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      }
    } else {
      if (
        window.confirm(`${newName} is already added to phonebook,
        replace the old number with a new one?`) === true
      ) {
        const updatePerson = persons.find((person) => person.name === newName);
        const oldNumber = updatePerson.number;
        console.log(oldNumber);
        updatePerson.number = newNumber;
        console.log(oldNumber);

        try {
          const response = await numberService.changeNumber(
            updatePerson.id,
            updatePerson
          );
          console.log(response);
          setNotificationStyle("succes");
          setNotificationMessage(`${newName} number changed!`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
          setNewName("");
          setNewNumber("");
        } catch (error) {
          console.log(error);
          updatePerson.number = oldNumber;
          setNotificationStyle("error");
          setNotificationMessage(
            `Number must be format 12-123456 or 123-12345.`
          );
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        }
      }
    }
  };

  /* Event handler */
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  /* Event handler */
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  /* Event handler */
  const handleFilterWith = (event) => {
    setFilterWith(event.target.value);
  };

  /* Filter persons */
  const filterPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterWith)
  );

  /* Delete person */
  const deletePersonId = async (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`) === true) {
      const response = await numberService.deleteEntry(id);
      console.log(response);
      setNotificationStyle("succes");
      setNotificationMessage(`${person.name} deleted!`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
      setPersons(persons.filter((person) => person.id !== id));
    } else {
      console.log("canceled");
    }
  };

  return (
    <div className="App">
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} style={notificationStyle} />
      <FilterForm filter={filterWith} filterchange={handleFilterWith} />
      <h2>add new number</h2>
      <AddPersonForm
        add={addPerson}
        name={newName}
        namechange={handleNameChange}
        number={newNumber}
        numberchange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <ShowPhonebook persons={filterPersons} deletePerson={deletePersonId} />
    </div>
  );
};

export default App;
