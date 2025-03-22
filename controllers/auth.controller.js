import {generateToken} from '../middlewares/auth.js';
import {createUserService, verifyUserService} from  '../services/auth.service.js';


export const registerUser = async (req, res, next) => {
    try{
        const data = req.body;

        //create a new user
        const newUser  = await createUserService(data);

        //extracting id and username for generating token
        const userData = {
            id: data.id, 
            username: data.username
        }

        //generate a token
        const token = generateToken(userData);


        res.status(201).json({message: 'Registration was successful', user: newUser, token});
    }
    catch(err)
    {
        next(err);
    }
}

export const loginUser = async (req,res,next) => {
    try{

        const data = req.body;

        const verifiedUser = await verifyUserService(data);

        const userData = {
            id: verifiedUser.id, 
            username: verifiedUser.username
        }

        const token = generateToken(userData);

        res.status(200).json({message: 'Login Successful!', token});
    }
    catch(err){
        next(err);
    }
};

