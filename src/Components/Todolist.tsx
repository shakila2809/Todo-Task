import React, { ReactEventHandler, useEffect, useState } from 'react'
import "./todolist.css"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import editicon from "../assets/editimage.png"
import deleteicon from "../assets/deleteicon.png"
import addicon from "../assets/addicon.png"
import profile from "../assets/Profile.png"
import icon from "../assets/deleteimage.jpg"
// import delete from "../"
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from './UserContext';
import LogoutButton from './ButtonDesign/logButton';
import { useNavigate } from 'react-router-dom';
interface User {
    id: number;
    name: string;
    email: string;

}

type Addlist = {
    id: number;
    title: string;
    description: string;
    duedate: string;
    status: string;
    assignedUser: string;
    priority: string;
}


// Define the type that accepts both arrays and objects
type TodoState = { [key: string]: any } | any[];
type UserList = { [key: string]: any } | any[];

const Todolist = () => {
    const loginname = localStorage.getItem('username');
    const navigate = useNavigate();
    const { username } = useUser();
    console.log(username, "setUs2eweqwername3");

    const [todolist, setTodolist] = useState<TodoState>([])
    const [userlist, setUserlist] = useState<UserList>([])
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [neededit, setNeededit] = useState()
    const [filterusername, setFilterusername] = useState('')
    const [filterpriority, setFilterpriority] = useState('')
    const [sorttype, setSorttype] = useState('')
    const [addlist, setAddlist] = useState<Addlist>({
        id: 0,
        "title": "",
        "description": "",
        "duedate": "",
        "status": "todo",
        "assignedUser": "",
        "priority": ""
    })
    const todosPerPage = 2;
    const [clickedEdit, setClickedEdit] = useState(false)

    console.log(todolist, "todolist222");

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value, "");
        setAddlist((prevList) => ({
            ...prevList,
            [e.target.name]: e.target.value,
        }));
    }

    const addList = async () => {
        try {


            if (!addlist?.title || !addlist?.description || !addlist?.duedate || !addlist?.assignedUser || !addlist?.priority) {
                toast.error("All fields are required. Please fill in all fields before submitting.");
                return;
            }

            const addlistdata = {
                "id": (todolist.length + 1).toString(),
                "title": addlist?.title,
                "description": addlist?.description,
                "duedate": addlist?.duedate,
                "status": "todo",
                "assignedUser": addlist?.assignedUser,
                "priority": addlist?.priority
            }


            const response = await axios.post('http://localhost:3000/todo', addlistdata);

            // Log the response from the server (you can display a success message)
            console.log('Task added:', response);

            if (response.status === 201) {
                const url = 'http://localhost:3000/todo';
                getUserData(url)
                    .then(user => {
                        console.log(user, "user33")
                        setTodolist(user)
                    })
                    .catch(error => console.error('Error:', error));
            }

            // Optionally, reset the form or take further action after adding
            setAddlist({
                id: 0,
                title: '',
                description: '',
                duedate: '',
                status: 'todo',
                assignedUser: '',
                priority: ''
            });
        } catch (error) {
            // Handle errors (e.g., show an error message
            toast.error("Error adding task");
            console.error('Error adding task:', error);
        }
    }

    const deleteList = async () => {
        const id = neededit
        try {
            const response = await axios.delete(`http://localhost:3000/todo/${id}`);
            console.log(`Todo with id ${id} deleted successfully`, response.data);
            if (response.data) {
                const url = 'http://localhost:3000/todo';
                getUserData(url)
                    .then(user => {
                        console.log(user, "user33")
                        setTodolist(user)
                    })
                    .catch(error => console.error('Error:', error));
            }
        } catch (error) {
            toast.error("Error deleting todo");
            console.error('Error deleting todo:', error);
        }
    }

    const edittododList = async (item: any) => {
        console.log(item, "dsdad");
        setClickedEdit(true)
        setAddlist({
            id: item.id,
            title: item.title,
            description: item.description,
            duedate: item.duedate,
            status: item.status,
            assignedUser: item.assignedUser,
            priority: item.priority,

        });

    }

    const updatedTodolist = async () => {
        try {
            // Send a POST request to the JSON Server

            const id = addlist?.id

            const updatedlist = {
                "id": addlist?.id,
                "title": addlist?.title,
                "description": addlist?.description,
                "duedate": addlist?.duedate,
                "status": "todo",
                "assignedUser": addlist?.assignedUser,
                "priority": addlist?.priority
            }


            const response = await axios.patch(`http://localhost:3000/todo/${id}`, updatedlist);

            // Log the response from the server (you can display a success message)
            console.log('Task updated:', response);

            if (response.status === 200) {
                const url = 'http://localhost:3000/todo';
                getUserData(url)
                    .then(user => {
                        console.log(user, "user33")
                        setTodolist(user)
                    })
                    .catch(error => console.error('Error:', error));
            }

            // Optionally, reset the form or take further action after adding
            setAddlist({
                id: 0,
                title: '',
                description: '',
                duedate: '',
                status: 'todo',
                assignedUser: '',
                priority: ''
            });
        } catch (error) {
            // Handle errors (e.g., show an error message
            toast.error("Error Updating task");
            console.error('Error adding task:', error);
        }
    }

    const filterbyid = async (e: React.ChangeEvent<HTMLSelectElement>, data: string) => {
        console.log(e.target.value, data, "sdasdsd");

        const userId = e.target.value
        if (data === "filterbyuser") {
            setFilterusername(e.target.value)
        } else {
            setFilterpriority(e.target.value)
        }
        const urluser = `http://localhost:3000/todo?assignedUser=${userId}`
        const urlprio = `http://localhost:3000/todo?userId=${filterusername}&priority=${userId}`
        try {

            const response = await axios.get(data === "filterbyuser" ? urluser : urlprio);
            console.log('Filtered Todos by UserId:', response.data);
            setTodolist(response.data)
        } catch (error) {
            console.error('Error fetching todos by userId:', error);
        }
    }

    async function getUserData(url: string): Promise<User> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: User = await response.json();
        return data;
    }

    const defaultfun = () => {
        const url = `http://localhost:3000/todo`;
        getUserData(url)
            .then(user => {
                console.log(user, "user33")
                setTodolist(user)
            })
            .catch(error => console.error('Error:', error));
        setFilterusername('')
        setFilterpriority('')
        setSorttype('')
    }

    const sortbydata = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value, todolist, "dasdsd");
        setSorttype(e.target.value)
        const upsort = todolist
        if (e.target.value === "sort by duedate") {

            const sortedTasks = upsort.sort((a: any, b: any) => {
                // Convert the duedate string to Date objects
                const dateA = new Date(a.duedate);
                const dateB = new Date(b.duedate);
                // Logging for debugging
                console.log("DateA:", dateA, "Time:", dateA.getTime());
                console.log("DateB:", dateB, "Time:", dateB.getTime());
                // Sorting based on milliseconds from Unix epoch (earliest to latest)
                return dateA.getTime() - dateB.getTime();
            });
            console.log(sortedTasks, "sortedTasks222");
            setTodolist(sortedTasks)
        }
        if (e.target.value === "sort by priority") {
            const priorityRank: Record<string, number> = {
                high: 1,
                medium: 2,
                low: 3
            };

            // Sorting tasks by priority
            const sortedByPriority = upsort.sort((a: any, b: any) => {
                const priorityA = priorityRank[a.priority.toLowerCase()];
                const priorityB = priorityRank[b.priority.toLowerCase()];

                // Sorting by priority (higher priority first)
                return priorityA - priorityB;
            });
        }
    }


    useEffect(() => {

        defaultfun()

        const url2 = 'http://localhost:3000/users';
        getUserData(url2)
            .then(user => {
                console.log(user, "sampleuser")
                setUserlist(user)
            })
            .catch(error => console.error('Error:', error));


    }, []);




    return (
        <div className='d-flex flex-column justify-content-center align-items-center '>
            <ToastContainer />
            <div className='d-flex justify-content-end  align-items-end flex-column w-100'>


                <div className='me-5'>
                    
                    <div className='d-flex justify-content-center username'>

                        {username || loginname}
                    </div>
                    <div className='w-100 d-flex justify-content-center mt-3' ><LogoutButton /></div>
                </div>



            </div>
            <h1 className='mt-4 text-white todohead '>Todo List</h1>
            <div className="card m-2 w-75">
                <div className="card-body">
                    <div className='d-flex justify-content-between'>
                        <div className='cardhead'>
                            {clickedEdit ? "Edit Card" : "Add Card"}
                        </div>
                        <div>

                            {clickedEdit ?
                                <>
                                    <span>Add List</span>
                                    <button className='btn' onClick={() => {
                                        setClickedEdit(false); setAddlist({
                                            id: 0,
                                            title: '',
                                            description: '',
                                            duedate: '',
                                            status: 'todo',
                                            assignedUser: '',
                                            priority: ''
                                        });
                                    }} ><img src={addicon} width={30} alt="" /></button> </> : <></>}</div>

                    </div>

                    <div className='d-flex justify-content-center flex-column'>
                        <div className='d-flex'>
                            <div className='d-flex formdiv m-2'>
                                <label> Title </label> <input type="text" className="form-control" value={addlist.title} name="title" id="staticEmail" placeholder="Enter Title" onChange={handleChange} /></div>
                            <div className='d-flex formdiv m-2'>
                                <label> Description </label> <input type="text" name="description" value={addlist.description} className="form-control" id="staticEmail" placeholder="Enter Descriptipn" onChange={handleChange} /></div>
                        </div>
                        <div className='d-flex'>
                            <div className='d-flex formdiv m-2'><label> Due Date </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="duedate"
                                    className="form-control"
                                    value={addlist.duedate}
                                    onChange={handleChange}
                                    placeholder="Enter Due Date"
                                />
                              
                            </div>

                            <div className='d-flex formdiv m-2'>
                                <label> Assign User </label> <select name="assignedUser" value={addlist.assignedUser} className="form-select" aria-label="Default select example" onChange={handleChange}>
                                    <option selected>Open this select user</option>
                                    {userlist.map((item: any, index: number) => {
                                        return (
                                            <option value={item?.id} key={index}>{item?.name}</option>
                                        )
                                    })}

                                </select>
                            </div>
                        </div>
                        <div>
                            <div className='d-flex formdiv m-2'>
                                <label> Priority </label> <select name="priority" value={addlist.priority} className="form-select" aria-label="Default select example" onChange={handleChange}>
                                    <option selected>Open this select priority</option>
                                    <option value={'high'}>Heigh</option>
                                    <option value={'medium'}>Medium</option>
                                    <option value={'low'}>Low</option>
                                </select>
                            </div>
                        </div>


                        {clickedEdit ?
                            <div className='addupbutton'>
                                <button className='btn btn-primary w-25' onClick={updatedTodolist}>Updated</button>
                            </div>
                            :
                            <div className='addupbutton'>
                                <button className='btn btn-primary w-25' onClick={addList}>Add</button>
                            </div>
                        }

                    </div>
                </div>
            </div>
            <div className="card m-2 w-75">
                <div className="card-body">
                    <div className='d-flex justify-content-end'>
                        <div className='ms-2'>
                            <div>Filter by Assign User</div>
                            <select name="assignedUser" value={filterusername} className="form-select" aria-label="Default select example" onChange={(e) => { filterbyid(e, 'filterbyuser') }} >
                                <option selected>Open this select user</option>
                                {userlist.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='ms-2'>
                            <div>Filter by Priority</div>
                            <select name="assignedUser" value={filterpriority} className="form-select" aria-label="Default select example" onChange={(e) => { filterbyid(e, 'filterbypriority') }} >
                                <option selected>Open this select Priority</option>
                                <option value={'high'}>Heigh</option>
                                <option value={'medium'}>Medium</option>
                                <option value={'low'}>Low</option>
                            </select>
                        </div>

                        <div className='ms-2'>
                            <div>Sort</div>
                            <select name="sorttype" value={sorttype} className="form-select" aria-label="Default select example" onChange={(e) => { sortbydata(e) }} >
                                <option selected>Select sort type</option>
                                <option value={'sort by duedate'}>Sort by Due Date</option>
                                <option value={'sort by priority'}>Sort by Priority</option>
                            </select>
                        </div>
                        <div><button className='btn btn-primary ms-5' data-bs-dismiss="modal" onClick={defaultfun}>Clear filter</button></div>
                    </div>

                </div>
            </div>

            <div className='w-100'>

                {todolist?.map((item: any) => {
                    const assignedUsername = userlist.find((user: any) => user.id == item.assignedUser);

                    return (
                        <>
                            <div className='todolist'>
                                <div className="card m-2 w-75">
                                    <div className="card-body">

                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className='w-100'>
                                                <div className='d-flex flex-column justify-content-between'>
                                                    <div className='todotitle'>{item?.title}</div>


                                                    <div>{item?.description}</div>

                                                </div>



                                            </div>
                                            <div className='d-flex'>
                                                <button className='btn ms-5' onClick={() => { edittododList(item) }}><img src={editicon} width={30} alt="" /></button>
                                                <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setNeededit(item?.id) }}>
                                                    <img src={deleteicon} width={30} alt="" />
                                                </button>

                                                {/*  */}
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between'>

                                            <div className='dudate'>Due Date: {item?.duedate}</div>
                                            <div className='d-flex'>

                                                <div className='me-2'>
                                                    {assignedUsername ? (
                                                        <p><strong>Assigned to:</strong> {assignedUsername.name}</p>
                                                    ) : (
                                                        <p><strong>Assigned to:</strong> Not assigned</p>
                                                    )}
                                                </div>
                                                <div>{item.priority === "high" ? <span className="badge bg-danger">High</span> : item.priority === "low" ? <span className="badge bg-info text-dark">Low</span> : item.priority === "medium" ? <span className="badge bg-warning text-dark">Medium</span> : <></>}</div>
                                                
                                                </div>
                                        </div>

                                    </div>
                                </div>
                            </div>


                        </>
                    )
                })}</div>

            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-body">

                            <div className='d-flex justify-content-between'>
                                <div className='w-100 d-flex justify-content-center'><img src={icon} width={70} alt="" /></div>

                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className='d-flex flex-column justify-content-center align-items-center' >
                                <div className='w-100 d-flex justify-content-center align-items-center'>Do you want to Delete the todo list</div>

                                <button className='btn btn-primary w-50 mt-3' onClick={() => { deleteList() }} data-bs-dismiss="modal">Delete</button>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Todolist