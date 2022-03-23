import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { MongoClient } from "mongodb";
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
        profession: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().email({tlds: {allow: false}}).required(),
        password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).required()
    })

    const result = test_schema.validate(data);

    if (result.error) return res.status(400).send("Invalid data")

    let creds
    try {
        creds = await createUserWithEmailAndPassword(auth, data.email, data.password)
    } catch (error) {
        let reason = "Something went wrong with the registration process :("
        let code = 0
        if (error.code == "auth/email-already-in-use") {
            reason = "Email already in use, try something else"
            code = 1
        }
        return res.status(400).send({ reason, code })
    }

    try {
        const client = MongoClient.connect(process.env.mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db("users")
        const collection = db.collection(data.profession)
        await collection.insertOne({
            _id: creds.user.uid,
            name: data.name,
            email: data.email
        })
    } catch (error) {
        return res.status(500).send({reason: "Something went wrong with the registration process :(", code: 0});
    }

    return res.status(200).send({ user: creds.user })
}