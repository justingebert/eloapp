export interface Game {
    _id: string;
    group: string;
    name: string;
    icon?: string;
    teamsize: number;
    players: string[];
    createdAt: string;
}

export interface Player {
    _id: string;
    group: string;
    name: string;
    createdAt: string;
}

export interface Group {
    _id?: string;
    id: string;
    name: string;
    passphrase: string;
    createdAt: string;
    players: string[];
    games: string[];
}
