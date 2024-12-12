import { currentTeamConfig } from '@/teamConfig';
import { BlogPost } from '@/types';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authConfig from '@/auth.config';
import { MatchData } from '@/types/match';
import { CombinedTeamData } from '@/types/team';

const session = getServerSession(authConfig);

export async function getPosts(): Promise<BlogPost[]> {
  return [
    {
      id: 1,
      title: 'First Blog Post',
      author: 'John Doe',
      status: 'published',
      createdAt: '2024-09-01'
    },
    {
      id: 2,
      title: 'Second Blog Post',
      author: 'Jane Smith',
      status: 'draft',
      createdAt: '2024-09-02'
    },
    {
      id: 3,
      title: 'Third Blog Post',
      author: 'Alice Johnson',
      status: 'published',
      createdAt: '2024-09-03'
    },
    {
      id: 4,
      title: 'Fourth Blog Post',
      author: 'Bob Brown',
      status: 'archived',
      createdAt: '2024-09-04'
    }
  ];
}

export async function getUsers() {
  try {
    const token = await session.then((session) => session?.user?.token);

    // Set up the request with the Bearer token
    const response = await fetch(
      'https://api.seawolves.envorso.com/v1/teams/034db172-942f-48b8-bc91-a0b3eb3a025f/users',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const users = await response.json();
    return users; // Return users as an array of objects (users could be an array or an object)
  } catch (error) {
    console.error('Error fetching users:', error);
    return []; // Return an empty array if fetching fails
  }
}

export async function getUserPermissions(userId: string) {
  try {
    const token = await session.then((session) => session?.user?.token);
    // Correct the template string syntax by using backticks
    const response = await fetch(
      `https://api.seawolves.envorso.com/v1/users/${userId}/permissions`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Adding the Bearer token to the headers
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const users = await response.json();
    return users; // Return users as a plain object
  } catch (error) {
    console.error('Error fetching users:', error);
    return { error: 'Failed to fetch users' }; // Custom error response as a plain object
  }
}

export async function fetchTeamData(): Promise<CombinedTeamData> {
  if (!currentTeamConfig) {
    console.log('Team configuration not found');
    notFound();
  }

  const teamId = '034db172-942f-48b8-bc91-a0b3eb3a025f'; // Using the specific team ID
  const baseUrl = 'https://api.seawolves.envorso.com/v1/teams';

  const requestConfig = {
    headers: {
      'x-client-app-version': '2.0.17'
    },
    next: { revalidate: 3600 } // Revalidate every hour
  };

  try {
    const [rosterResponse, staffResponse] = await Promise.all([
      fetch(`${baseUrl}/${teamId}/roster`, requestConfig),
      fetch(`${baseUrl}/${teamId}/staff`, requestConfig)
    ]);

    if (!rosterResponse.ok || !staffResponse.ok) {
      throw new Error(
        `Failed to fetch data: ${!rosterResponse.ok ? 'roster' : ''} ${
          !staffResponse.ok ? 'staff' : ''
        }`
      );
    }

    const [roster, staff] = await Promise.all([
      rosterResponse.json(),
      staffResponse.json()
    ]);

    return {
      roster,
      staff
    };
  } catch (error) {
    console.error('Error fetching team data:', error);
    notFound(); // This will render the closest not-found page
  }
}

export async function getMatchData(matchId: string): Promise<MatchData> {
  try {
    const response = await fetch(
      `https://api.seawolves.envorso.com/v1/matches/${matchId}?responseType=preview`,
      {
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as MatchData;
  } catch (error) {
    console.error('Error fetching match data:', error);
    throw error;
  }
}
