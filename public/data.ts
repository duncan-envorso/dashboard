export const mockEvents = [
    { id: 1, type: 'score', time: '05', details: 'Team A scores a penalty', score: '3 - 0' },
    { id: 2, type: 'try', time: '15', details: 'Team B scores a try', score: '3 - 5' },
    { id: 3, type: 'card', time: '22', details: 'Team A player receives a yellow card' },
    { id: 4, type: 'score', time: '28', details: 'Team B scores a conversion', score: '3 - 7' },
]
  
  const config = {
    title: 'Live Rugby Match',
    imageUrl: '/placeholder.svg?height=300&width=400',
    textColor: '#000000',
    buttonBackground: '#4CAF50',
    buttonTextColor: '#FFFFFF',
    buttonText: 'Watch Now'
  }


  export interface Team {
    name: string;
    shortName: string;
    wins: number;
    losses: number;
    draws: number;
    image_path: string;
  }
  
  export interface Match {
    venue: string;
    start_time: string;
    round: number;
    name: string;
    match_id: string;
    match_type: string;
    home_score: number;
    away_score: number;
    homeTeam: Team;
    awayTeam: Team;
  }
  
  export interface RugbyData {
    upcomingMatchesData: Match[];
    pastMatchesData: Match[];
  }

  export const rugbyData: RugbyData = {
    "upcomingMatchesData": [{
      "venue": "Snapdragon Stadium, San Diego",
      "start_time": "2024-06-30T02:00:00.000Z",
      "round": 18,
      "name": "San Diego Legion vs Seattle Seawolves",
      "match_id": "1c5bdefe-5bd5-4ae5-bbec-8f19d21877c8",
      "match_type": "Regular Season",
      "home_score": 45,
      "away_score": 33,
      "homeTeam": {
        "name": "San Diego Legion",
        "shortName": "Legion",
        "wins": 11,
        "losses": 5,
        "draws": 0,
        "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/7ea9b87e-8a71-450d-a744-545048d7dc0d/large.png"
      },
      "awayTeam": {
        "name": "Seattle Seawolves",
        "shortName": "Seawolves",
        "wins": 11,
        "losses": 5,
        "draws": 0,
        "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
      }
    },],
    "pastMatchesData": [
      {
        "venue": "Snapdragon Stadium, San Diego",
        "start_time": "2024-06-30T02:00:00.000Z",
        "round": 18,
        "name": "San Diego Legion vs Seattle Seawolves",
        "match_id": "1c5bdefe-5bd5-4ae5-bbec-8f19d21877c8",
        "match_type": "Regular Season",
        "home_score": 45,
        "away_score": 33,
        "homeTeam": {
          "name": "San Diego Legion",
          "shortName": "Legion",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/7ea9b87e-8a71-450d-a744-545048d7dc0d/large.png"
        },
        "awayTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        }
      },
      {
        "venue": "Starfire Sports Complex, Tukwila",
        "start_time": "2024-06-23T02:00:00.000Z",
        "round": 17,
        "name": "Seattle Seawolves vs RFC Los Angeles",
        "match_id": "f21cd25b-15e8-4fb6-b4ad-ad4e41aa7ac5",
        "match_type": "Regular Season",
        "home_score": 29,
        "away_score": 12,
        "homeTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        },
        "awayTeam": {
          "name": "RFC Los Angeles",
          "shortName": "RFC Los Angeles",
          "wins": 5,
          "losses": 10,
          "draws": 1,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/471757ea-9d45-4508-b4f4-42d0cf4f014e/large.png"
        }
      },
      {
        "venue": "SaberCats Stadium, Houston",
        "start_time": "2024-06-15T23:00:00.000Z",
        "round": 16,
        "name": "Houston SaberCats vs Seattle Seawolves",
        "match_id": "c88a2deb-9e57-4420-9614-bd01eeec7f1f",
        "match_type": "Regular Season",
        "home_score": 28,
        "away_score": 25,
        "awayTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        },
        "homeTeam": {
          "name": "Houston SaberCats",
          "shortName": "SaberCats",
          "wins": 14,
          "losses": 2,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/6a4512c0-f54f-4979-942c-e823d99fa748/large.png"
        }
      },
      {
        "venue": "Starfire Sports Complex, Tukwila",
        "start_time": "2024-06-10T02:00:00.000Z",
        "round": 15,
        "name": "Seattle Seawolves vs Utah Warriors",
        "match_id": "3d7ecca0-6c16-402c-90f2-170265f964ac",
        "match_type": "Regular Season",
        "home_score": 68,
        "away_score": 29,
        "homeTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        },
        "awayTeam": {
          "name": "Utah Warriors",
          "shortName": "Warriors",
          "wins": 5,
          "losses": 11,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/e1b2f662-5fc9-4990-b426-d14f0b80b953/large.png"
        }
      },
      {
        "venue": "Starfire Sports Complex, Tukwila",
        "start_time": "2024-05-25T02:30:00.000Z",
        "round": 13,
        "name": "Seattle Seawolves vs Old Glory DC",
        "match_id": "fcb64700-5989-4228-bee1-09c7e61a8d2c",
        "match_type": "Regular Season",
        "home_score": 26,
        "away_score": 24,
        "awayTeam": {
          "name": "Old Glory DC",
          "shortName": "Old Glory",
          "wins": 7,
          "losses": 7,
          "draws": 2,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/09f042b2-7a4f-4fa2-bfc2-21e7469c764a/large.png"
        },
        "homeTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        }
      },
      {
        "venue": "Choctaw Stadium, Arlington",
        "start_time": "2024-05-19T23:00:00.000Z",
        "round": 12,
        "name": "Dallas Jackals vs Seattle Seawolves",
        "match_id": "8695ffa4-c241-4c06-ba02-f438e4704e2d",
        "match_type": "Regular Season",
        "home_score": 14,
        "away_score": 7,
        "awayTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        },
        "homeTeam": {
          "name": "Dallas Jackals",
          "shortName": "Jackals",
          "wins": 6,
          "losses": 10,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/a5bd5b72-ff43-4861-9056-86df1b9c9c96/large.png"
        }
      },
      {
        "venue": "The Gold Mine, New Orleans",
        "start_time": "2024-05-11T19:00:00.000Z",
        "round": 11,
        "name": "NOLA Gold vs Seattle Seawolves",
        "match_id": "958998ee-d131-4934-9d01-894965dec84f",
        "match_type": "Regular Season",
        "home_score": 32,
        "away_score": 31,
        "homeTeam": {
          "name": "NOLA Gold",
          "shortName": "NOLA",
          "wins": 10,
          "losses": 6,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/a8c0ea92-6d79-4774-95f2-5a558a2c70ca/large.png"
        },
        "awayTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        }
      },
      {
        "venue": "Starfire Sports Complex, Tukwila",
        "start_time": "2024-05-04T02:30:00.000Z",
        "round": 10,
        "name": "Seattle Seawolves vs Anthem RC",
        "match_id": "a13ac72b-edff-4c52-a984-ad6e12ade1ba",
        "match_type": "Regular Season",
        "home_score": 29,
        "away_score": 13,
        "awayTeam": {
          "name": "Anthem RC",
          "shortName": "Anthem RC",
          "wins": 0,
          "losses": 16,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/38ddf0d2-9eda-4e57-a134-d04437adb603/large.png"
        },
        "homeTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        }
      },
      {
        "venue": "Veterans Memorial Stadium, Quincy",
        "start_time": "2024-04-20T18:00:00.000Z",
        "round": 8,
        "name": "New England Free Jacks vs Seattle Seawolves",
        "match_id": "b7433868-9131-4cab-915a-5347a14ebe82",
        "match_type": "Regular Season",
        "home_score": 21,
        "away_score": 29,
        "homeTeam": {
          "name": "New England Free Jacks",
          "shortName": "Free Jacks",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/35c03f68-8fc0-4e15-b7ab-f4d559520218/large.png"
        },
        "awayTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        }
      },
      {
        "venue": "Dignity Health Sports Park, Carson",
        "start_time": "2024-04-14T22:00:00.000Z",
        "round": 7,
        "name": "RFC Los Angeles vs Seattle Seawolves",
        "match_id": "d8615e12-92fc-444c-8e17-d181e1ce69ac",
        "match_type": "Regular Season",
        "home_score": 5,
        "away_score": 36,
        "homeTeam": {
          "name": "RFC Los Angeles",
          "shortName": "RFC Los Angeles",
          "wins": 5,
          "losses": 10,
          "draws": 1,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/471757ea-9d45-4508-b4f4-42d0cf4f014e/large.png"
        },
        "awayTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        }
      },
      {
        "venue": "Starfire Sports Complex, Tukwila",
        "start_time": "2024-04-06T02:30:00.000Z",
        "round": 6,
        "name": "Seattle Seawolves vs Dallas Jackals",
        "match_id": "57df7447-e0a7-4e82-865c-ebcbd240cc46",
        "match_type": "Regular Season",
        "home_score": 34,
        "away_score": 32,
        "homeTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        },
        "awayTeam": {
          "name": "Dallas Jackals",
          "shortName": "Jackals",
          "wins": 6,
          "losses": 10,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/a5bd5b72-ff43-4861-9056-86df1b9c9c96/large.png"
        }
      },
      {
        "venue": "SeatGeek Stadium, Bridgeview",
        "start_time": "2024-03-30T22:00:00.000Z",
        "round": 5,
        "name": "Chicago Hounds vs Seattle Seawolves",
        "match_id": "ad0d55bd-ab45-4c97-b985-bab8a0697e1e",
        "match_type": "Regular Season",
        "home_score": 26,
        "away_score": 34,
        "homeTeam": {
          "name": "Chicago Hounds",
          "shortName": "Hounds",
          "wins": 8,
          "losses": 7,
          "draws": 1,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/17a788b5-2ac6-41d6-a320-f4d75cdd08b9/large.png"
        },
        "awayTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        }
      },
      {
        "venue": "Starfire Sports Complex, Tukwila",
        "start_time": "2024-03-23T02:30:00.000Z",
        "round": 4,
        "name": "Seattle Seawolves vs Houston SaberCats",
        "match_id": "306daced-1cae-43cd-9cdb-70e13d89b6e6",
        "match_type": "Regular Season",
        "home_score": 40,
        "away_score": 42,
        "homeTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        },
        "awayTeam": {
          "name": "Houston SaberCats",
          "shortName": "SaberCats",
          "wins": 14,
          "losses": 2,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/6a4512c0-f54f-4979-942c-e823d99fa748/large.png"
        }
      },
      {
        "venue": "Zions Bank Stadium, Herriman",
        "start_time": "2024-03-17T01:00:00.000Z",
        "round": 3,
        "name": "Utah Warriors vs Seattle Seawolves",
        "match_id": "5007f609-90e1-4b9a-a788-2e7ba291abe4",
        "match_type": "Regular Season",
        "home_score": 13,
        "away_score": 23,
        "awayTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        },
        "homeTeam": {
          "name": "Utah Warriors",
          "shortName": "Warriors",
          "wins": 5,
          "losses": 11,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/e1b2f662-5fc9-4990-b426-d14f0b80b953/large.png"
        }
      },
      {
        "venue": "Starfire Sports Complex, Tukwila",
        "start_time": "2024-03-10T03:00:00.000Z",
        "round": 2,
        "name": "Seattle Seawolves vs Miami Sharks",
        "match_id": "833bb33f-7e67-4e06-8d58-a21f772159c3",
        "match_type": "Regular Season",
        "home_score": 29,
        "away_score": 18,
        "homeTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        },
        "awayTeam": {
          "name": "Miami Sharks",
          "shortName": "Miami Sharks",
          "wins": 6,
          "losses": 10,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/255943d4-7613-4e21-8170-f7eae458ee2e/large.png"
        }
      },
      {
        "venue": "Starfire Sports Complex, Tukwila",
        "start_time": "2024-03-03T03:00:00.000Z",
        "round": 1,
        "name": "Seattle Seawolves vs San Diego Legion",
        "match_id": "ff55ec95-bb82-4059-90fc-562c11d77a48",
        "match_type": "Regular Season",
        "home_score": 25,
        "away_score": 19,
        "awayTeam": {
          "name": "San Diego Legion",
          "shortName": "Legion",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/7ea9b87e-8a71-450d-a744-545048d7dc0d/large.png"
        },
        "homeTeam": {
          "name": "Seattle Seawolves",
          "shortName": "Seawolves",
          "wins": 11,
          "losses": 5,
          "draws": 0,
          "image_path": "https://mobiithumbnails.azureedge.net/thumbnails/live/stratus/034db172-942f-48b8-bc91-a0b3eb3a025f/large.png"
        }
      }
    ]
  }