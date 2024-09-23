export interface Player {
    id: string;
    name: string;
    position: string;
    position_group_id: number | null;
    height: number;
    weight: number;
    portrait: string;
    thumbnail: string;
}

export interface Coach {
    id: number;
    name: string;
    job_title: string;
    portrait: string;
}

export interface TeamData {
    players: Player[];
    coaches: Coach[];
    staff: any[]; // Assuming staff is empty based on the provided data
}

export const positionGroups = {
    "1": "Forward",
    "2": "Back",
    "3": "Specialist",
    "4": "Staff"
}