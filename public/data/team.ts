export interface Player {
    id: string
    name: string
    position: string
    position_group_id: string
    height: number
    weight: number
    portrait: string
    thumbnail: string
}



export const positionGroups = {
    "1": "Forward",
    "2": "Back",
    // Add more position groups as needed
}


export const initialPlayers = [
    { id: "493d2fc5-c546-4b0e-9421-532d29e8079f", name: "Charlie Abel", position: "Prop", position_group_id: "1", height: 183, weight: 122, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots35.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots35.png" },
    { id: "8a763467-37b4-45aa-af7d-3911a07660af", name: "Fred Apulu", position: "Prop", position_group_id: "1", height: 188, weight: 135, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots36.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots36.png" },
    { id: "46a75bbc-3e25-4f69-a091-06927f1dfa0e", name: "Nate Augspurger", position: "Wing", position_group_id: "3", height: 173, weight: 82, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2024/02/2024Headshots2.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2024/02/2024Headshots2.png" },
    { id: "14da3bd7-b3f4-4ca7-8515-8762a04a901b", name: "Michael Baska", position: "Utility Back", position_group_id: "3", height: 185, weight: 86, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots13.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots13.png" },
    { id: "11eca2bc-2030-4f58-a34c-26714e8e3e69", name: "Conall Boomer", position: "Flanker", position_group_id: "2", height: 193, weight: 110, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots19.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots19.png" },
    { id: "6318e63f-2cd1-42a4-8ba1-2e9f16707d5d", name: "Noah Brown", position: "Wing", position_group_id: "3", height: 183, weight: 91, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots14.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots14.png" },
    { id: "1471dfdf-7222-4151-9846-1beb74d7c1d8", name: "Bryce Campbell", position: "Center", position_group_id: "3", height: 188, weight: 102, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots26.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots26.png" },
    { id: "36d6cb63-5fe9-4fa2-871d-d46cc9a71f1c", name: "Adriaan Carelse", position: "Fullback", position_group_id: "3", height: 173, weight: 80, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots12.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots12.png" },
    { id: "71ada362-9854-443f-8d59-1ae16c1c6b5b", name: "Luke Carty", position: "Flyhalf", position_group_id: "2", height: 183, weight: 91, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots11.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots11.png" },
    { id: "fe5451c9-de64-4cd9-b5c3-ce9504900c00", name: "Daelan Denenberg", position: "Wing", position_group_id: "3", height: 185, weight: 89, portrait: "", thumbnail: "" },
    { id: "b4441dd2-26c1-4c06-9ca7-20f8c81b7b97", name: "Julian Dominguez", position: "Wing", position_group_id: "3", height: 191, weight: 101, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots10.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots10.png" },
    { id: "b1f228b6-5ff3-44ed-9643-be1c9e72c15f", name: "Caolan Dooley", position: "Utility Back", position_group_id: "3", height: 188, weight: 93, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots6.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots6.png" },
    { id: "a09f117f-2412-42f4-a585-b3a2a5027213", name: "Dylan Fawsitt", position: "Hooker", position_group_id: "1", height: 183, weight: 107, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots17.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots17.png" },
    { id: "4727a0c9-f9ea-4761-a200-504eaf561b08", name: "Mason Flesch", position: "Flanker", position_group_id: "2", height: 196, weight: 113, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots33.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots33.png" },
    { id: "de55961f-b390-41cd-8b9b-1998776fa2d6", name: "Willis Goodwin", position: "Wing", position_group_id: "3", height: 178, weight: 75, portrait: "", thumbnail: "" },
    { id: "14cdb4bd-a38b-4afb-9858-4892877e7f8e", name: "Michael Hand", position: "Wing", position_group_id: "3", height: 193, weight: 104, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots7.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots7.png" },
    { id: "617622e0-919b-4d64-8520-ad6831984d34", name: "Jason Higgins", position: "Scrumhalf", position_group_id: "2", height: 185, weight: 91, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2024/02/2024Headshots4.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2024/02/2024Headshots4.png" },
    { id: "72864170-4676-4ba1-9b13-37df0d6616ab", name: "Maclean Jones", position: "Flanker", position_group_id: "2", height: 185, weight: 102, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots32.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots32.png" },
    { id: "3a582be1-6584-47fe-b240-8482b523524c", name: "Dave Kearney", position: "Wing / Fullback", position_group_id: "3", height: 180, weight: 89, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots9.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots9.png" },
    { id: "a407045a-dbce-4b40-b1df-a41c0fb9e653", name: "Ben Landry", position: "Flanker / Lock", position_group_id: "2", height: 198, weight: 120, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots20.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots20.png" },
    { id: "d42e81f2-f483-4fd3-8bae-46de7c68add2", name: "Cassh Maluia", position: "Outside Back", position_group_id: "3", height: 183, weight: 116, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots8.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots8.png" },
    { id: "c3d76fe3-afbc-4f14-ab89-e9e5fa0d666c", name: "Michael Matarazzo", position: "Lock / Flanker", position_group_id: "2", height: 196, weight: 111, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots28.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots28.png" },
    { id: "34535195-f2a0-468a-9a59-f398c6b50630", name: "Nick McCarthy", position: "Scrumhalf", position_group_id: "2", height: 180, weight: 89, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots5.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots5.png" },
    { id: "a4773392-386e-4219-a435-ea7bb568d205", name: "Kian Meadon", position: "Flyhalf / Fullback", position_group_id: "3", height: 180, weight: 84, portrait: "", thumbnail: "" },
    { id: "54d363f8-c6dc-432b-8398-f896f0c24602", name: "Billy Meakes", position: "Center", position_group_id: "3", height: 185, weight: 90, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots15.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots15.png" },
    { id: "b33a7b2d-2458-4d50-a9eb-b3e6f01ca1ed", name: "George Merrick", position: "Lock", position_group_id: "2", height: 203, weight: 125, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots29.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots29.png" },
    { id: "68b47048-be32-4fb8-9276-ed2cfe8c0592", name: "Tinashe Muchena", position: "Back Row", position_group_id: "2", height: 191, weight: 110, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots30.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots30.png" },
    { id: "1f3f31e6-87f4-4b6c-9444-24cb1d914cd9", name: "Mark O'Keeffe", position: "Center", position_group_id: "3", height: 185, weight: 98, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2024/02/2024Headshots.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2024/02/2024Headshots.png" },
    { id: "64f4c654-2b65-4eb4-8234-e0e5f9a08953", name: "Ethan Parkins", position: "Flanker", position_group_id: "2", height: 188, weight: 98, portrait: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots27.png", thumbnail: "https://www.chicagohounds.com/wp-content/uploads/sites/18/2023/02/2024Headshots27.png" },
]