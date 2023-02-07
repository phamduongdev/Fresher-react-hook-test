import axios from './customize-axios';

const fetchAllUser = (page) => {
    return axios.get(`/api/users?page=${page}`);
};
const createUser = (name, job) => {
    return axios.post(`/api/users`, { name, job });
};
const updateUser = (name, job) => {
    return axios.put(`/api/users`, { name, job });
};
export { fetchAllUser, createUser, updateUser };