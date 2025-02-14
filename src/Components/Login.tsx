import React, { useEffect,useContext,createContext } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './login.css'
import { getUserData, User } from './fetchapi';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
import { useUser } from './UserContext'; 

interface UserContextType {
    username: string | null;
    setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}
const Login = () => {
    const { setUsername } = useUser();
    const navigate = useNavigate();
    const UserContext = createContext<UserContextType | undefined>(undefined);
    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Username is required')
            .min(3, 'Username must be at least 3 characters'),
        password: Yup.string()
            .required('Password is required')
        //   .min(6, 'Password must be at least 6 characters'),
    });


    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
            onSubmit: async (values) => {
                console.log('Login form values:', values);
                const url = 'http://localhost:3000/auth';
                try {
                    const users = await getUserData(url);
                    console.log(users, "ddsdsdsd");

                    // const user = users
                    const user = users.find((user: User) => 
                        user.username.toLowerCase().trim() === values.username.toLowerCase().trim() && 
                        user.password === values.password
                      );
                    //   console.log(user,"logined")
                   if(user){
                    setUsername(user.username);
                    navigate('/todomain');
                    console.log(user,"logined")
                   }else{
                    console.log("no user found")
                    toast.error("No User Found");
                   }
                } catch (error) {
                    console.log("Error fetching data:", error);
                    toast.error("Error fetching data");
                    
                }
            },
    });

    useEffect(() => {


    }, []);


    return (
        <div className='logincontainer'>
             <ToastContainer />
            <div className='containerlogin shadow-lg'>
                <h2>Login</h2>
                <form onSubmit={formik.handleSubmit} className='form'>
                    {/* Username Field */}
                    <div className='formField'>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            className='input'

                        />
                        {formik.touched.username && formik.errors.username ? (
                            <div className='error'>{formik.errors.username}</div>
                        ) : null}
                    </div>

                    {/* Password Field */}
                    <div className='formField'>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className='input'
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className='error'>{formik.errors.password}</div>
                        ) : null}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className='btn btn-primary' disabled={formik.isSubmitting}>
                        Login
                    </button>
                </form>
            </div>
        </div>

    )



}

export default Login

