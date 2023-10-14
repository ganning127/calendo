import clientPromise from '../../lib/mongodb';
import { ObjectId } from "mongodb";

export default async function handler(req, res)
{
    try
    {
        const client = await clientPromise;
        const db = await client.db("calendo-cluster");
        const collection = await db.collection("tasks");

        let useReq = JSON.parse(req.body);
        const filter = { _id: new ObjectId(useReq._id) };
        const updateDocument = {
            $set: {
                completed: useReq.completed,
            },
        };

        console.log(useReq.completed);

        const resp = await collection.updateOne(filter, updateDocument);

    } catch (e)
    {
        console.log(e);
        res.status(500).json({ success: false });
    }

    res.status(200).json({ success: true });
}