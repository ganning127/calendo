import clientPromise from '../../lib/mongodb';
import { ObjectId } from "mongodb";

export default async function handler(req, res)
{

    const endpoint = "https://api.clerk.com/v1/users";

    const resp = await fetch(endpoint, {
        headers: {
            "Authorization": process.env.clerk_secret
        }
    });

    const data = await resp.json();
    let userIds = [];
    let fullNames = [];

    for (let i = 0; i < data.length; i++)
    {
        userIds.push(data[i].id);

        if (data[i].last_name)
        {
            fullNames.push(data[i].first_name + " " + data[i].last_name);

        } else
        {
            fullNames.push(data[i].first_name);
        }
    }

    const client = await clientPromise;
    const db = await client.db("calendo-cluster");
    const collection = await db.collection("tasks");

    let useReq = JSON.parse(req.body);

    let task = {
        name: useReq.name,
        due: useReq.due, // should be new Date()
        created_by: useReq.created_by,
        owner: useReq.owner, // this would be a UUID that matches w/clerk
        ownerFullName: useReq.ownerFullName,
        completed: useReq.completed, // true/false
        category: useReq.category,
        priority: useReq.priority // 1 is the highest
    };

    let tasks = [];

    for (let j = 0; j < userIds.length; j++)
    {

        tasks.push({
            ...task, owner: userIds[j], ownerFullName: fullNames[j]
        });
    }

    console.log(tasks);


    console.log(userIds);
    console.log("done");


    try
    {
        const client = await clientPromise;
        const db = await client.db("calendo-cluster");
        const collection = await db.collection("tasks");

        const resp = await collection.insertMany(tasks);

    } catch (e)
    {
        res.status(500).json({ success: false });
    }

    res.status(200).json({ success: true });
}