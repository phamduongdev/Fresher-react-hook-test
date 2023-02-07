import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import ModalAddNewUser from './ModalAddNewUser';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';

function TableUsers(props) {
    const [listUsers, setListUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const handleCloseModalCreate = () => {
        setShowModalCreate(false);
    };
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const handleCloseModalUpdate = () => {
        setShowModalUpdate(false);
    };
    const [showModalDelete, setShowModalDelete] = useState(false);
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
        setListUsers([...listUsers], user);
    };

    return (
        <>
            <div className='my-3 add-new'>
                <span><strong>List Users:</strong></span>
                <button className='btn btn-info' onClick={() => setShowModalCreate(true)}>Add new User</button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>First Name</th>
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
                                        <button className='btn btn-warning'>Edit</button>
                                        <button className='btn btn-danger'>Delete</button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
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
        </>
    );
}

export default TableUsers;