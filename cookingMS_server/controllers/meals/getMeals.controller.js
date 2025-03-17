import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const gettingAllMeals = async(req, res) => {
    try {
        const allMeals = await prisma.meal.findMany();

        if (allMeals.length > 0) {
            res.status(200).send({data: allMeals});
        }else{
            res.status(401).send({message: "No meals available"});

        }
    } catch (error) {
        
        res.status(500).send({data:"Something went wrong"});
    }
}

export default gettingAllMeals;