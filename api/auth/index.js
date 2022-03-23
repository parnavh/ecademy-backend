
/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export function get (req, res) {
    return res.status(200).send('hi')
}