import { NextResponse } from 'next/server'
import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";

export async function POST(req: any, res: NextResponse) {
    await dbConnect();
    const data = await req.json();
    try {
        const factor = 400

        const winningUser1 = await User.findOne({ username: data.winningTeam[0] });
        const winningUser2 = await User.findOne({ username: data.winningTeam[1] });
        const losingUser1 = await User.findOne({ username: data.losingTeam[0] });
        const losingUser2 = await User.findOne({ username: data.losingTeam[1] });

        // Retrieve the current ELO for each user
        const winningUser1Elo = winningUser1.elo[winningUser1.elo.length - 1];
        const winningUser2Elo = winningUser2.elo[winningUser2.elo.length - 1];
        const losingUser1Elo = losingUser1.elo[losingUser1.elo.length - 1];
        const losingUser2Elo = losingUser2.elo[losingUser2.elo.length - 1];

        const winningTeamElo = (winningUser1Elo + winningUser2Elo) / 2;
        const losingTeamElo = (losingUser1Elo + losingUser2Elo) / 2;
        
        let ratioFactorW = losingTeamElo / winningTeamElo;

        // Calculate the ELO differences    
        const aMinusC = winningUser1Elo - losingUser1Elo;
        const aMinusD = winningUser1Elo - losingUser2Elo;
        const bMinusC = winningUser2Elo - losingUser1Elo;
        const bMinusD = winningUser2Elo - losingUser2Elo;

        const cMinusA = losingUser1Elo - winningUser1Elo;
        const cMinusB = losingUser1Elo - winningUser2Elo;
        const dMinusA = losingUser2Elo - winningUser1Elo;
        const dMinusB = losingUser2Elo - winningUser2Elo;


        let difW1 = (((1/(1 + Math.pow(10, aMinusC / factor))) + (1/(1 + Math.pow(10, aMinusD / factor)))) / 2 )* ratioFactorW *10;
        let difW2 = (((1/(1 + Math.pow(10, bMinusC / factor))) + (1/(1 + Math.pow(10, bMinusD / factor)))) / 2 )* ratioFactorW *10;
        let difL1 = -((((1/(1 + Math.pow(10, cMinusA / factor))) + (1/(1 + Math.pow(10, cMinusB / factor)))) / 2 )* ratioFactorW *10);
        let difL2 = -((((1/(1 + Math.pow(10, dMinusA / factor))) + (1/(1 + Math.pow(10, dMinusB / factor)))) / 2 )* ratioFactorW *10);

        difW1 = Math.round(difW1);
        difW2 = Math.round(difW2);
        difL1 = Math.round(difL1);
        difL2 = Math.round(difL2);

        await winningUser1.addElo(winningUser1Elo + difW1)
        await winningUser2.addElo(winningUser2Elo + difW2)
        await losingUser1.addElo(losingUser1Elo + difL1)
        await losingUser2.addElo(losingUser2Elo + difL2)

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
