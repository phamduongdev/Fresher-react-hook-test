import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import ModalAddNewUser from './ModalAddNewUser';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalUpdateUser from './ModalUpdateUser';
import _, { debounce } from 'lodash';
import ModalDeleteUser from './ModalDeleteUser';
import { CSVLink } from "react-csv";
import Papa from 'papaparse';
import './TableUsers.scss';
import { toast } from 'react-toastify';

function TableUsers(props) {
    const [listUsers, setListUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState('asc');
    const [sortField, setSortField] = useState('id');
    const [keyWord, setKeyWord] = useState('');
    const [dataExport, setDataExport] = useState([]);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const handleCloseModalCreate = () => {
        setShowModalCreate(false);
    };
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [dataUserUpdate, setDataUserUpdate] = useState({});
    const handleCloseModalUpdate = () => {
        setShowModalUpdate(false);
    };
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState({});
    const handleCloseModalDelete = () => {
        setShowModalDelete(false);
    };

    useEffect(() => {
        getDataUsers(1);
    }, []);

    const getDataUsers = async (page) => {
        let res = await fetchAllUser(page);
        if (res && res.data && res.data) {
            setListUsers(res.data);
            setTotalUsers(res.total);
            setTotalPages(res.total_pages);
        }
    };

    const handlePageClick = (event) => {
        getDataUsers(+event.selected + 1);
    };

    const handleUpdateTable = (user) => {
        setListUsers([user, ...listUsers]);
    };

    const handleUpdateUserModal = (user) => {
        let index = listUsers.findIndex(item => item.id === user.id);
        let copiedListUsers = _.cloneDeep(listUsers);
        copiedListUsers[index].first_name = user.first_name;
        setListUsers(copiedListUsers);
    };

    const handleDeleteUserModal = (user) => {
        let copiedListUsers = _.cloneDeep(listUsers);
        copiedListUsers = copiedListUsers.filter(item => item.id !== user.id);
        setListUsers(copiedListUsers);
    };

    const handleUpdateUser = (user) => {
        setDataUserUpdate(user);
        setShowModalUpdate(true);
    };

    const handleDeleteUser = (user) => {
        setDataUserDelete(user);
        setShowModalDelete(true);
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);
        let copiedListUsers = _.cloneDeep(listUsers);
        copiedListUsers = _.orderBy(copiedListUsers, [sortField], [sortBy]);
        setListUsers(copiedListUsers);
    };

    const handleSearch = debounce((event) => {
        let term = event.target.value;
        if (term) {
            let copiedListUsers = _.cloneDeep(listUsers);
            copiedListUsers = copiedListUsers.filter(item => item.email.includes(term));
            setListUsers(copiedListUsers);
        } else {
            getDataUsers(1);
        }
    }, 500);

    const getUsersExport = (event, done) => {
        let result = [];
        if (listUsers && listUsers.length > 0) {
            result.push(['Id', 'Email', 'First name', 'Last name']);
            listUsers.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.email;
                arr[2] = item.first_name;
                arr[3] = item.last_name;
                result.push(arr);
            });
            setDataExport(result);
            done();
        }
    };

    const handleImportCSV = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            if (file.type !== 'text/csv') {
                toast.error('.csv files only!');
                return;
            }
            Papa.parse(file, {
                // header: true,
                complete: function (results) {
                    let rawCSV = results.data;
                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 3) {
                            if (rawCSV[0][0] !== 'email' || rawCSV[0][1] !== 'first_name' || rawCSV[0][2] !== 'last_name') {
                                toast.error('Wrong format Header CSV file!');
                            } else {
                                let result = [];
                                rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 3) {
                                        let obj = {};
                                        obj.email = item[0];
                                        obj.first_name = item[1];
                                        obj.last_name = item[2];
                                        result.push(obj);
                                    }
                                });
                                setListUsers(result);
                            }
                        } else {
                            toast.error('Wrong format CSV file!');
                        }
                    } else {
                        toast.error('Not found data on CSV file!');
                    }
                }
            });
        }
    };

    return (
        <>
            <div className='my-3 add-new d-sm-flex'>
                <span><strong>List Users:</strong></span>
                <div className='group-btns mt-sm-0 mt-2'>
                    <label className='btn btn-warning' htmlFor='import'>
                        <i className='fa-solid fa-file-arrow-up'></i> Import
                    </label>
                    <input id='import' type={'file'} hidden onChange={(event) => handleImportCSV(event)} />
                    <CSVLink data={dataExport} asyncOnClick onClick={getUsersExport} filename={"users.csv"} className="btn btn-primary"><i className='fa-solid fa-file-arrow-down'></i> Export</CSVLink>
                    <button className='btn btn-info' onClick={() => setShowModalCreate(true)}>
                        <i className='fa-solid fa-circle-plus'></i> Add new
                    </button>
                </div>
            </div>
            <div className='form-group my-3 col-12 col-sm-4'>
                <input className='form-control' placeholder='Search user by email...' onChange={(event) => handleSearch(event)} />
            </div>
            <div className='customize-table'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <div className='sort-header'>
                                    <span>ID</span>
                                    <span>
                                        <i className="fa-solid fa-arrow-down-long" onClick={() => handleSort('desc', 'id')}></i>
                                        <i className="fa-solid fa-arrow-up-long" onClick={() => handleSort('asc', 'id')}></i>
                                    </span>
                                </div>
                            </th>
                            <th>Email</th>
                            <th>
                                <div className='sort-header'>
                                    <span>First Name</span>
                                    <span>
                                        <i className="fa-solid fa-arrow-down-long" onClick={() => handleSort('desc', 'first_name')}></i>
                                        <i className="fa-solid fa-arrow-up-long" onClick={() => handleSort('asc', 'first_name')}></i>
                                    </span>
                                </div>
                            </th>
                            <th>Last Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUsers && listUsers.length > 0 &&
                            listUsers.map((item, index) => {
                                return (
                                    <tr key={`user-${index}`}>
                                        <td>{item.id}</td>
                                        <td>{item.email}</td>
                                        <td>{item.first_name}</td>
                                        <td>{item.last_name}</td>
                                        <td>
                                            <button className='btn btn-warning mx-3' onClick={() => handleUpdateUser(item)}>Edit</button>
                                            <button className='btn btn-danger' onClick={() => handleDeleteUser(item)}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName='page-item'
                pageLinkClassName='page-link'
                previousClassName='page-item'
                previousLinkClassName='page-link'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName='pagination'
                activeClassName='active'
                renderOnZeroPageCount={null}
            />
            <ModalAddNewUser show={showModalCreate} handleClose={handleCloseModalCreate} handleUpdateTable={handleUpdateTable} />
            <ModalUpdateUser show={showModalUpdate} handleClose={handleCloseModalUpdate} dataUserUpdate={dataUserUpdate} handleUpdateUserModal={handleUpdateUserModal} />
            <ModalDeleteUser show={showModalDelete} handleClose={handleCloseModalDelete} dataUserDelete={dataUserDelete} handleDeleteUserModal={handleDeleteUserModal} />
        </>
    );
}

export default TableUsers;