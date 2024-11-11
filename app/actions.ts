import { currentTeamConfig } from "@/teamConfig";
import { BlogPost, TeamData } from "@/types";
import { notFound } from "next/navigation";

export async function getPosts(): Promise<BlogPost[]> {
    return [
      { id: 1, title: "First Blog Post", author: "John Doe", status: "published", createdAt: "2024-09-01" },
      { id: 2, title: "Second Blog Post", author: "Jane Smith", status: "draft", createdAt: "2024-09-02" },
      { id: 3, title: "Third Blog Post", author: "Alice Johnson", status: "published", createdAt: "2024-09-03" },
      { id: 4, title: "Fourth Blog Post", author: "Bob Brown", status: "archived", createdAt: "2024-09-04" },
    ]
  }


  export async function fetchTeamData(): Promise<TeamData> {
    if (!currentTeamConfig) {
      console.error('Team configuration not found');
      notFound();
    }
  
    const teamId = currentTeamConfig.teamId;
  
    try {
      const response = await fetch(
        `https://api.seawolves.envorso.com/v1/teams/${teamId}/members`,
        {
          headers: {
            'x-client-app-version': '2.0.17'
          },
          next: { revalidate: 3600 } // Revalidate every hour
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }
  
      const data: TeamData = await response.json();
      
      // Optional: Log the fetched data (remove in production)
      console.log('Fetched team data:', data);
  
      return data;
    } catch (error) {
      console.error('Error fetching team data:', error);
      notFound(); // This will render the closest not-found page
    }
  }
