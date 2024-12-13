/* eslint-disable no-console */
import { currentTeamConfig } from '@/teamConfig';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authConfig from '@/auth.config';
import { MatchData } from '@/types/match';
import { CombinedTeamData } from '@/types/team';
import { Article } from '@/types/newsarticle';
import { authOptions } from '@/auth';

export async function createArticle(formData: any) {
  const response = await fetch(
    'https://api.seawolves.envorso.com/v1/articles',
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create article');
  }

  return response.json();
}

export async function getUsers() {
  try {
    // Get session inside the function
    const session = await getServerSession(authConfig);
    const token = session?.user?.token;

    if (!token) {
      throw new Error('No authentication token available');
    }

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

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getUserPermissions(userId: string) {
  try {
    // Get session inside the function
    const session = await getServerSession(authConfig);
    const token = session?.user?.token;

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(
      `https://api.seawolves.envorso.com/v1/users/${userId}/permissions`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user permissions: ${response.statusText}`
      );
    }

    const permissions = await response.json();
    return permissions;
  } catch (error) {
    console.log('Error fetching user permissions:', error);
    return { error: 'Failed to fetch user permissions' };
  }
}

export async function fetchTeamData(): Promise<CombinedTeamData> {
  if (!currentTeamConfig) {
    notFound();
  }
  const teamId = '034db172-942f-48b8-bc91-a0b3eb3a025f';
  const baseUrl = 'https://api.seawolves.envorso.com/v1/teams';
  const requestConfig = {
    headers: {
      'x-client-app-version': '2.0.17'
    }
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
    console.log('Error fetching team data:', error);
    notFound();
  }
}

export async function getMatchData(matchId: string): Promise<MatchData> {
  try {
    const response = await fetch(
      `https://api.seawolves.envorso.com/v1/matches/${matchId}?responseType=preview`,
      {
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as MatchData;
  } catch (error) {
    console.log('Error fetching match data:', error);
    throw error;
  }
}

export async function getPosts(page = 1, perPage = 20): Promise<Article[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(
      `https://api.seawolves.envorso.com/v1/articles?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
          accept: 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch articles');
    }

    const data: Article[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}
