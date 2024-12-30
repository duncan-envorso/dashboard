'use server';
import { currentTeamConfig } from '@/teamConfig';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authConfig from '@/auth.config';
import { CombinedTeamData } from '@/types/team';
import {
  Article,
  ArticleListResponse,
  CreateArticleResponse
} from '@/types/newsarticle';
import { authOptions } from '@/auth';
import { cache } from 'react';
import { customFetch } from '@/lib/customFetch';
import { MatchData } from '@/types/schedule';
import { revalidatePath } from 'next/cache';
import { NotificationPayload } from '@/types';
import { LiveMatchData } from '@/types/match';

const API_URL = process.env.NEXT_API_URL;
if (!API_URL) {
  throw new Error('NEXT_API_URL environment variable is not defined');
}

const TEAM_ID = '034db172-942f-48b8-bc91-a0b3eb3a025f';

export async function createArticle(formData: any) {
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
  // Log environment for debugging
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('API URL:', process.env.NEXT_API_URL);

  if (!currentTeamConfig) {
    notFound();
  }

  const requestConfig = {
    headers: {
      'x-client-app-version': '2.0.17',
      'Content-Type': 'application/json'
    },
    next: {
      revalidate: 0 // Disable cache in production
    }
  };

  try {
    const [rosterResponse, staffResponse] = await Promise.all([
      fetch(`${API_URL}/teams/${TEAM_ID}/roster`, requestConfig),
      fetch(`${API_URL}/teams/${TEAM_ID}/staff`, requestConfig)
    ]);

    if (!rosterResponse.ok || !staffResponse.ok) {
      throw new Error(
        `API Error: ${rosterResponse.status} ${staffResponse.status}`
      );
    }

    const [roster, staff] = await Promise.all([
      rosterResponse.json(),
      staffResponse.json()
    ]);

    return { roster, staff };
  } catch (error) {
    console.error('Error fetching team data:', error);
    throw error;
  }
}

export async function getMatchData(matchId: string): Promise<LiveMatchData> {
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
    return data as LiveMatchData;
  } catch (error) {
    console.log('Error fetching match data:', error);
    throw error;
  }
}

export async function getPosts(page = 1, perPage = 20): Promise<Article[]> {
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
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const endpoint = `${API_URL}/teams/${teamId}/${type}${
    memberId ? `/${memberId}` : ''
  }`;

  console.log(endpoint);

  const response = await fetch(endpoint, {
    method: memberId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  console.log(response);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || `Failed to ${memberId ? 'update' : 'add'} team member`
    );
  }

  return response.json();
}

export async function uploadImage(file: FormData, token: string) {
  console.log('API_URL:', API_URL);

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

export async function deleteMember({
  teamId,
  memberId,
  type,
  token
}: {
  teamId: string;
  memberId: string;
  type: 'staff' | 'roster';
  token: string;
}) {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  console.log('memberId', memberId);

  const response = await fetch(
    `${API_URL}/teams/${teamId}/${type}/${memberId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete team member');
  }

  return true;
}

export const getMatches = cache(async () => {
  try {
    const data: MatchData = await customFetch('matches', {
      tags: ['matches'],
      revalidate: 60 // Revalidate every minute
    });

    return {
      matches: [...data.upcomingMatchesData, ...data.pastMatchesData].sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ),
      error: null
    };
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return {
      matches: [],
      error: 'Failed to load matches. Please try again later.'
    };
  }
});

export async function updateMatchTicketUrl(
  matchId: string,
  ticketsUrl: string
) {
  try {
    await customFetch(`matches/${matchId}`, {
      method: 'PUT',
      body: JSON.stringify({ ticketsUrl }),
      tags: ['matches'] // Add tag for revalidation
    });
    return { success: true, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: message };
  }
}

export async function createOrUpdateArticle(
  articleData: Partial<ArticleListResponse> & {
    team_id: string;
    title: string;
    text: string;
  },
  articleId?: string
) {
  try {
    const endpoint = articleId ? `articles/${articleId}` : 'articles';
    const method = articleId ? 'PUT' : 'POST';

    const response = await customFetch(endpoint, {
      method,
      body: JSON.stringify(articleData),
      tags: ['articles']
    });

    revalidatePath('/dashboard/news-articles');

    return {
      success: true,
      data: response as CreateArticleResponse,
      error: null
    };
  } catch (error) {
    let errorMessage = 'Failed to save the article. Please try again.';

    if (error instanceof Error) {
      if (error.message.includes('413')) {
        errorMessage =
          'Article content is too large. Please reduce the size or remove some images.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Your session has expired. Please log in again.';
      }
    }

    return {
      success: false,
      data: null,
      error: errorMessage
    };
  }
}

export async function sendNotification(
  payload: NotificationPayload,
  teamId: string
) {
  try {
    const response = await customFetch(`panel/notifications?teamId=${teamId}`, {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        key: 'ENVORSO_HAS_THE_HIGHEST_SECURITY_KEY_EVER_$123&&'
      })
    });

    return {
      success: true,
      data: response,
      error: null
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : 'Failed to send notification'
    };
  }
}
