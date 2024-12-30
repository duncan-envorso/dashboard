'use server';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import authConfig from '@/auth.config';
import { getServerSession } from 'next-auth';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  teamId?: string;
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

// Create a memoized version of the fetch function using React cache
const cachedFetch = cache(async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    console.log(`API request failed with status ${response.status}`);
  }
  return response;
});

export async function customFetch(
  endpoint: string,
  options: FetchOptions = {}
) {
  const {
    skipAuth = false,
    cache: cacheOption = 'no-store',
    revalidate,
    tags = [],
    ...fetchOptions
  } = options;

  const apiUrl = process.env.NEXT_API_URL;
  if (!apiUrl) {
    throw new Error('API_URL environment variable is not defined');
  }

  // Construct the full URL
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${apiUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  console.log('url', url);
  // Default headers
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  // Add authorization header if not skipping auth
  if (!skipAuth) {
    const session = await getServerSession(authConfig);
    if (session?.accessToken) {
      headers.set('Authorization', `Bearer ${session.accessToken}`);
    }
  }

  // Prepare fetch options
  const mergedOptions: RequestInit = {
    ...fetchOptions,
    headers,
    cache: cacheOption,
    ...(revalidate !== undefined && { next: { revalidate } })
  };

  try {
    // Use unstable_cache for database or ORM operations that need caching
    const fetchData = unstable_cache(
      async () => {
        const response = await cachedFetch(url, mergedOptions);
        const data = await response.json();
        return data;
      },
      [url, JSON.stringify(mergedOptions)],
      {
        tags,
        revalidate: revalidate === false ? undefined : revalidate
      }
    );

    const data = await fetchData();
    console.log('data', data);

    // Return plain object to avoid serialization issues with client components
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    if (error instanceof Error) {
      error.message = `[${url}] ${error.message}`;
      console.log('Fetch error:', error);
    }
    throw error;
  }
}
