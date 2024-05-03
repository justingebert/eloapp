import { NextResponse } from 'next/server'
import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";

export async function POST(req: any, res: NextResponse) {
    await dbConnect();

    const data = await req.json();
    console.log(data);

    try {

        const factor = 40

        const winningUser1 = await User.findOne({ username: data.winningTeam[0] });
        const winningUser2 = await User.findOne({ username: data.winningTeam[1] });
        const losingUser1 = await User.findOne({ username: data.losingTeam[0] });
        const losingUser2 = await User.findOne({ username: data.losingTeam[1] });

        console.log("Winning User 1:", winningUser1);
console.log("Winning User 2:", winningUser2);
console.log("Losing User 1:", losingUser1);
console.log("Losing User 2:", losingUser2);

        // Retrieve the current ELO for each user
        const winningUser1Elo = winningUser1.elo[winningUser1.elo.length - 1];
        const winningUser2Elo = winningUser2.elo[winningUser2.elo.length - 1];
        const losingUser1Elo = losingUser1.elo[losingUser1.elo.length - 1];
        const losingUser2Elo = losingUser2.elo[losingUser2.elo.length - 1];

        console.log(winningUser1Elo, winningUser2Elo, losingUser1Elo, losingUser2Elo);

        // Calculate the ELO differences
        const difW1 = ((11 + 10 * Math.abs(winningUser1Elo - losingUser1Elo) / factor) + (11 + 10 * Math.abs(winningUser1Elo - losingUser2Elo) / factor)) / 2;
        const difW2 = ((11 + 10 * Math.abs(winningUser2Elo - losingUser1Elo) / factor) + (11 + 10 * Math.abs(winningUser2Elo - losingUser2Elo) / factor)) / 2;
        const difL1 = -((11 + 10 * Math.abs(losingUser1Elo - winningUser1Elo) / factor) + (11 + 10 * Math.abs(losingUser1Elo - winningUser2Elo) / factor)) / 2;
        const difL2 = -((11 + 10 * Math.abs(losingUser2Elo - winningUser1Elo) / factor) + (11 + 10 * Math.abs(losingUser2Elo - winningUser2Elo) / factor)) / 2;

        console.log(difW1, difW2, difL1, difL2);

        // Update the ELO scores for each user
        /* await Promise.all([
            User.findByIdAndUpdate(winningUser1._id, { $push: { elo: winningUser1Elo + difW1 } }),
            User.findByIdAndUpdate(winningUser2._id, { $push: { elo: winningUser2Elo + difW2 } }),
            User.findByIdAndUpdate(losingUser1._id, { $push: { elo: losingUser1Elo + difL1 } }),
            User.findByIdAndUpdate(losingUser2._id, { $push: { elo: losingUser2Elo + difL2 } }),
        ]); */

        await winningUser1.addElo(winningUser1Elo + difW1)
        await winningUser2.addElo(winningUser2Elo + difW2)
        await losingUser1.addElo(losingUser1Elo + difL1)
        await losingUser2.addElo(losingUser2Elo + difL2)

       
        // Create a response message
        const message = {
            [winningUser1.username]: difW1,
            [winningUser2.username]: difW2,
            [losingUser1.username]: difL1,
            [losingUser2.username]: difL2,
        };

        return NextResponse.json(message);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
}
