'use server';
import { currentTeamConfig } from '@/teamConfig';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authConfig from '@/auth.config';
import { MatchData } from '@/types/match';
import { CombinedTeamData, RosterMember, StaffMember } from '@/types/team';
import { Article } from '@/types/newsarticle';
import { authOptions } from '@/auth';

const API_URL = `${process.env.NEXT_API_URL}`;
if (!API_URL) {
  console.log('NEXT_API_URL is not defined in the environment variables');
}

const TEAM_ID = '034db172-942f-48b8-bc91-a0b3eb3a025f';

export async function createArticle(formData: any) {
  const API_URL = `${process.env.NEXT_API_URL}`;

  const response = await fetch(`${API_URL}/articles`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    console.log('Failed to create article');
  }

  return response.json();
}

export async function getUsers() {
  const API_URL = `${process.env.NEXT_API_URL}`;

  try {
    const session = await getServerSession(authConfig);
    const token = session?.user?.token;

    if (!token) {
      console.log('No authentication token available');
    }

    const response = await fetch(`${API_URL}/teams/${TEAM_ID}/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`Failed to fetch users: ${response.statusText}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getUserPermissions(userId: string) {
  const API_URL = `${process.env.NEXT_API_URL}`;

  try {
    const session = await getServerSession(authConfig);
    const token = session?.user?.token;

    if (!token) {
      console.log('No authentication token available');
    }

    const response = await fetch(`${API_URL}/users/${userId}/permissions`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`Failed to fetch user permissions: ${response.statusText}`);
    }

    const permissions = await response.json();
    return permissions;
  } catch (error) {
    console.log('Error fetching user permissions:', error);
    return { error: 'Failed to fetch user permissions' };
  }
}

export async function fetchTeamData(): Promise<CombinedTeamData> {
  const API_URL = `${process.env.NEXT_API_URL}`;

  if (!currentTeamConfig) {
    notFound();
  }

  const baseUrl = `${API_URL}/teams`;
  const requestConfig = {
    headers: {
      'x-client-app-version': '2.0.17'
    }
  };

  try {
    const [rosterResponse, staffResponse] = await Promise.all([
      fetch(`${baseUrl}/${TEAM_ID}/roster`, requestConfig),
      fetch(`${baseUrl}/${TEAM_ID}/staff`, requestConfig)
    ]);

    if (!rosterResponse.ok || !staffResponse.ok) {
      console.log(
        `Failed to fetch data: ${!rosterResponse.ok ? 'roster' : ''} ${
          !staffResponse.ok ? 'staff' : ''
        }`
      );
    }

    const [roster, staff] = await Promise.all([
      rosterResponse.json(),
      staffResponse.json()
    ]);

    roster.sort(
      (
        a: { createdAt: string | number | Date },
        b: { createdAt: string | number | Date }
      ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    staff.sort(
      (
        a: { createdAt: string | number | Date },
        b: { createdAt: string | number | Date }
      ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { roster, staff };
  } catch (error) {
    console.log('Error fetching team data:', error);
    notFound();
  }
}

export async function getMatchData(matchId: string): Promise<MatchData> {
  const API_URL = `${process.env.NEXT_API_URL}`;

  try {
    const response = await fetch(
      `${API_URL}/matches/${matchId}?responseType=preview`,
      {
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as MatchData;
  } catch (error) {
    console.log('Error fetching match data:', error);
    throw error;
  }
}

export async function getPosts(page = 1, perPage = 20): Promise<Article[]> {
  const API_URL = `${process.env.NEXT_API_URL}`;

  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    console.log('Not authenticated');
  }

  try {
    const response = await fetch(
      `${API_URL}/articles?teamId=seawolvesTeamId&status=draft&status=published`,
      {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          accept: 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.log(error.message || 'Failed to fetch articles');
    }

    const data: Article[] = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching posts:', error);
    throw error;
  }
}

export async function getArticle(id: string) {
  const API_URL = `${process.env.NEXT_API_URL}`;

  try {
    const response = await fetch(`${API_URL}/articles/${id}`);
    const data = response.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function upsertTeamMember({
  teamId,
  type,
  memberId,
  data,
  token
}: {
  teamId: string;
  type: 'staff' | 'roster';
  memberId?: string;
  data: any;
  token: string;
}) {
  const API_URL = `${process.env.NEXT_API_URL}`;

  console.log('API_URL', API_URL);

  const endpoint = `${API_URL}/teams/${teamId}/${type}${
    memberId ? `/${memberId}` : ''
  }`;

  console.log('endpoint', endpoint);

  const response = await fetch(endpoint, {
    method: memberId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  console.log('response', response);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || `Failed to ${memberId ? 'update' : 'add'} team member`
    );
  }

  return response.json();
}

export async function uploadImage(file: FormData, token: string) {
  console.log('API_URL:', API_URL); // Debug

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: file
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
}
