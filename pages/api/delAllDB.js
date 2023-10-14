import clientPromise from '../../lib/mongodb';

export default async function handler(req, res)
{
    const client = await clientPromise;
    const db = await client.db("calendo-cluster");
    const collection = await db.collection("tasks");

    const resp = await collection.deleteMany({});

    res.status(200).json({ message: 'delete successful' });
}