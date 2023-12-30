import axios from "axios";

/* Define baseURL */
// const baseURL = "http://localhost:3000/api/persons";
const baseURL = "/api/persons";

/* Get all */
const getAll = async () => {
  const response = await axios.get(baseURL);
  return response.data;
};

/* Create new */
const createNew = async (personObject) => {
  const response = await axios.post(baseURL, personObject);
  return response.data;
};

/* Delete entry */
const deleteEntry = async (id) => {
  const response = await axios.delete(`${baseURL}/${id}`);
  return response.data;
};

/* Update phonenumber */
const changeNumber = async (id, personObject) => {
  const response = await axios.put(`${baseURL}/${id}`, personObject);
  return response.data;
};

/* Export default */
export default { getAll, createNew, deleteEntry, changeNumber };
