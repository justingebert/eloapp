import { NextResponse } from 'next/server';
import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";

export async function POST(req:any, res:NextResponse) {
    await dbConnect();
    const data = await req.json();
    try {
        const k = 40;

        const { winningTeam, losingTeam, winningScore, losingScore } = data;

        const winningUser1 = await User.findOne({ username: winningTeam[0] });
        const winningUser2 = await User.findOne({ username: winningTeam[1] });
        const losingUser1 = await User.findOne({ username: losingTeam[0] });
        const losingUser2 = await User.findOne({ username: losingTeam[1] });

        // Retrieve the current ELO for each user
        const winningUser1Elo = winningUser1.elo[winningUser1.elo.length - 1];
        const winningUser2Elo = winningUser2.elo[winningUser2.elo.length - 1];
        const losingUser1Elo = losingUser1.elo[losingUser1.elo.length - 1];
        const losingUser2Elo = losingUser2.elo[losingUser2.elo.length - 1];

        const T1 = (winningUser1Elo + winningUser2Elo) / 2;
        const T2 = (losingUser1Elo + losingUser2Elo) / 2;

        const EW = T1 / T2;
        const score = winningScore / (winningScore + losingScore);

        function Rn(k:number, S:number, E:number) {
            return k * (S - E);
        }

        const delta_T1 = Rn(k, score, EW);
        const delta_T2 = Rn(k, -score, -EW);

        let ds1, ds2, ds3, ds4;

        if (score > 0.5) {
            ds1 = (winningUser2Elo / winningUser1Elo) * delta_T1 / 2;
            ds2 = (winningUser1Elo / winningUser2Elo) * delta_T1 / 2;
            ds3 = (losingUser1Elo / losingUser2Elo) * delta_T2 / 2;
            ds4 = (losingUser2Elo / losingUser1Elo) * delta_T2 / 2;
        } else {
            ds1 = (winningUser1Elo / winningUser2Elo) * delta_T1 / 2;
            ds2 = (winningUser2Elo / winningUser1Elo) * delta_T1 / 2;
            ds3 = (losingUser2Elo / losingUser1Elo) * delta_T2 / 2;
            ds4 = (losingUser1Elo / losingUser2Elo) * delta_T2 / 2;
        }

        const eloChangeW1 = Math.round(ds1);
        const eloChangeW2 = Math.round(ds2);
        const eloChangeL1 = Math.round(ds3);
        const eloChangeL2 = Math.round(ds4);

        await winningUser1.addElo(winningUser1Elo + eloChangeW1);
        await winningUser2.addElo(winningUser2Elo + eloChangeW2);
        await losingUser1.addElo(losingUser1Elo + eloChangeL1);
        await losingUser2.addElo(losingUser2Elo + eloChangeL2);

        const message = {
            [winningUser1.username]: eloChangeW1,
            [winningUser2.username]: eloChangeW2,
            [losingUser1.username]: eloChangeL1,
            [losingUser2.username]: eloChangeL2,
        };

        return NextResponse.json(message);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
}
