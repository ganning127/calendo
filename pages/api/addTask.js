import clientPromise from '../../lib/mongodb';

export default async function handler(req, res)
{
    try
    {
        const client = await clientPromise;
        const db = await client.db("calendo-cluster");
        const collection = await db.collection("tasks");

        let useReq = JSON.parse(req.body);

        let task = {
            name: useReq.name,
            due: useReq.due, // should be new Date()
            created_by: useReq.created_by,
            owner: useReq.owner, // this would be a UUID that matches w/clerk
            completed: useReq.completed, // true/false
            category: useReq.category,
            priority: useReq.priority // 1 is the highest
        };

        const resp = await collection.insertOne(task);

    } catch (e)
    {
        res.status(500).json({ success: false });
    }

    res.status(200).json({ success: true });
}