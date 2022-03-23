import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import Joi from "joi";

const firebaseConfig = {
    apiKey: process.env.firebase_apiKey,
    authDomain: process.env.firebase_authDomain,
    projectId: process.env.firebase_projectId,
    storageBucket: process.env.firebase_storageBucket,
    messagingSenderId: process.env.firebase_messagingSenderId,
    appId: process.env.firebase_appId,
    measurementId: process.env.firebase_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function post (req, res) {
    const data = req.body

    const test_schema = Joi.object({
        email: Joi.string().email({tlds: {allow: false}}).required(),
        password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).required()
    })

    const result = test_schema.validate(data);

    if (result.error) return res.status(400).send("Invalid data")

    let creds
    try {
        creds = await signInWithEmailAndPassword(auth, data.email, data.password)
    } catch (error) {
        console.log(error.code);
        let reason = "Something went wrong with the login process :("
        let code = 0
        if (error.code == "auth/user-not-found") {
            reason = "User not found, please register"
            code = 0
        } else if (error.code == "auth/wrong-password") {
            reason = "Wrong password, please try again"
            code = 1
        }
        return res.status(400).send({ reason, code })
    }

    return res.status(200).send({ user: creds.user })
}